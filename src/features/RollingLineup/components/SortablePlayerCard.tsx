import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ScrimPlayer } from "@/types/rolling";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, X } from "lucide-react";
import { calculateUrgencyScore } from "@/utils/rollingLogic";

interface SortablePlayerCardProps {
	player: ScrimPlayer;
	onToggleLock?: (id: string) => void;
	onRemove?: (id: string) => void;
	showScore?: boolean;
	isOver?: boolean;
}

const SortablePlayerCard: React.FC<SortablePlayerCardProps> = ({
	player,
	onToggleLock,
	onRemove,
	showScore,
	isOver,
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: player.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.3 : 1,
		zIndex: isDragging ? 999 : "auto",
	};

	const urgency = calculateUrgencyScore(player);

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="touch-none"
		>
			<Card
				className={`
                    h-full mb-2 cursor-grab active:cursor-grabbing transition-all duration-200
                    ${isDragging ? "shadow-xl ring-2 ring-primary rotate-2 scale-105" : "hover:border-primary/50 hover:shadow-md"}
                    ${isOver && !isDragging ? "ring-2 ring-primary bg-primary/5 scale-[1.02]" : ""}
                `}
			>
				<CardContent className="p-3 flex items-center justify-between">
					<div className="flex flex-col">
						<div className="flex items-center space-x-2">
							<span className="font-bold text-sm">{player.name}</span>
							<Badge variant="secondary" className="text-xs h-5 px-1">
								{player.cmv}
							</Badge>
						</div>
						{showScore && (
							<div className="text-[10px] text-muted-foreground">
								Games Played: {player.gamesPlayed} | Bench streak:{" "}
								{player.benchStreak}
							</div>
						)}
					</div>

					<div
						className="flex items-center space-x-1"
						onPointerDown={(e) => e.stopPropagation()}
					>
						{onToggleLock && (
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6"
								onClick={() => onToggleLock(player.id)}
							>
								{player.isLocked ? (
									<Lock className="h-3 w-3 text-orange-500" />
								) : (
									<Unlock className="h-3 w-3 text-muted-foreground" />
								)}
							</Button>
						)}
						{onRemove && (
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-100"
								onClick={() => onRemove(player.id)}
							>
								<X className="h-3 w-3" />
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default SortablePlayerCard;
