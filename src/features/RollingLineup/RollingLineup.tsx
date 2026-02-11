import React, { useState } from "react";
import {
	DndContext,
	DragOverlay,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragEndEvent,
	defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
	RollingRosterProvider,
	useRollingRoster,
} from "@/context/RollingRosterContext";
import ActiveGameSlot from "./components/ActiveGameSlot";
import BenchList from "./components/BenchList";
import FutureGameSlot from "./components/FutureGameSlot";
import GameHistorySlot from "./components/GameHistorySlot";
import SortablePlayerCard from "./components/SortablePlayerCard";
import { Button } from "@/components/ui/button";
import { ScrimPlayer } from "@/types/rolling";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const RollingLineupContent = () => {
	const {
		state,
		movePlayerToActive,
		movePlayerToBench,
		swapPlayers,
		toggleLock,
		playGame,
		setConfig,
	} = useRollingRoster();
	const [activeDragId, setActiveDragId] = useState<string | null>(null);
	const [overId, setOverId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const game0 = state.queue[0];
	const benchPlayers = game0 ? game0.bench : [];
	const sortedBench = [...benchPlayers].sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveDragId(event.active.id as string);
		setOverId(null);
	};

	const handleDragOver = (event: DragEndEvent) => {
		const { over } = event;
		setOverId(over ? (over.id as string) : null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveDragId(null);
		setOverId(null);

		if (!over) return;

		const isBenchPlayer = benchPlayers.find((p) => p.id === active.id);
		const isActivePlayer = game0?.active.find((p) => p.id === active.id);

		if (isBenchPlayer) {
			if (
				over.id === "active-slot" ||
				game0?.active.find((p) => p.id === over.id)
			) {
				if (
					game0 &&
					game0.active.length >= state.config.lineupSize &&
					over.id !== "active-slot" &&
					over.id !== active.id
				) {
					swapPlayers(over.id as string, active.id as string);
				} else {
					movePlayerToActive(active.id as string);
				}
			}
		}

		if (isActivePlayer) {
			if (
				over.id === "bench-slot" ||
				benchPlayers.find((p) => p.id === over.id)
			) {
				movePlayerToBench(active.id as string);
			}
		}
	};

	if (!game0) {
		return <div className="p-4">Loading or No Players...</div>;
	}

	const draggedPlayer = state.pool.find((p) => p.id === activeDragId);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
		>
			<div className="flex flex-col h-full gap-6">
				{/* Top Configuration Card */}
				<div className="w-full">
					<Card className="p-4">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<span className="text-sm font-medium text-muted-foreground">
										Lineup Size:
									</span>
									<div className="flex items-center bg-muted/50 rounded-lg p-1 border">
										<Button
											variant={
												state.config.lineupSize === 2 ? "default" : "ghost"
											}
											size="sm"
											className={`h-8 px-4 transition-all ${state.config.lineupSize === 2 ? "shadow-sm" : "hover:bg-background/50"}`}
											onClick={() =>
												setConfig({ ...state.config, lineupSize: 2 })
											}
										>
											2v2
										</Button>
										<Button
											variant={
												state.config.lineupSize === 3 ? "default" : "ghost"
											}
											size="sm"
											className={`h-8 px-4 transition-all ${state.config.lineupSize === 3 ? "shadow-sm" : "hover:bg-background/50"}`}
											onClick={() =>
												setConfig({ ...state.config, lineupSize: 3 })
											}
										>
											3v3
										</Button>
									</div>
								</div>

								<Separator orientation="vertical" className="h-8" />

								<div
									className="flex items-center space-x-2 cursor-pointer"
									onClick={() =>
										setConfig({
											...state.config,
											enforceCap: !state.config.enforceCap,
										})
									}
								>
									<Switch
										id="cap-mode"
										checked={state.config.enforceCap}
										onCheckedChange={(checked) =>
											setConfig({
												...state.config,
												enforceCap: checked,
											})
										}
									/>
									<Label
										htmlFor="cap-mode"
										className="text-sm font-medium cursor-pointer"
									>
										{state.config.enforceCap
											? "Cap Limit Enforced"
											: "Ignore Cap Limit"}
									</Label>
								</div>
							</div>
						</div>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow min-h-0">
					{/* Left: Bench - Span 3 */}
					<div className="lg:col-span-3 h-full overflow-hidden flex flex-col">
						<BenchList
							players={sortedBench}
							toggleLock={toggleLock}
							overId={overId}
						/>
					</div>

					{/* Center: Active Game & Controls - Span 6 */}
					<div className="lg:col-span-6 space-y-6 flex flex-col">
						<ActiveGameSlot
							lineup={game0}
							movePlayerToBench={movePlayerToBench}
							toggleLock={toggleLock}
							maxCap={state.config.tier.max_cap}
							enforceCap={state.config.enforceCap}
							overId={overId}
						/>

						<div className="flex justify-center py-4">
							<Button
								className="w-full max-w-xs text-lg font-bold"
								size="lg"
								onClick={playGame}
								disabled={!game0.isValid && state.config.enforceCap}
								variant={
									!game0.isValid && state.config.enforceCap
										? "destructive"
										: "default"
								}
							>
								Play Game
							</Button>
						</div>

						<GameHistorySlot history={state.history} />
					</div>

					{/* Right: Future Games - Span 3 */}
					<div className="lg:col-span-3 space-y-4">
						<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
							Up Next
						</h3>
						{state.queue.slice(1).map((game, i) => (
							<div key={i} className="relative pb-4">
								<FutureGameSlot game={game} index={i + 1} />
								{i < state.queue.length - 2 && (
									<Separator
										orientation="vertical"
										className="absolute left-1/2 -bottom-2 h-4"
									/>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			<DragOverlay
				dropAnimation={{
					sideEffects: defaultDropAnimationSideEffects({
						styles: {
							active: { opacity: "0.5" },
						},
					}),
				}}
			>
				{draggedPlayer ? (
					<div className="opacity-80">
						{/* Simple visual for drag */}
						<div className="bg-background border rounded p-2 shadow-lg w-[200px]">
							{draggedPlayer.name}
						</div>
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
};

const RollingLineup = () => {
	return (
		<RollingRosterProvider>
			<div className="w-full h-full p-6">
				<RollingLineupContent />
			</div>
		</RollingRosterProvider>
	);
};

export default RollingLineup;
