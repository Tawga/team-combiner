import React from "react";
import TeamCard from "./TeamCard";
import { Roster } from "../../types/index";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";

interface RostersProps {
	possibleRosters: Roster[];
	teamCap: number | undefined;
	minCap: number | undefined;
	stats: {
		totalChecked: number;
		rejectedMax: number;
		rejectedMin: number;
	};
}

const Rosters: React.FC<RostersProps> = ({
	possibleRosters,
	teamCap,
	minCap,
	stats,
}) => {
	const rejectedCount = stats.rejectedMax + stats.rejectedMin;
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="text-md flex items-center gap-2">
					<span>Possible rosters ({possibleRosters.length})</span>
					{stats && stats.totalChecked > possibleRosters.length && (
						<span className="text-sm font-normal text-muted-foreground">
							{stats.totalChecked} total rosters | {rejectedCount} roster
							{rejectedCount !== 1 ? "s" : ""} rejected due to cap limit
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{possibleRosters.map((team, index) => (
						<div key={index}>
							<TeamCard
								cap={teamCap}
								minCap={minCap}
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
