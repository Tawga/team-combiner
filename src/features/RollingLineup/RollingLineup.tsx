import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRosterSelection } from "@/context/RosterSelectionContext";

const RollingLineup = () => {
	const { players, selectedTier } = useRosterSelection();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Rolling Lineup (Coming Soon)</CardTitle>
			</CardHeader>
			<CardContent>
				<p>This feature is currently under development.</p>
				<div className="mt-4 p-4 bg-muted rounded-md">
					<h3 className="font-medium">Debug Info:</h3>
					<p>Selected Tier: {selectedTier?.id || "None"}</p>
					<p>Selected Players: {players.length}</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default RollingLineup;
