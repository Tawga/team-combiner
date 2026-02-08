import React, { useCallback, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../../../components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../../components/ui/popover";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../../components/ui/collapsible";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "../../../lib/utils";

import PlayerFormRow from "./PlayerFormRow";
import { Player, DatabasePlayer } from "../../../types/index";

interface PlayerFormProps {
	players: Player[];
	filteredPlayers: DatabasePlayer[];
	setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

const PlayerForm: React.FC<PlayerFormProps> = ({
	players,
	filteredPlayers,
	setPlayers,
}) => {
	const [newPlayer, setNewPlayer] = useState<Partial<Player>>({});
	const [open, setOpen] = useState(false);
	const [isListOpen, setIsListOpen] = useState(true);

	const addNewPlayer = () => {
		if (newPlayer.name && newPlayer.cmv !== undefined) {
			setPlayers((prev) => [
				...prev,
				{
					name: newPlayer.name!,
					cmv: newPlayer.cmv!,
					lock: false,
					highlight: false,
					...newPlayer,
				} as Player,
			]);
			setNewPlayer({});
		}
	};

	const removePlayer = useCallback(
		(indexToRemove: number) => {
			setPlayers((prev) => prev.filter((_, i) => i !== indexToRemove));
		},
		[setPlayers],
	);

	const updatePlayer = useCallback(
		(index: number, updatedPlayerData: Player) => {
			setPlayers((prev) =>
				prev.map((player, i) => (i === index ? updatedPlayerData : player)),
			);
		},
		[setPlayers],
	);

	const handleSelectPlayer = (player: DatabasePlayer) => {
		const updatedPlayer: Partial<Player> = {
			name: player.player_name,
			cmv: player.cmv,
			lock: false,
			highlight: false,
		};
		setNewPlayer(updatedPlayer);
		setOpen(false);
	};

	return (
		<Card className="mb-4">
			<CardContent className="pt-6">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end">
					<div className="md:col-span-4">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									className="w-full justify-between"
								>
									{newPlayer.name || "Select player..."}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-[300px] p-0">
								<Command>
									<CommandInput placeholder="Search player..." />
									<CommandList>
										<CommandEmpty>No player found.</CommandEmpty>
										<CommandGroup>
											{filteredPlayers.map((player) => (
												<CommandItem
													key={player.player_name}
													value={player.player_name}
													onSelect={(currentValue) => {
														// We use the player object directly, so we ignore currentValue
														handleSelectPlayer(player);
													}}
												>
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															newPlayer.name === player.player_name
																? "opacity-100"
																: "opacity-0",
														)}
													/>
													{player.player_name} ({player.cmv})
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					<div className="md:col-span-4">
						<Input
							type="number"
							placeholder="CMV"
							value={newPlayer.cmv || ""}
							disabled
							className="bg-muted"
						/>
					</div>

					<div className="md:col-span-4">
						<Button
							onClick={addNewPlayer}
							disabled={!newPlayer.name}
							className="w-full"
						>
							<Plus className="mr-2 h-4 w-4" /> Add Player
						</Button>
					</div>
				</div>

				{/* Collapsible Player List */}
				<Collapsible
					open={isListOpen}
					onOpenChange={setIsListOpen}
					className="space-y-2"
				>
					<div className="flex items-center justify-between space-x-4 px-1">
						<h4 className="text-sm font-semibold">
							Selected Players ({players.length})
						</h4>
						<CollapsibleTrigger asChild>
							<Button variant="ghost" size="sm" className="w-9 p-0">
								<ChevronsUpDown className="h-4 w-4" />
								<span className="sr-only">Toggle</span>
							</Button>
						</CollapsibleTrigger>
					</div>
					<CollapsibleContent className="space-y-2">
						{players.length === 0 ? (
							<div className="text-sm text-muted-foreground p-2">
								No players added yet.
							</div>
						) : (
							players.map((player, index) => (
								<PlayerFormRow
									key={index}
									player={player}
									index={index}
									onPlayerUpdate={updatePlayer}
									onPlayerRemove={removePlayer}
								/>
							))
						)}
					</CollapsibleContent>
				</Collapsible>
			</CardContent>
		</Card>
	);
};

export default PlayerForm;
