import React from "react";
import { MatchLineup } from "@/types/rolling";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FutureGameSlotProps {
	game: MatchLineup;
	index: number;
}

const FutureGameSlot: React.FC<FutureGameSlotProps> = ({ game, index }) => {
	return (
		<Card className="opacity-80 bg-muted/30">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					Game +{index}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{game.active.map((player) => (
						<div
							key={player.id}
							className="flex justify-between items-center text-sm p-1 bg-background/50 rounded border"
						>
							<span>{player.name}</span>
							<Badge variant="outline" className="text-xs h-5">
								{player.cmv}
							</Badge>
						</div>
					))}
					{!game.isValid && (
						<div className="text-xs text-red-500 font-semibold mt-1">
							Invalid Lineup
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default FutureGameSlot;
