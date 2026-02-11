import { useState, useEffect } from "react";
import Rosters from "./Rosters";
import { useRosterSelection } from "@/context/RosterSelectionContext";
import { calculatePossibleRosters } from "@/utils/rosterUtils";
import { Roster } from "@/types";

const Combinations = () => {
	const { players, selectedTier } = useRosterSelection();
	const [possibleRosters, setPossibleRosters] = useState<Roster[]>([]);

	// Recalculate possible rosters whenever the players or selected tier change
	useEffect(() => {
		const rosters = calculatePossibleRosters(
			players,
			selectedTier?.max_cap,
			selectedTier?.min_cap,
		);
		setPossibleRosters(rosters as Roster[]);
	}, [players, selectedTier]);

	return (
		<Rosters
			possibleRosters={possibleRosters}
			teamCap={selectedTier?.max_cap}
			minCap={selectedTier?.min_cap}
		/>
	);
};

export default Combinations;
