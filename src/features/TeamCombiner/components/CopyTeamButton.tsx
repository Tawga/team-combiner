import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Check, Copy } from "lucide-react";
import { Player } from "../../../types/index";

interface CopyTeamButtonProps {
	players: Player[];
}

const CopyTeamButton: React.FC<CopyTeamButtonProps> = ({ players }) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setCopied(false);
	}, [players]);

	const shareTeamHandler = () => {
		const encodedPlayers = encodeURIComponent(JSON.stringify(players));
		const url = `${window.location.origin}/?players=${encodedPlayers}`;
		navigator.clipboard.writeText(url);
		setCopied(true);
		// Optional: Reset after a few seconds
		setTimeout(() => setCopied(false), 3000);
	};

	return (
		<Button
			variant={copied ? "default" : "outline"}
			onClick={shareTeamHandler}
			className={copied ? "bg-green-600 hover:bg-green-700 text-white" : ""}
		>
			{copied ? (
				<Check className="mr-2 h-4 w-4" />
			) : (
				<Copy className="mr-2 h-4 w-4" />
			)}
			{copied ? "URL Copied" : "Share Team URL"}
		</Button>
	);
};

export default CopyTeamButton;
