import React from "react";
import classes from "./Combinations.module.css";

import {
	Container,
	Card,
	TextField,
	Button,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const PlayerForm = (props) => {
	const { players, setPlayers} = props;

    const addFormFields = () => {
		setPlayers([...players, { name: "", cmv: 1200, lock: false }]);
	};

	const removeFormFields = (i) => {
		let newFormValues = [...players];
		newFormValues.splice(i, 1);
		setPlayers(newFormValues);
	};

    const handleChange = (i, event) => {
		let newFormValues = [...players];
		if (event.target.name === "cmv") {
			newFormValues[i][event.target.name] = Number(event.target.value);
		} else {
			newFormValues[i][event.target.name] = event.target.value;
		}
		setPlayers(newFormValues);
	};

    const lockHandler = (i, event) => {
        let newFormValues = [...players];
        newFormValues[i][event.target.name] = !newFormValues[i][event.target.name];
        setPlayers(newFormValues);
    }

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
										required
										value={player.name || ""}
										onChange={(e) => handleChange(index, e)}
									/>
									<TextField
										type="number"
										name="cmv"
										label="CMV"
										size="small"
										margin="dense"
										required
										value={player.cmv || ""}
										onChange={(e) => handleChange(index, e)}
									/>

									<FormControlLabel
										control={<Checkbox name="lock" checked={player.lock} />}
										label="Lock to roster"
                                        onClick={(e) => lockHandler(index, e)}
									/>

									<Button
										type="button"
										className="button remove"
										onClick={() => removeFormFields(index)}
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
