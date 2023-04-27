import React, { useState } from "react";
import {
	Container,
	TextField,
	Select,
	OutlinedInput,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import classes from "./Combinations.module.css";
import tierCaps from "../TierCaps";

const TeamCap = ({ teamCap, setTeamCap }) => {
	const [selectedTier, setSelectedTier] = useState(5260);
	const [custom, setCustom] = useState(false);

	const teamCapHandler = (event) => {
		if (event.target.value >= 0) {
			setTeamCap(event.target.value);
		}
	};

	const dropdownHandler = (event) => {
		if (event.target.value === "custom") {
			setCustom(true);
		} else {
			setCustom(false);
			setTeamCap(event.target.value);
		}
		setSelectedTier(event.target.value);
	};

	return (
		<Container maxWidth="lg" className={classes["container-top"]}>
			<FormControl sx={{ m: 1, width: 300 }}>
				<InputLabel>RSC Team Cap</InputLabel>
				<Select
					size="small"
					value={selectedTier}
					onChange={dropdownHandler}
					input={<OutlinedInput label="RSC Team Cap" />}
				>
					{tierCaps.map((tier) => (
						<MenuItem key={tier.name} value={tier.cap}>
							{tier.name} - {tier.cap}
						</MenuItem>
					))}
					<MenuItem value={"custom"}>Custom</MenuItem>
				</Select>
			</FormControl>

			{custom && (
				<TextField
					type="number"
					name="teamCap"
					label="Custom cap"
					size="small"
					margin="dense"
					required
					value={teamCap}
					onChange={teamCapHandler}
				/>
			)}
		</Container>
	);
};

export default TeamCap;
