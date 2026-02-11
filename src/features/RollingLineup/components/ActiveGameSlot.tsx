import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { MatchLineup } from "@/types/rolling";
import SortablePlayerCard from "./SortablePlayerCard";
import GhostBudgetBar from "./GhostBudgetBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ActiveGameSlotProps {
	lineup: MatchLineup;
	movePlayerToBench: (id: string) => void;
	toggleLock: (id: string) => void;
	maxCap: number;
	enforceCap: boolean;
	overId?: string | null;
}

const ActiveGameSlot: React.FC<ActiveGameSlotProps> = ({
	lineup,
	movePlayerToBench,
	toggleLock,
	maxCap,
	enforceCap,
	overId,
}) => {
	const { setNodeRef } = useDroppable({
		id: "active-slot",
	});

	const activeIds = lineup.active.map((p) => p.id);
	const activeCost = lineup.active.reduce((sum, p) => sum + p.cmv, 0);
	const ghostCost = lineup.ghostPlayer?.cmv || 0;

	return (
		<Card className="border-2 border-primary/20 shadow-sm">
			<CardHeader className="pb-2">
				<CardTitle className="text-lg flex justify-between items-center">
					<span>Next Game</span>
					{!lineup.isValid && enforceCap && (
						<span className="text-xs text-red-500 font-bold bg-red-100 px-2 py-1 rounded">
							{lineup.validationError || "Invalid"}
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div
					ref={setNodeRef}
					className="min-h-[200px] bg-muted/20 rounded-md p-2 space-y-2"
				>
					<SortableContext
						items={activeIds}
						strategy={verticalListSortingStrategy}
					>
						{lineup.active.length === 0 && (
							<div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
								Drag players here
							</div>
						)}
						{lineup.active.map((player) => (
							<SortablePlayerCard
								key={player.id}
								player={player}
								onRemove={movePlayerToBench}
								onToggleLock={toggleLock}
								showScore
								isOver={overId === player.id}
							/>
						))}
					</SortableContext>
				</div>

				{enforceCap && (
					<GhostBudgetBar
						activeCost={activeCost}
						ghostCost={ghostCost}
						maxCap={maxCap}
					/>
				)}
			</CardContent>
		</Card>
	);
};

export default ActiveGameSlot;
