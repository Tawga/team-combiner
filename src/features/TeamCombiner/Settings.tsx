import React from "react";
import _ from "lodash";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TierCap } from "@/types/index";

interface SettingsProps {
	selectedTier: TierCap | undefined;
	setSelectedTier: (tier: TierCap) => void;
	tiers: TierCap[];
	sortBy: string;
	setSortBy: (sortBy: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
	selectedTier,
	setSelectedTier,
	tiers,
	sortBy,
	setSortBy,
}) => {
	const onSelectChange = (value: string) => {
		const tier = tiers.find((t) => t.id === value);
		if (tier) {
			setSelectedTier(tier);
		}
	};

	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 p-4 border rounded-lg bg-card shadow-sm">
			<div className="flex items-center gap-2">
				<Label htmlFor="tier-select">Select Tier</Label>
				<Select
					onValueChange={onSelectChange}
					value={selectedTier ? selectedTier.id : ""}
				>
					<SelectTrigger className="w-[200px]" id="tier-select">
						<SelectValue placeholder="Select Tier" />
					</SelectTrigger>
					<SelectContent>
						{tiers.map((tier) => (
							<SelectItem key={tier.id} value={tier.id}>
								{_.startCase(tier.id)} ({tier.min_cap} - {tier.max_cap})
							</SelectItem>
						))}
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
		</div>
	);
};

export default Settings;
