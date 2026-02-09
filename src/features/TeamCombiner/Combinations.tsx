import { useState, useEffect, useMemo } from "react";
import Settings from "./components/Settings";
import Rosters from "./components/Rosters";
import PlayerForm from "./components/PlayerForm";

import { sortBy as lodashSortBy } from "lodash";
import { useSearchParams } from "react-router-dom";

import { fetchAllPlayers, fetchTierCaps } from "../../services/FirebaseService";
import {
	generateCombinations,
	filterAllowedRosters,
	filterLockedRosters,
} from "../../utils/rosterUtils";
import { Player, DatabasePlayer, Roster, TierCap } from "@/types";

const Combinations = () => {
	const rosterSize = 4;
	const [teamCap, setTeamCap] = useState<number | undefined>(); // Initialize with 0 or undefined, logic suggests it gets set later
	const [tierCaps, setTierCaps] = useState<TierCap[]>([]);
	const [players, setPlayers] = useState<Player[]>([]);
	const [allPlayers, setAllPlayers] = useState<DatabasePlayer[]>([]);
	const [possibleRosters, setPossibleRosters] = useState<Roster[]>([]);
	const [sortBy, setSortBy] = useState<string>("player_name");
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		// Check if the page was reloaded (hard refresh)
		const navigationEntries = window.performance.getEntriesByType("navigation");
		const isReload =
			navigationEntries.length > 0 &&
			(navigationEntries[0] as PerformanceNavigationTiming).type === "reload";

		const getPlayers = async () => {
			const cachedPlayersJSON = localStorage.getItem("allPlayers");
			let validCacheFound = false;

			if (cachedPlayersJSON && !isReload) {
				const cachedPlayers = JSON.parse(cachedPlayersJSON);
				if (new Date().getTime() < cachedPlayers.expiry) {
					setAllPlayers(cachedPlayers.data);
					console.log("Using cached players data");
					validCacheFound = true;
				} else {
					console.log("Cached players data expired");
				}
			}

			if (!validCacheFound) {
				console.log("Fetching players from database");
				const playersFromDB = await fetchAllPlayers();
				// Cache for 1 week (7 days)
				const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
				const itemToCache = {
					data: playersFromDB,
					expiry: expirationTime,
				};
				console.log("Caching players data");
				localStorage.setItem("allPlayers", JSON.stringify(itemToCache));
				setAllPlayers(playersFromDB);
			}
		};

		const getCaps = async () => {
			const cachedTierCapsJSON = localStorage.getItem("tierCaps");
			let validCacheFound = false;

			if (cachedTierCapsJSON && !isReload) {
				const cachedTierCaps = JSON.parse(cachedTierCapsJSON);
				if (new Date().getTime() < cachedTierCaps.expiry) {
					const caps = cachedTierCaps.data;
					setTierCaps(caps);
					// Standardize teamCap initialization if not set (optional, handled in Settings/URL)
					const hasTierParam = searchParams.get("tier");
					if (teamCap === 0 && caps.length > 0 && !hasTierParam) {
						setTeamCap(caps[0]?.max_cap || 0);
					}
					console.log("Using cached tier caps data");
					validCacheFound = true;
				} else {
					console.log("Cached tier caps data expired");
				}
			}

			if (!validCacheFound) {
				console.log("Fetching tier caps from database");
				try {
					const data = await fetchTierCaps();
					// Cache for 1 week (7 days)
					const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
					const itemToCache = {
						data: data,
						expiry: expirationTime,
					};
					localStorage.setItem("tierCaps", JSON.stringify(itemToCache));
					setTierCaps(data);
					if (teamCap === 0 && data.length > 0) {
						setTeamCap(data[0]?.max_cap || 0);
					}
					console.log("Caching tier caps data");
				} catch (error) {
					console.error("Error fetching tier caps:", error);
				}
			}
		};

		getCaps();
		getPlayers();
	}, []);

	const sortedAndFilteredPlayers = useMemo(() => {
		const selectedTier = tierCaps.find((tier) => tier.max_cap === teamCap);
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
	}, [teamCap, allPlayers, tierCaps, sortBy]);

	// Calculates all possible rosters based on the current players and team cap
	const calculatePossibleRosters = () => {
		if (players.length < rosterSize) {
			setPossibleRosters([]);
			return;
		}

		// Generate all possible combinations of players
		const allCombinations = generateCombinations(players, rosterSize);

		// Filter out rosters that exceed the team cap
		let filteredRosters = filterAllowedRosters(allCombinations, teamCap);

		// Get a list of locked players and filter out rosters that don't contain them
		const lockedPlayers = players
			.filter((player) => player.lock === true)
			.map((player) => player.name);
		filteredRosters = filterLockedRosters(filteredRosters, lockedPlayers);

		// Calculate the total CMV for each possible roster
		const possibleRosterData = filteredRosters.map((combination) => ({
			players: combination,
			totalCmv: combination.reduce((acc, player) => acc + player.cmv, 0),
		}));

		// Sort the possible rosters by total CMV in descending order
		setPossibleRosters(lodashSortBy(possibleRosterData, "totalCmv").reverse());
	};

	// Recalculate possible rosters whenever the players or team cap change
	useEffect(() => {
		calculatePossibleRosters();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [players, teamCap]);

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

		const tierParam = searchParams.get("tier");
		if (tierParam && tierCaps.length > 0) {
			const matchingTier = tierCaps.find((t) => t.id === tierParam);
			// Only update if current teamCap is different from what URL dictates
			if (matchingTier && matchingTier.max_cap !== teamCap) {
				setTeamCap(matchingTier.max_cap);
			}
		}
		// ESLint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams, tierCaps, allPlayers]); // Added allPlayers dependency

	// Sync state to URL (Tier)
	useEffect(() => {
		if (teamCap && teamCap > 0 && tierCaps.length > 0) {
			const selectedTier = tierCaps.find((t) => t.max_cap === teamCap);
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
		}
	}, [teamCap, tierCaps, setSearchParams, searchParams]);

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
				teamCap={teamCap}
				setTeamCap={setTeamCap}
				tierCaps={tierCaps}
				sortBy={sortBy}
				setSortBy={setSortBy}
			/>
			<PlayerForm
				setPlayers={setPlayers}
				filteredPlayers={sortedAndFilteredPlayers}
				players={players}
			/>
			<Rosters possibleRosters={possibleRosters} teamCap={teamCap} />
		</>
	);
};

export default Combinations;
