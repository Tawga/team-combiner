import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

const CopyTeamButton = ({ players }) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setCopied(false);
	}, [players]);

	const shareTeamHandler = () => {
		const encodedPlayers = encodeURIComponent(JSON.stringify(players));
		const url = `${window.location.origin}/?players=${encodedPlayers}`;
		navigator.clipboard.writeText(url);
		setCopied(true);
	};

	return (
		<Button
			endIcon={!copied ? <ContentCopyIcon /> : <CheckIcon />}
            color={copied ? "success" : "primary"}
			onClick={shareTeamHandler}
			sx={{ float: "right" }}
		>
			{!copied ? "Share Team URL" : "URL Copied to clipboard"}
		</Button>
	);
};

export default CopyTeamButton;
