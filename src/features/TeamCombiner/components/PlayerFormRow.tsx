import React from "react";
import { Checkbox } from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Trash } from "lucide-react";
import { Player } from "../../../types/index";

interface PlayerFormRowProps {
	player: Player;
	index: number;
	onPlayerUpdate: (index: number, player: Player) => void;
	onPlayerRemove: (index: number) => void;
}

const PlayerFormRow: React.FC<PlayerFormRowProps> = ({
	player,
	index,
	onPlayerUpdate,
	onPlayerRemove,
}) => {
	const handleCheckboxChange = (
		checked: boolean | "indeterminate",
		name: string,
	) => {
		// indeterminate shouldn't happen for simple checkbox
		if (checked === "indeterminate") return;

		const updatedPlayer = {
			...player,
			[name]: checked,
		};
		onPlayerUpdate(index, updatedPlayer);
	};

	return (
		<div className="border-b py-2">
			<div className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center">
				<div className="col-span-1 md:col-span-4 font-medium pl-2">
					{player.name}
				</div>
				<div className="col-span-1 md:col-span-2 text-muted-foreground">
					{player.cmv}
				</div>

				<div className="col-span-1 md:col-span-3 flex items-center space-x-2">
					<Checkbox
						id={`lock-${index}`}
						checked={player.lock || false}
						onCheckedChange={(checked) => handleCheckboxChange(checked, "lock")}
					/>
					<Label htmlFor={`lock-${index}`}>Lock</Label>
				</div>

				<div className="col-span-1 md:col-span-2 flex items-center space-x-2">
					<Checkbox
						id={`highlight-${index}`}
						checked={player.highlight || false}
						onCheckedChange={(checked) =>
							handleCheckboxChange(checked, "highlight")
						}
					/>
					<Label htmlFor={`highlight-${index}`}>Highlight</Label>
				</div>

				<div className="col-span-2 md:col-span-1 flex justify-end md:justify-center">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => onPlayerRemove(index)}
						className="h-8 w-8 text-destructive hover:text-destructive/90"
					>
						<Trash className="h-4 w-4" />
						<span className="sr-only">Remove</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default PlayerFormRow;
