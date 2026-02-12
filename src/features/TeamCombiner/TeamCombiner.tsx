import { useState, useEffect } from "react";
import Rosters from "./Rosters";
import { useRosterSelection } from "@/context/RosterSelectionContext";
import { calculatePossibleRosters } from "@/utils/rosterUtils";
import { Roster } from "@/types";

const Combinations = () => {
	const { players, selectedTier } = useRosterSelection();
	const [possibleRosters, setPossibleRosters] = useState<Roster[]>([]);
	const [rosterStats, setRosterStats] = useState({
		totalChecked: 0,
		rejectedMax: 0,
		rejectedMin: 0,
	});

	// Recalculate possible rosters whenever the players or selected tier change
	useEffect(() => {
		const result = calculatePossibleRosters(
			players,
			selectedTier?.max_cap,
			selectedTier?.min_cap,
		);
		setPossibleRosters(result.rosters);
		setRosterStats({
			totalChecked: result.totalChecked,
			rejectedMax: result.rejectedMax,
			rejectedMin: result.rejectedMin,
		});
	}, [players, selectedTier]);

	return (
		<Rosters
			possibleRosters={possibleRosters}
			teamCap={selectedTier?.max_cap}
			minCap={selectedTier?.min_cap}
			stats={rosterStats}
		/>
	);
};

export default Combinations;
