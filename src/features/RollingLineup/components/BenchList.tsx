import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { ScrimPlayer } from "@/types/rolling";
import SortablePlayerCard from "./SortablePlayerCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BenchListProps {
	players: ScrimPlayer[];
	toggleLock: (id: string) => void;
	overId?: string | null;
}

const BenchList: React.FC<BenchListProps> = ({
	players,
	toggleLock,
	overId,
}) => {
	const { setNodeRef } = useDroppable({
		id: "bench-slot",
	});

	const [search, setSearch] = React.useState("");

	const filteredPlayers = useMemo(() => {
		return players.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [players, search]);

	const playerIds = filteredPlayers.map((p) => p.id);

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium flex justify-between items-center">
					<span>Bench ({players.length})</span>
				</CardTitle>
				<div className="relative mt-2">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search bench..."
						className="pl-8 h-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</CardHeader>
			<CardContent className="flex-1 overflow-hidden p-0">
				<ScrollArea className="h-full p-4">
					<div ref={setNodeRef} className="space-y-2 min-h-[100px]">
						<SortableContext
							items={playerIds}
							strategy={verticalListSortingStrategy}
						>
							{filteredPlayers.map((player) => (
								<SortablePlayerCard
									key={player.id}
									player={player}
									onToggleLock={toggleLock}
									showScore
									isOver={overId === player.id}
								/>
							))}
							{filteredPlayers.length === 0 && (
								<div className="text-center text-sm text-muted-foreground py-4">
									No players found
								</div>
							)}
						</SortableContext>
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

export default BenchList;
