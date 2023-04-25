import React, { useState, useEffect, useCallback } from "react";
import initialPlayers from "../InitialPlayers.js";

import TeamCap from "./TeamCap.js";
import Rosters from "./Rosters";
import PlayerForm from "./PlayerForm";

const Combinations = () => {
	const rosterSize = 4;
	const [teamCap, setTeamCap] = useState(5260);
	const [players, setPlayers] = useState(initialPlayers);
	const [possibleRosters, setPossibleRosters] = useState([]);

	const calculateTeams = useCallback(() => {
		if (players.length < rosterSize) {
			setPossibleRosters([]);
			return;
		} else {
			// Calculate all combinations and filter allowed rosters
			const allCombinations = combinations(players, rosterSize).filter(
				(roster) => {
					let totalCmv = 0;
					roster.forEach((player) => {
						totalCmv += player.cmv;
					});
					return totalCmv <= teamCap;
				}
			);

			// Filter only rosters with locked team mates
			const lockedPlayers = players
				.filter((player) => player.lock === true)
				.map((player) => player.name);

			let filteredRoster = allCombinations;
			if (lockedPlayers.length > 0) {
				filteredRoster = allCombinations.filter((subArr) =>
					lockedPlayers.every((val) => subArr.some((obj) => obj.name === val))
				);
			}

			// Calculate total CMV values of the roster
			const rosters = filteredRoster.map((combination) => {
				let totalCmv = 0;
				combination.forEach((player) => {
					totalCmv += player.cmv;
				});
				const roster = { players: combination, totalCmv: totalCmv };
				return roster;
			});

			setPossibleRosters(
				rosters.sort((a, b) => (a.totalCmv < b.totalCmv ? 1 : -1))
			);
		}
	}, [players, teamCap]);

	useEffect(() => {
		calculateTeams();
	}, [players, calculateTeams]);

	const combinations = (a, c) => {
		let index = [];
		let n = a.length;

		for (let j = 0; j < c; j++) index[j] = j;
		index[c] = n;

		let ok = true;
		let result = [];

		while (ok) {
			let comb = [];
			for (let j = 0; j < c; j++) comb[j] = a[index[j]];
			result.push(comb);

			ok = false;

			for (let j = c; j > 0; j--) {
				if (index[j - 1] < index[j] - 1) {
					index[j - 1]++;
					for (let k = j; k < c; k++) index[k] = index[k - 1] + 1;
					ok = true;
					break;
				}
			}
		}
		return result;
	};

	return (
		<React.Fragment>
			<TeamCap teamCap={teamCap} setTeamCap={setTeamCap} />
			<PlayerForm setPlayers={setPlayers} players={players} />
			<Rosters legalTeams={possibleRosters} teamCap={teamCap} />
		</React.Fragment>
	);
};

export default Combinations;
