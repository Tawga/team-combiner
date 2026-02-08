import React from "react";

interface AppBarProps {
	title: string;
}

const AppBarComponent: React.FC<AppBarProps> = ({ title }) => {
	return (
		<header className="mb-6 rounded-b-lg bg-primary text-primary-foreground shadow-md">
			<div className="flex h-16 items-center justify-center px-4">
				<h1 className="text-xl font-bold tracking-tight">{title}</h1>
			</div>
		</header>
	);
};

export default AppBarComponent;
