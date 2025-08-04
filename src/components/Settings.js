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
	Box,
	Typography,
	RadioGroup,
	FormControlLabel,
	Radio,
} from "@mui/material";

import classes from "./Combinations.module.css";
import CopyTeamButton from "./CopyTeamButton";

const Settings = ({
	teamCap,
	setTeamCap,
	players,
	tierCaps,
	sortBy,
	setSortBy,
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
	};

	return (
		<Container
			maxWidth="lg"
			className={classes["container-top"]}
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
			}}
		>
			<FormControl sx={{ m: 1, width: 250 }}>
				<InputLabel>Select Tier</InputLabel>
				<Select
					size="small"
					value={teamCap || ""}
					onChange={dropdownHandler}
					input={<OutlinedInput label="Select Tier" />}
				>
					{tierCaps.map((tier) => (
						<MenuItem key={tier.id} value={tier.cap}>
							{_.startCase(tier.id)} - {tier.cap}
						</MenuItem>
					))}
					{/* <MenuItem value={"custom"}>Custom</MenuItem> */}
				</Select>
			</FormControl>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Typography
					variant="body2"
					sx={{ mr: 2, fontWeight: 500, color: "text.secondary" }}
				>
					Sort Players By
				</Typography>
				<FormControl>
					<RadioGroup
						row
						aria-labelledby="sort-by-label"
						name="sort-by-group"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
					>
						<FormControlLabel
							value="player_name"
							control={<Radio size="small" />}
							label="Name"
						/>
						<FormControlLabel
							value="cmv"
							control={<Radio size="small" />}
							label="CMV"
						/>
					</RadioGroup>
				</FormControl>
			</Box>

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
