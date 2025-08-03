import React, { useCallback, useState, useEffect } from "react";
import { Container, Card, Button } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddIcon from "@mui/icons-material/Add";
import classes from "./Combinations.module.css";
import PlayerCard from "./PlayerCard"; // <-- Import the new component
import { fetchAllPlayers } from "../utils/firebase"; // Adjust the import path as necessary

const PlayerForm = ({ players, setPlayers }) => {
	// State to hold the list of all players from the database
	const [allPlayers, setAllPlayers] = useState([]);

	// Fetch all players from the database when the component mounts
	useEffect(() => {
		const getPlayers = async () => {
			const playersFromDB = await fetchAllPlayers();
			setAllPlayers(playersFromDB);
		};
		getPlayers();
	}, []); // Empty dependency array ensures this runs only once
	const addFormFields = useCallback(() => {
		setPlayers((prev) => [
			...prev,
			{
				name: "Player " + (prev.length + 1),
				cmv: 0,
				lock: false,
				highlight: false,
			},
		]);
	}, [setPlayers]);

	const removeFormField = useCallback(
		(indexToRemove) => {
			setPlayers((prev) => prev.filter((_, i) => i !== indexToRemove));
		},
		[setPlayers]
	);

	// This function is now passed to each PlayerCard to handle updates on blur.
	const updatePlayer = useCallback(
		(index, updatedPlayerData) => {
			setPlayers((prev) =>
				prev.map((player, i) => (i === index ? updatedPlayerData : player))
			);
		},
		[setPlayers]
	);

	return (
		<Container maxWidth="lg" className={classes.container}>
			<form>
				<Grid container spacing={2}>
					{players.map((player, index) => (
						<Grid key={index} xs={6} md={4}>
							<PlayerCard
								player={player}
								index={index}
								allPlayers={allPlayers}
								onPlayerUpdate={updatePlayer}
								onPlayerRemove={removeFormField}
							/>
						</Grid>
					))}
					<Grid xs={6} md={4}>
						<Card
							sx={{
								padding: 2,
								height: "100%",
								display: "flex",
							}}
						>
							<Button
								className="button add"
								fullWidth
								type="button"
								onClick={addFormFields}
							>
								<AddIcon fontSize="large" />
							</Button>
						</Card>
					</Grid>
				</Grid>
			</form>
		</Container>
	);
};

export default PlayerForm;
