import React from "react";

import { Lock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { sortBy } from "lodash";
import { getCmvLeftColor } from "@/lib/utils";
import { Player } from "@/types/index";

interface TeamCardProps {
	cap: number | undefined;
	minCap: number | undefined;
	players: Player[];
	cmv: number;
}

const TeamCard: React.FC<TeamCardProps> = ({
	cap: teamCap,
	minCap,
	cmv,
	players,
}) => {
	const cmvLeft = teamCap ? teamCap - cmv : undefined;

	let borderColor = "hsl(var(--border))"; // Default border color
	let textColor = "hsl(var(--primary-foreground))"; // Default text color for the header

	// Calculate color based on percentage of available cap used
	if (
		teamCap !== undefined &&
		minCap !== undefined &&
		cmvLeft !== undefined &&
		teamCap !== minCap
	) {
		const maxPossibleUsage = teamCap - minCap;
		// 0 means we are at min cap (fraction approaches 1), maxPossibleUsage means we are at max cap (fraction approaches 0)
		const colors = getCmvLeftColor(cmvLeft, maxPossibleUsage);
		borderColor = colors.border;
		textColor = colors.text;
	}

	return (
		<Card className=" border-4 shadow-sm" style={{ borderColor: borderColor }}>
			<div
				className="w-full py-2 text-center font-semibold"
				style={{ backgroundColor: borderColor, color: textColor }}
			>
				CMV left ({cmvLeft})
			</div>
			<CardContent className="p-0">
				<div className="grid grid-cols-2 divide-x divide-y border-b">
					{sortBy(players, ["cmv"])
						.reverse()
						.map((player: Player, index: number) => (
							<div
								key={index}
								className={`flex flex-col items-center justify-center p-2 text-center h-20
										? "bg-blue-100/50 hover:bg-blue-100/60 dark:bg-blue-900/20"
										: "hover:bg-muted/50"
								}`}
							>
								<div className="font-semibold text-lg leading-tight mb-1 ">
									{player.name}
								</div>
								<div className="text-muted-foreground  flex items-center justify-center gap-1">
									{player.cmv}
									{player.lock && <Lock className="h-3 w-3" />}
								</div>
							</div>
						))}
				</div>
			</CardContent>
		</Card>
	);
};

export default TeamCard;
