import React, { useState, useEffect, useCallback } from "react";
import TeamCard from "./TeamCard.js";
import classes from "./Combinations.module.css";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";

const initialPlayers = [
	{
		name: "Player 1",
		cmv: 1200,
	},
	{
		name: "Player 2",
		cmv: 1200,
	},
	{
		name: "Player 3",
		cmv: 1200,
	},
	{
		name: "Player 4",
		cmv: 1200,
	},
];

const Combinations = () => {
	const rosterSize = 4;
	const [teamCap, setTeamCap] = useState(5260);
	const [players, setPlayers] = useState(initialPlayers);
	const [legalTeams, setLegalTeams] = useState([]);

	const isLegal = useCallback(
		(roster) => {
			let totalCmv = 0;
			roster.forEach((player) => {
				totalCmv += player.cmv;
			});

			return totalCmv <= teamCap;
		},
		[teamCap]
	);

	const calculateTeams = useCallback(() => {
		console.log("calculating");
		if (players.length < rosterSize) {
			setLegalTeams([]);
			return;
		} else {
			const allCombinations = combinations(players, rosterSize).filter(isLegal);

			const rosters = allCombinations.map((combination) => {
				let totalCmv = 0;
				combination.forEach((player) => {
					totalCmv += player.cmv;
				});

				const roster = { players: combination, totalCmv: totalCmv };
				return roster;
			});

			setLegalTeams(rosters.sort((a, b) => (a.totalCmv < b.totalCmv ? 1 : -1)));
		}
	}, [players, isLegal]);

	function combinations(a, c) {
		let index = [];
		let n = a.length;

		for (let j = 0; j < c; j++) index[j] = j;
		index[c] = n;

		let ok = true;
		let result = [];

		while (ok) {
			let comb = [];
			for (let j = 0; j < c; j++) comb[j] = a[index[j]];
			result.push(comb);

			ok = false;

			for (let j = c; j > 0; j--) {
				if (index[j - 1] < index[j] - 1) {
					index[j - 1]++;
					for (let k = j; k < c; k++) index[k] = index[k - 1] + 1;
					ok = true;
					break;
				}
			}
		}
		return result;
	}

	let handleChange = (i, e) => {
		let newFormValues = [...players];
		if (e.target.name === "cmv") {
			newFormValues[i][e.target.name] = Number(e.target.value);
		} else {
			newFormValues[i][e.target.name] = e.target.value;
		}
		setPlayers(newFormValues);
	};

	let addFormFields = () => {
		setPlayers([...players, { name: "", cmv: 1200 }]);
	};

	let removeFormFields = (i) => {
		let newFormValues = [...players];
		newFormValues.splice(i, 1);
		setPlayers(newFormValues);
	};

	useEffect(() => {
		calculateTeams();
	}, [players, calculateTeams]);

	const teamCapHandler = (event) =>  {
		if(event.target.value >= 0){
			setTeamCap(event.target.value);
		}
		
	}

	return (
		<React.Fragment>
			<Container maxWidth="lg" className={classes.container}>
				<TextField
					type="text"
					name="teamCap"
					label="Team Cap"
					size="small"
					margin="dense"
					required
					value={teamCap}
					onChange={teamCapHandler}
				/>
			</Container>
			<Container maxWidth="lg" className={classes.container}>
				<form>
					<Grid container spacing={2}>
						{players.map((player, index) => {
							return (
								<Grid key={index} xs={6} md={4}>
									<Card
										sx={{
											padding: 4,
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
			<Container maxWidth="lg">
				<h3>Possible rosters: {legalTeams.length}</h3>
				<Grid container spacing={2}>
					{legalTeams.map((team, index) => {
						return (
							<Grid key={index} xs={2} sm={4} md={4}>
								<Card>
									<TeamCard players={team.players} cmv={team.totalCmv} />
								</Card>
							</Grid>
						);
					})}
				</Grid>
			</Container>
		</React.Fragment>
	);
};

export default Combinations;
