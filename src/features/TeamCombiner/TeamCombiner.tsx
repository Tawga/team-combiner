import { useState, useEffect, useMemo } from "react";
import Settings from "./Settings";
import Rosters from "./Rosters";
import PlayerForm from "./PlayerForm";

import { useSearchParams } from "react-router-dom";

import { useRosterData } from "../../hooks/useRosterData";
import { calculatePossibleRosters } from "../../utils/rosterUtils";
import { Player, Roster, TierCap } from "@/types";

const Combinations = () => {
	const { allPlayers, tierCaps } = useRosterData();
	const [selectedTier, setSelectedTier] = useState<TierCap | undefined>();
	const [players, setPlayers] = useState<Player[]>([]);
	const [possibleRosters, setPossibleRosters] = useState<Roster[]>([]);
	const [sortBy, setSortBy] = useState<string>("player_name");
	const [searchParams, setSearchParams] = useSearchParams();

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
	}, [tierCaps, searchParams, selectedTier]);

	const sortedAndFilteredPlayers = useMemo(() => {
		let playersToDisplay = allPlayers;

		if (selectedTier) {
			playersToDisplay = allPlayers.filter(
				(player) =>
					player.lower_tier?.toLowerCase() === selectedTier.id.toLowerCase(),
			);
		}

		const sortable = [...playersToDisplay];
		sortable.sort((a, b) => {
			if (sortBy === "cmv") {
				return b.cmv - a.cmv;
			}
			return (a.player_name || "").localeCompare(b.player_name || "");
		});
		return sortable;
	}, [selectedTier, allPlayers, sortBy]);

	// Recalculate possible rosters whenever the players or selected tier change
	useEffect(() => {
		const rosters = calculatePossibleRosters(
			players,
			selectedTier?.max_cap,
			selectedTier?.min_cap,
		);
		setPossibleRosters(rosters as Roster[]);
	}, [players, selectedTier]);

	// Sync state from URL
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
						playerNames = parsed.map((p: Player) => p.player_name || p.name);
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
					setPlayers(reconstructedPlayers);
				}
			} catch (e) {
				console.error("Failed to parse shared players", e);
			}
		}

		// Tier sync logic moved to separate effect for clarity, but basic checks here
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, allPlayers]); // Removed tierCaps dependency as it's handled in init/sync

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
			// If allPlayers is empty, we are likely still loading, so we should NOT clear the URL yet.
			setSearchParams(
				(prev) => {
					prev.delete("players");
					return prev;
				},
				{ replace: true },
			);
		}
	}, [players, setSearchParams, searchParams, allPlayers.length]);

	return (
		<>
			<Settings
				selectedTier={selectedTier}
				setSelectedTier={setSelectedTier}
				tiers={tierCaps}
				sortBy={sortBy}
				setSortBy={setSortBy}
			/>
			<PlayerForm
				setPlayers={setPlayers}
				filteredPlayers={sortedAndFilteredPlayers}
				players={players}
			/>
			<Rosters
				possibleRosters={possibleRosters}
				teamCap={selectedTier?.max_cap}
			/>
		</>
	);
};

export default Combinations;
