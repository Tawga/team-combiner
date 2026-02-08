import React from "react";
import TeamCard from "./TeamCard";
import { Roster } from "../../../types/index";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../components/ui/card";

interface RostersProps {
	possibleRosters: Roster[];
	teamCap: number;
}

const Rosters: React.FC<RostersProps> = ({ possibleRosters, teamCap }) => {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>
					Number of possible rosters: {possibleRosters.length}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{possibleRosters.map((team, index) => (
						<div key={index}>
							<TeamCard
								cap={teamCap}
								players={team.players}
								cmv={team.totalCmv}
							/>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default Rosters;
