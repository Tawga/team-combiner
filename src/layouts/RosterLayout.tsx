import React from "react";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import {
	RosterSelectionProvider,
	useRosterSelection,
} from "@/context/RosterSelectionContext";
import AppBarComponent from "@/components/AppBarComponent";
import FooterComponent from "@/components/FooterComponent";
import RosterControls from "@/components/RosterControls";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RosterLayoutContent = () => {
	const {
		isTierDialogOpen,
		setIsTierDialogOpen,
		confirmClearPlayers,
		keepPlayers,
	} = useRosterSelection();

	return (
		<div className="flex min-h-screen flex-col bg-gray-50 dark:bg-background">
			<AppBarComponent />
			<div className="container mx-auto px-4 py-8 max-w-7xl flex-grow space-y-6">
				<RosterControls />
				<Outlet />
			</div>
			<FooterComponent />

			<Dialog open={isTierDialogOpen} onOpenChange={setIsTierDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Switching Tiers</DialogTitle>
						<DialogDescription>
							You have players selected. Do you want to clear them or keep them
							for the new tier?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsTierDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="secondary" onClick={keepPlayers}>
							Keep Players
						</Button>
						<Button variant="destructive" onClick={confirmClearPlayers}>
							Clear Players
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Toaster />
		</div>
	);
};

const RosterLayout: React.FC = () => {
	return (
		<RosterSelectionProvider>
			<RosterLayoutContent />
		</RosterSelectionProvider>
	);
};

export default RosterLayout;
