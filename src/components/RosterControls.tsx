import React, { useState } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import TierSelector from "./TierSelector";
import PlayerSelector from "./PlayerSelector";
import { useRosterSelection } from "@/context/RosterSelectionContext";
import { useMemo } from "react";
import { _ } from "lodash";

const RosterControls: React.FC = () => {
	const {
		selectedTier,
		tierCaps,
		players,
		setPlayers,
		handleTierChange,
		allPlayers,
	} = useRosterSelection();

	const [isOpen, setIsOpen] = useState(true);
	const [sortBy, setSortBy] = useState<string>("player_name"); // Local state for sorting in selector?

	const sortedAndFilteredPlayers = useMemo(() => {
		let playersToDisplay = allPlayers;

		if (selectedTier) {
			playersToDisplay = allPlayers.filter(
				(player) =>
					player.lower_tier?.toLowerCase() === selectedTier.id.toLowerCase(),
			);
		}

		const sortable = [...playersToDisplay];
		sortable.sort((a, b) => {
			if (sortBy === "cmv") {
				return b.cmv - a.cmv;
			}
			return (a.player_name || "").localeCompare(b.player_name || "");
		});
		return sortable;
	}, [selectedTier, allPlayers, sortBy]);

	return (
		<div className="space-y-4">
			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className="w-full space-y-2"
			>
				<div className="flex items-center justify-between space-x-4 px-4 py-2 bg-muted/50 rounded-lg">
					<div className="flex items-center gap-4">
						<h4 className="text-sm font-semibold">Roster Controls</h4>
						{!isOpen && (
							<span className="text-sm text-muted-foreground">
								{_.startCase(selectedTier?.id)} | {players.length} players -{" "}
								{players.map((p) => p.player_name).join(", ")}
							</span>
						)}
					</div>
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="sm" className="w-9 p-0">
							<ChevronsUpDown className="h-4 w-4" />
							<span className="sr-only">Toggle</span>
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className="space-y-4">
					<TierSelector
						selectedTier={selectedTier}
						setSelectedTier={handleTierChange}
						tiers={tierCaps}
						sortBy={sortBy}
						setSortBy={setSortBy}
					/>
					<PlayerSelector
						setPlayers={setPlayers}
						filteredPlayers={sortedAndFilteredPlayers}
						players={players}
						selectedTier={selectedTier}
					/>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};

export default RosterControls;
