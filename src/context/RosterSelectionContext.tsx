import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { Player, TierCap, DatabasePlayer } from "@/types";
import { useRosterData } from "@/hooks/useRosterData";
import { useSearchParams } from "react-router-dom";

interface RosterSelectionContextType {
	selectedTier: TierCap | undefined;
	setSelectedTier: (tier: TierCap) => void;
	players: Player[];
	setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
	handleTierChange: (tier: TierCap) => void;
	tierCaps: TierCap[];
	allPlayers: DatabasePlayer[];
	isTierDialogOpen: boolean;
	setIsTierDialogOpen: (open: boolean) => void;
	pendingTier: TierCap | undefined;
	confirmClearPlayers: () => void;
	keepPlayers: () => void;
}

const RosterSelectionContext = createContext<
	RosterSelectionContextType | undefined
>(undefined);

export const useRosterSelection = () => {
	const context = useContext(RosterSelectionContext);
	if (!context) {
		throw new Error(
			"useRosterSelection must be used within a RosterSelectionProvider",
		);
	}
	return context;
};

interface RosterSelectionProviderProps {
	children: ReactNode;
}

export const RosterSelectionProvider: React.FC<
	RosterSelectionProviderProps
> = ({ children }) => {
	const { allPlayers, tierCaps } = useRosterData();
	const [selectedTier, setSelectedTier] = useState<TierCap | undefined>();
	const [players, setPlayers] = useState<Player[]>([]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [isTierDialogOpen, setIsTierDialogOpen] = useState(false);
	const [pendingTier, setPendingTier] = useState<TierCap | undefined>();

	// Initialize selectedTier when tierCaps are loaded
	useEffect(() => {
		const savedTierId = searchParams.get("tier");
		if (tierCaps.length > 0) {
			if (savedTierId) {
				const foundTier = tierCaps.find((t) => t.id === savedTierId);
				if (foundTier) {
					setSelectedTier(foundTier);
					return;
				}
			}
			// Default to first tier if no param or invalid param, and no tier currently selected
			if (!selectedTier) {
				setSelectedTier(tierCaps[0]);
			}
		}
	}, [tierCaps, searchParams]);

	// Sync state from URL (Players)
	useEffect(() => {
		const playersString = searchParams.get("players");

		// Only attempt to read players from URL if we have the database loaded
		if (playersString && allPlayers.length > 0) {
			try {
				// Determine if we have a JSON array (old format) or comma-separated string (new format)
				let playerNames: string[] = [];
				if (playersString.startsWith("[")) {
					// Fallback for legacy JSON format during transition/testing
					const parsed = JSON.parse(decodeURIComponent(playersString));
					// If it's an array of objects, extract names; if strings, use as is
					if (parsed.length > 0 && typeof parsed[0] === "object") {
						playerNames = parsed.map((p: any) => p.player_name || p.name);
					} else {
						playerNames = parsed;
					}
				} else {
					playerNames = decodeURIComponent(playersString).split(",");
				}

				// Reconstruct player objects from allPlayers
				const reconstructedPlayers = playerNames
					.map((name) => {
						const found = allPlayers.find((p) => p.player_name === name);
						if (found) {
							// Manual mapping to ensure all required Player props are present
							// Note: Locks/Highlights are lost on refresh currently unless we store them too.
							// For now, defaulting to false as per previous implementation behavior on refresh?
							// Actually previous implementation didn't persist locks either via URL.
							const player: Player = {
								name: found.player_name,
								lock: false,
								highlight: false,
								...found,
							};
							return player;
						}
						return undefined;
					})
					.filter((p): p is Player => p !== undefined);

				// Only update if we found players and the list is effectively different
				// Check simple length first or name comparison
				const currentNamesVector = players
					.map((p) => p.name)
					.sort()
					.join(",");
				const newNamesVector = reconstructedPlayers
					.map((p) => p.name)
					.sort()
					.join(",");

				if (
					reconstructedPlayers.length > 0 &&
					currentNamesVector !== newNamesVector
				) {
					// Preserve existing locks/highlights if name matches?
					// If we want to persist state better, we should probably merge with existing 'players' state if available
					// But on initial load 'players' is empty.
					// For now, just setting reconstructed players.
					setPlayers(reconstructedPlayers);
				}
			} catch (e) {
				console.error("Failed to parse shared players", e);
			}
		}
	}, [searchParams, allPlayers]); // Removed players dependency to avoid loops, trust URL as source of truth on load/change

	// Sync state to URL (Tier)
	useEffect(() => {
		if (selectedTier) {
			const currentTierParam = searchParams.get("tier");
			if (currentTierParam !== selectedTier.id) {
				setSearchParams(
					(prev) => {
						prev.set("tier", selectedTier.id);
						return prev;
					},
					{ replace: true },
				);
			}
		}
	}, [selectedTier, setSearchParams, searchParams]);

	// Sync state to URL (Players)
	useEffect(() => {
		const currentPlayersParam = searchParams.get("players");
		if (players.length > 0) {
			// Map to names only
			const playerNames = players.map((p) => p.player_name || p.name).join(",");
			const encodedNames = encodeURIComponent(playerNames);

			// Avoid unnecessary updates
			if (currentPlayersParam !== encodedNames) {
				setSearchParams(
					(prev) => {
						prev.set("players", encodedNames);
						return prev;
					},
					{ replace: true },
				);
			}
		} else if (currentPlayersParam && allPlayers.length > 0) {
			// CRITICAL: Only delete players from URL if we have finished loading the database.
			setSearchParams(
				(prev) => {
					prev.delete("players");
					return prev;
				},
				{ replace: true },
			);
		}
	}, [players, setSearchParams, searchParams, allPlayers.length]);

	const handleTierChange = (tier: TierCap) => {
		if (players.length > 0) {
			setPendingTier(tier);
			setIsTierDialogOpen(true);
		} else {
			setSelectedTier(tier);
		}
	};

	const confirmClearPlayers = () => {
		setPlayers([]);
		if (pendingTier) {
			setSelectedTier(pendingTier);
		}
		setIsTierDialogOpen(false);
		setPendingTier(undefined);
	};

	const keepPlayers = () => {
		if (pendingTier) {
			setSelectedTier(pendingTier);
		}
		setIsTierDialogOpen(false);
		setPendingTier(undefined);
	};

	return (
		<RosterSelectionContext.Provider
			value={{
				selectedTier,
				setSelectedTier,
				players,
				setPlayers,
				handleTierChange,
				tierCaps,
				allPlayers,
				isTierDialogOpen,
				setIsTierDialogOpen,
				pendingTier,
				confirmClearPlayers,
				keepPlayers,
			}}
		>
			{children}
		</RosterSelectionContext.Provider>
	);
};
