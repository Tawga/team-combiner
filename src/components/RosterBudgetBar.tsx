import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface RosterBudgetBarProps {
	totalCmv: number;
	minCap: number;
	maxCap: number;
}

const RosterBudgetBar: React.FC<RosterBudgetBarProps> = ({
	totalCmv,
	minCap,
	maxCap,
}) => {
	// If caps are not defined or 0, avoids division by zero
	const safeMaxCap = maxCap || 1;
	const isOverMax = totalCmv > maxCap;
	const isUnderMin = totalCmv < minCap;

	// Calculate percentages
	// We want the bar to represent the path to Max Cap.
	// If over max, it stays full (visually 100%) but maybe changes color.
	const fillPercent = Math.min((totalCmv / safeMaxCap) * 100, 100);

	// Determine bar color and text
	let barColor = "bg-primary";
	let statusText = `${totalCmv.toFixed(1)} / ${maxCap} CMV`;
	let detailedStatus = "";

	if (isOverMax) {
		barColor = "bg-red-500";
		statusText = `${totalCmv.toFixed(1)} / ${maxCap} CMV (Over Cap)`;
		detailedStatus = `Over max cap by ${(totalCmv - maxCap).toFixed(1)}`;
	} else if (isUnderMin) {
		barColor = "bg-yellow-500";
		// Show how much until min cap AND max cap
		const toMin = minCap - totalCmv;
		const toMax = maxCap - totalCmv;
		statusText = `${toMin.toFixed(1)} to Min | ${toMax.toFixed(1)} to Max`;
		detailedStatus = `${totalCmv.toFixed(1)} / ${minCap} (Min Cap)`;
	} else {
		// Valid range
		barColor = "bg-green-500";
		// Show how much until max cap
		const toMax = maxCap - totalCmv;
		statusText = `${toMax.toFixed(1)} to Max Cap`;
		detailedStatus = `Valid Roster (${totalCmv.toFixed(1)} CMV)`;
	}

	return (
		<div className="w-full space-y-1 mt-4">
			<div className="flex justify-between text-xs text-muted-foreground">
				<span>Roster Budget</span>
				<span
					className={
						isOverMax
							? "text-red-500 font-bold"
							: isUnderMin
								? "text-yellow-500 font-bold"
								: "text-green-500 font-bold"
					}
				>
					{statusText}
				</span>
			</div>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="h-4 w-full bg-secondary rounded-full overflow-hidden flex relative">
							<div
								className={`h-full ${barColor} transition-all`}
								style={{ width: `${fillPercent}%` }}
							/>
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Total CMV: {totalCmv.toFixed(1)}</p>
						<p>Min Cap: {minCap}</p>
						<p>Max Cap: {maxCap}</p>
						{detailedStatus && <p>{detailedStatus}</p>}
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default RosterBudgetBar;
