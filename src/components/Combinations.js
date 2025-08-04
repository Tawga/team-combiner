import { useState, useEffect, useCallback, useMemo } from "react";
import Settings from "./Settings.js";
import Rosters from "./Rosters";
import PlayerForm from "./PlayerForm";

import { sortBy as lodashSortBy } from "lodash";
import { useLocation } from "react-router-dom";

import { fetchAllPlayers } from "../utils/firebase";
import { fetchTierCaps } from "../utils/firebase";

const Combinations = () => {
	const rosterSize = 4;
	const [teamCap, setTeamCap] = useState();
	const [tierCaps, setTierCaps] = useState([]);

	const [players, setPlayers] = useState([]);
	const [allPlayers, setAllPlayers] = useState([]);
	const [possibleRosters, setPossibleRosters] = useState([]);

	const [sortBy, setSortBy] = useState("player_name");

	const location = useLocation();

	useEffect(() => {
		const getPlayers = async () => {
			const playersFromDB = await fetchAllPlayers();
			setAllPlayers(playersFromDB);
		};
		const getCaps = async () => {
			const data = await fetchTierCaps();
			setTierCaps(data);
			setTeamCap(data[0]?.cap);
		};

		getCaps();
		getPlayers();
	}, []);

	const sortedAndFilteredPlayers = useMemo(() => {
		const selectedTier = tierCaps.find((tier) => tier.cap === teamCap);
		let playersToDisplay = allPlayers;

		if (selectedTier) {
			playersToDisplay = allPlayers.filter(
				(player) =>
					player.lower_tier.toLowerCase() === selectedTier.id.toLowerCase()
			);
		}

		const sortable = [...playersToDisplay];
		sortable.sort((a, b) => {
			if (sortBy === "cmv") {
				return b.cmv - a.cmv;
			}
			return a.player_name.localeCompare(b.player_name);
		});
		return sortable;
	}, [teamCap, allPlayers, tierCaps, sortBy]);

	// Generates all possible combinations of players
	const generateCombinations = useCallback((arr, size) => {
		const result = [];
		const recurse = (start, combination) => {
			if (combination.length === size) {
				result.push(combination);
				return;
			}

			for (let i = start; i < arr.length; i++) {
				recurse(i + 1, [...combination, arr[i]]);
			}
		};

		recurse(0, []);

		return result;
	}, []);

	// Filters out rosters that don't contain locked players
	const filterLockedRosters = useCallback((rosters, lockedPlayers) => {
		if (lockedPlayers.length === 0) {
			return rosters;
		}

		return rosters.filter((roster) =>
			lockedPlayers.every((playerName) =>
				roster.some((player) => player.name === playerName)
			)
		);
	}, []);

	// Filters out rosters that exceed the team cap
	const filterAllowedRosters = useCallback((rosters, cap) => {
		return rosters.filter((roster) => {
			const totalCmv = roster.reduce((acc, player) => acc + player.cmv, 0);
			return totalCmv <= cap;
		});
	}, []);

	// Calculates all possible rosters based on the current players and team cap
	const calculatePossibleRosters = useCallback(() => {
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
	}, [
		players,
		teamCap,
		generateCombinations,
		filterAllowedRosters,
		filterLockedRosters,
	]);

	// Recalculate possible rosters whenever the players or team cap change
	useEffect(() => {
		calculatePossibleRosters();
	}, [players, teamCap, calculatePossibleRosters]);

	useEffect(() => {
		if (location.search !== "") {
			const queryParams = new URLSearchParams(location.search);
			const playersString = queryParams.get("players");
			const sharedPlayers = JSON.parse(decodeURIComponent(playersString));
			setPlayers(sharedPlayers);
		}
	}, [location.search]);

	return (
		<>
			<Settings
				teamCap={teamCap}
				setTeamCap={setTeamCap}
				players={players}
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
