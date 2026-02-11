import React from "react";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface GhostBudgetBarProps {
	activeCost: number;
	ghostCost: number;
	maxCap: number;
}

const GhostBudgetBar: React.FC<GhostBudgetBarProps> = ({
	activeCost,
	ghostCost,
	maxCap,
}) => {
	const totalCost = activeCost + ghostCost;
	const isOverCap = totalCost > maxCap;

	// Percentages
	const activePercent = Math.min((activeCost / maxCap) * 100, 100);
	const ghostPercent = Math.min(
		(ghostCost / maxCap) * 100,
		100 - activePercent,
	); // fill remaining space correctly if valid

	// If over cap, we might want to scale differently or just show red full bar
	const barColor = isOverCap ? "bg-red-500" : "bg-primary";
	const ghostColor = isOverCap ? "bg-red-300" : "bg-muted-foreground/30";

	return (
		<div className="w-full space-y-1">
			<div className="flex justify-between text-xs text-muted-foreground">
				<span>Budget Usage</span>
				<span className={isOverCap ? "text-red-500 font-bold" : ""}>
					{totalCost.toFixed(1)} / {maxCap} CMV
				</span>
			</div>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="h-4 w-full bg-secondary rounded-full overflow-hidden flex relative">
							{/* Active Portion */}
							<div
								className={`h-full ${barColor} transition-all`}
								style={{ width: `${activePercent}%` }}
							/>
							{/* Ghost Portion */}
							<div
								className={`h-full ${ghostColor} transition-all`}
								style={{
									width: isOverCap
										? `${Math.min(((totalCost - activeCost) / maxCap) * 100, 100 - activePercent)}%`
										: `${ghostPercent}%`,
									backgroundImage:
										"linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)",
									backgroundSize: "1rem 1rem",
								}}
							/>
							{/* Limit Line (if we want to show overflow past 100% differently, simpler is just red bar) */}
						</div>
					</TooltipTrigger>
					<TooltipContent>
						<p>Active: {activeCost.toFixed(1)}</p>
						<p>Ghost (Bench Min): {ghostCost.toFixed(1)}</p>
						<p>Total: {totalCost.toFixed(1)}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default GhostBudgetBar;
