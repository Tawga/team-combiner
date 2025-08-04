import React, { useCallback, useState } from "react";
import {
	Container,
	Card,
	Button,
	TextField,
	Autocomplete,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddIcon from "@mui/icons-material/Add";
import classes from "./Combinations.module.css";
import PlayerFormRow from "./PlayerFormRow";

const PlayerForm = ({ players, allPlayers, setPlayers }) => {
	// State to hold the list of all players from the database
	const [newPlayer, setNewPlayer] = useState({});

	const addNewPlayer = () => {
		setPlayers((prev) => [...prev, newPlayer]);
	};

	const removePlayer = useCallback(
		(indexToRemove) => {
			setPlayers((prev) => prev.filter((_, i) => i !== indexToRemove));
		},
		[setPlayers]
	);

	const updatePlayer = useCallback(
		(index, updatedPlayerData) => {
			setPlayers((prev) =>
				prev.map((player, i) => (i === index ? updatedPlayerData : player))
			);
		},
		[setPlayers]
	);

	const handleNewPlayerChange = (event, value) => {
		const updatedPlayer = {
			name: value?.player_name,
			cmv: value?.cmv,
			lock: false,
			highlight: false,
		};
		setNewPlayer(updatedPlayer);
	};

	return (
		<Container maxWidth="lg" className={classes.container}>
			<Card
				sx={{
					padding: 2,
				}}
			>
				<Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
					<Grid xs={6} md={4}>
						<Autocomplete
							value={
								allPlayers.find((p) => p.player_name === newPlayer?.name) ||
								null
							}
							onChange={handleNewPlayerChange}
							options={allPlayers}
							// Tell Autocomplete how to get the label for each option
							getOptionLabel={(option) => option.player_name || ""}
							// This helps React efficiently render the list
							renderOption={(props, option) => (
								<li {...props} key={option.id}>
									{option.player_name}
									{option.cmv}
								</li>
							)}
							fullWidth
							renderInput={(params) => (
								<TextField {...params} label="Name" size="small" fullWidth />
							)}
						/>
					</Grid>
					<Grid xs={6} md={4}>
						<TextField
							type="number"
							name="cmv"
							label="CMV"
							size="small"
							fullWidth
							disabled
							value={newPlayer?.cmv || ""}
						/>
					</Grid>
					<Grid xs={6} md={4}>
						<Button
							type="button"
							size="small"
							className="button add"
							fullWidth
							onClick={addNewPlayer}
						>
							<AddIcon fontSize="large" /> Add Player
						</Button>
					</Grid>
				</Grid>
				<Grid container>
					{players.map((player, index) => (
						<PlayerFormRow
							player={player}
							index={index}
							onPlayerUpdate={updatePlayer}
							onPlayerRemove={removePlayer}
						/>
					))}
				</Grid>
			</Card>
		</Container>
	);
};

export default PlayerForm;
