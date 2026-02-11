import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Users, Shuffle } from "lucide-react";

const Dashboard: React.FC = () => {
	return (
		<div className="flex flex-col bg-gray-50 items-center justify-center p-4">
			<div className="max-w-4xl w-full space-y-8">
				<div className="text-center space-y-2">
					<p className="text-lg text-muted-foreground">
						Select a tool to get started
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Link to="/combiner">
						<Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Users className="h-6 w-6" />
									Team Combiner
								</CardTitle>
								<CardDescription>
									Find the best team combinations based on CMV limits.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button className="w-full">Open Combiner</Button>
							</CardContent>
						</Card>
					</Link>

					<Link to="/rolling-lineup">
						<Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Shuffle className="h-6 w-6" />
									Rolling Lineup
								</CardTitle>
								<CardDescription>
									Manage rolling substitutions and lineups in Scrims (In
									Testing).
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button className="w-full" variant="secondary">
									Open Rolling Lineup
								</Button>
							</CardContent>
						</Card>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
