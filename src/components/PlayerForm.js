import React, { useCallback } from "react";
import {
	Container,
	Card,
	TextField,
	Button,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import classes from "./Combinations.module.css";

const PlayerForm = ({ players, setPlayers }) => {
	const addFormFields = useCallback(() => {
		setPlayers([
			...players,
			{
				name: "Player " + (players.length + 1),
				cmv: 1200,
				lock: false,
				highlight: false,
			},
		]);
	}, [players, setPlayers]);

	const removeFormField = useCallback(
		(index) => {
			setPlayers(players.filter((_, i) => i !== index));
		},
		[players, setPlayers]
	);

	const handleFieldChange = useCallback(
		(index, event) => {
			const { name, value } = event.target;
			setPlayers(
				players.map((player, i) =>
					i === index
						? { ...player, [name]: name === "cmv" ? Number(value) : value }
						: player
				)
			);
		},
		[players, setPlayers]
	);

	const handleCheckboxToggle = useCallback(
		(index, event) => {
			const { name } = event.target;
			setPlayers(
				players.map((player, i) =>
					i === index ? { ...player, [name]: !player[name] } : player
				)
			);
		},
		[players, setPlayers]
	);

	return (
		<Container maxWidth="lg" className={classes.container}>
			<form>
				<Grid container spacing={2}>
					{players.map((player, index) => {
						return (
							<Grid key={index} xs={6} md={4}>
								<Card
									sx={{
										padding: 3,
									}}
								>
									<TextField
										type="text"
										name="name"
										label="Name"
										size="small"
										margin="dense"
										fullWidth
										value={player.name || ""}
										onChange={(e) => handleFieldChange(index, e)}
									/>
									<TextField
										type="number"
										name="cmv"
										label="CMV"
										size="small"
										margin="dense"
										fullWidth
										value={player.cmv || ""}
										onChange={(e) => handleFieldChange(index, e)}
									/>

									<FormControlLabel
										control={<Checkbox name="lock" checked={player.lock} />}
										label="Lock to roster"
										onClick={(e) => handleCheckboxToggle(index, e)}
									/>

									<FormControlLabel
										control={
											<Checkbox name="highlight" checked={player.highlight} />
										}
										label="Highlight"
										onClick={(e) => handleCheckboxToggle(index, e)}
									/>

									<Button
										type="button"
										className="button remove"
										fullWidth
										onClick={() => removeFormField(index)}
									>
										Remove
									</Button>
								</Card>
							</Grid>
						);
					})}
					<Grid xs={6} md={4}>
						<Button
							variant="contained"
							className="button add"
							fullWidth
							type="button"
							onClick={() => addFormFields()}
						>
							Add New Player
						</Button>
					</Grid>
				</Grid>
			</form>
		</Container>
	);
};

export default PlayerForm;
