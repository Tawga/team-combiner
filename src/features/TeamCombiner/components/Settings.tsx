import React, { useState } from "react";
import _ from "lodash";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

import CopyTeamButton from "./CopyTeamButton";
import { Player, TierCap } from "../../../types/index";

interface SettingsProps {
	teamCap: number;
	setTeamCap: (cap: number) => void;
	players: Player[];
	tierCaps: TierCap[];
	sortBy: string;
	setSortBy: (sortBy: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
	teamCap,
	setTeamCap,
	players,
	tierCaps,
	sortBy,
	setSortBy,
}) => {
	const [custom, setCustom] = useState(false);

	const teamCapHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const val = Number(event.target.value);
		if (val >= 0) {
			setTeamCap(val);
		}
	};

	const onSelectChange = (value: string) => {
		if (value === "custom") {
			setCustom(true);
			// Logic for custom logic can be added here if uncommented
		} else {
			setCustom(false);
			setTeamCap(Number(value));
		}
	};

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 p-4 border rounded-lg bg-card shadow-sm">
			<div className="flex items-center gap-2">
				<Label htmlFor="tier-select">Select Tier</Label>
				<Select
					onValueChange={onSelectChange}
					value={custom ? "custom" : teamCap ? teamCap.toString() : ""}
				>
					<SelectTrigger className="w-[200px]" id="tier-select">
						<SelectValue placeholder="Select Tier" />
					</SelectTrigger>
					<SelectContent>
						{tierCaps.map((tier) => (
							<SelectItem key={tier.id} value={tier.max_cap.toString()}>
								{_.startCase(tier.id)} ({tier.min_cap}-{tier.max_cap})
							</SelectItem>
						))}
						{/* <SelectItem value="custom">Custom</SelectItem> */}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-4">
				<span className="text-sm font-medium text-muted-foreground">
					Sort Players By
				</span>
				<RadioGroup
					defaultValue={sortBy}
					onValueChange={setSortBy}
					className="flex items-center gap-4"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="player_name" id="r1" />
						<Label htmlFor="r1">Name</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="cmv" id="r2" />
						<Label htmlFor="r2">CMV</Label>
					</div>
				</RadioGroup>
			</div>

			{custom && (
				<div className="flex items-center gap-2">
					<Label htmlFor="custom-cap">Custom Cap</Label>
					<Input
						id="custom-cap"
						type="number"
						value={teamCap}
						onChange={teamCapHandler}
						className="w-24"
					/>
				</div>
			)}
			<CopyTeamButton players={players} />
		</div>
	);
};

export default Settings;
