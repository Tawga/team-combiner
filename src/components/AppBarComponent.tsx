import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AppBarProps {
	title: string;
}

const AppBarComponent: React.FC<AppBarProps> = ({ title }) => {
	const location = useLocation();
	const isHome = location.pathname === "/";

	const pathNames: Record<string, string> = {
		"/combiner": "Team Combiner",
		"/rolling-lineup": "Rolling Lineup",
	};

	const currentName = pathNames[location.pathname];

	return (
		<header className="mb-6 bg-primary text-primary-foreground shadow-md">
			<div className="container mx-auto px-4 h-16 relative flex items-center justify-between">
				<div className="hidden md:block z-10">
					<Breadcrumb className="text-primary-foreground/80">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									asChild
									className="text-primary-foreground/80 hover:text-primary-foreground"
								>
									<Link to="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							{!isHome && currentName && (
								<>
									<BreadcrumbSeparator className="text-primary-foreground/60" />
									<BreadcrumbItem>
										<BreadcrumbPage className="text-primary-foreground font-medium">
											{currentName}
										</BreadcrumbPage>
									</BreadcrumbItem>
								</>
							)}
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold tracking-tight">
					RSC Roster Tools
				</h1>
				<div className="w-4"></div>
			</div>

			<div className="container mx-auto px-4 pb-2 md:hidden">
				<Breadcrumb className="text-primary-foreground/80 text-xs">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink
								asChild
								className="text-primary-foreground/80 hover:text-primary-foreground"
							>
								<Link to="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{!isHome && currentName && (
							<>
								<BreadcrumbSeparator className="text-primary-foreground/60" />
								<BreadcrumbItem>
									<BreadcrumbPage className="text-primary-foreground font-medium">
										{currentName}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</>
						)}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
};

export default AppBarComponent;
