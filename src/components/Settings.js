import { useState } from "react";
import _ from "lodash";
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
import CopyTeamButton from "./CopyTeamButton";

const Settings = ({
	teamCap,
	setTeamCap,
	players,
	setSelectedTier,
	selectedTier,
	tierCaps,
}) => {
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
				<InputLabel>Select Tier</InputLabel>
				<Select
					size="small"
					value={selectedTier || ""}
					onChange={dropdownHandler}
					input={<OutlinedInput label="Select Tier" />}
				>
					{tierCaps.map((tier) => (
						<MenuItem key={tier.id} value={tier.cap}>
							{_.startCase(tier.id)} - {tier.cap}
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
			<CopyTeamButton players={players} />
		</Container>
	);
};

export default Settings;
