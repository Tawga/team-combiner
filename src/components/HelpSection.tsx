import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const HelpSection: React.FC = () => {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="text-xl">How to use Team Combiner</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2 text-sm text-muted-foreground">
				<p>
					1. <strong>Select Players:</strong> Use the search bar to find and add
					players to your roster.
				</p>
				<p>
					2. <strong>Set Constraints:</strong> Adjust the "Team Cap" to set the
					max CMV per team.
				</p>
				<p>
					3. <strong>Lock/Highlight:</strong> Use the checkboxes next to players
					to lock them to a team or highlight them.
				</p>
				<p>
					4. <strong>View Teams:</strong> The possible team combinations will
					appear automatically below.
				</p>
			</CardContent>
		</Card>
	);
};

export default HelpSection;
