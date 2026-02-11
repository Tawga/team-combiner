import React from "react";
import { MatchLineup } from "@/types/rolling";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface GameHistorySlotProps {
	history: MatchLineup[];
}

const GameHistorySlot: React.FC<GameHistorySlotProps> = ({ history }) => {
	if (history.length === 0) return null;

	// Show latest games first
	const reversedHistory = [...history].reverse();

	return (
		<Card className="w-full border shadow-sm">
			<CardHeader className="py-3 px-4 bg-muted/40 border-b">
				<CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
					Match History
					<Badge variant="secondary" className="text-[10px] h-5 px-1.5">
						{history.length}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<ScrollArea className="h-[250px] w-full p-4">
					<div className="space-y-3">
						{reversedHistory.map((game, i) => {
							const matchNum = history.length - i;
							const totalCmv = game.active.reduce((sum, p) => sum + p.cmv, 0);

							return (
								<div
									key={i}
									className="flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden"
								>
									<div className="flex justify-between items-center bg-muted/30 px-3 py-1.5 border-b">
										<div className="flex items-center space-x-2">
											<span className="text-xs font-mono font-bold text-primary">
												#{matchNum}
											</span>
											<Separator orientation="vertical" className="h-3" />
											<span className="text-[10px] uppercase text-muted-foreground font-medium">
												Completed
											</span>
										</div>
										<span className="text-xs font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded border">
											Total CMV: {totalCmv}
										</span>
									</div>
									<div className="p-2 flex flex-wrap gap-2">
										{game.active.map((p) => (
											<div
												key={p.id}
												className="flex items-center space-x-2 bg-muted/20 border rounded-full px-2 py-1"
											>
												<span className="text-xs font-semibold text-foreground/90">
													{p.name}
												</span>
												<span className="text-[10px] text-muted-foreground bg-muted/50 px-1 rounded-sm min-w-[1.2rem] text-center">
													{p.cmv}
												</span>
											</div>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

export default GameHistorySlot;
