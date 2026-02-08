import React from "react";

import { Lock } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../components/ui/table";
import { Card, CardContent } from "../../../components/ui/card";

import { sortBy } from "lodash";
import { getCmvLeftColor } from "../../../utils/util";
import { Player } from "../../../types/index";

interface TeamCardProps {
	cap: number;
	players: Player[];
	cmv: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ cap: teamCap, players, cmv }) => {
	const cmvLeft = teamCap - cmv;

	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				<div
					style={{ backgroundColor: getCmvLeftColor(cmvLeft) }}
					className="p-1"
				>
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="w-[70%] font-bold text-black">
									Name
								</TableHead>
								<TableHead className="text-right font-bold text-black">
									CMV
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortBy(players, ["cmv"])
								.reverse()
								.map((player: Player, index: number) => (
									<TableRow
										key={index}
										className={
											player.highlight
												? "bg-blue-200/80 hover:bg-blue-200/90"
												: "hover:bg-white/50"
										}
										style={{
											backgroundColor: player.highlight
												? "#68aef0cc"
												: undefined,
										}}
									>
										<TableCell className="font-medium">
											<div className="flex items-center gap-1">
												{player.name}
												{player.lock && <Lock className="h-3 w-3" />}
											</div>
										</TableCell>
										<TableCell className="text-right">{player.cmv}</TableCell>
									</TableRow>
								))}
						</TableBody>
						{/* Footer-like row for CMV left */}
						<TableHeader>
							<TableRow className="hover:bg-transparent border-t-2 border-black/10">
								<TableCell className="font-bold text-black">
									CMV left:
								</TableCell>
								<TableCell className="text-right font-bold text-black">
									{cmvLeft}
								</TableCell>
							</TableRow>
						</TableHeader>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};

export default TeamCard;
