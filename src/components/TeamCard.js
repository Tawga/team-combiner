import React from "react";
import classes from "./TeamCard.module.css";

import LockIcon from "@mui/icons-material/Lock";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { sortBy } from "lodash"
 
const TeamCard = ({ cap: teamCap, players, cmv }) => {

	const cmvLeft = teamCap - cmv;

	return (
		<div className={classes.card}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 100 }} size="small">
					<TableHead>
						<TableRow>
							<TableCell sx={{fontWeight:"bold"}}>Name</TableCell>
							<TableCell align="right" sx={{fontWeight:"bold"}}>CMV</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortBy(players, ["cmv"])
							.reverse()
							.map((player, index) => (
								<TableRow
									key={index}
									sx={{
										backgroundColor: player.highlight ? "#86d875cc" : null,
									}}
								>
									<TableCell component="th" scope="player">
										{player.name}{" "}
										{player.lock && <LockIcon sx={{ height: 12 }} />}
									</TableCell>
									<TableCell align="right">{player.cmv}</TableCell>
								</TableRow>
							))}
					</TableBody>
					<TableHead>
						<TableRow sx={{ backgroundColor: cmvLeft<=25 ? "#cfebcacc": "#fcf6a4cc" }}>
							<TableCell>CMV left:</TableCell>
							<TableCell align="right">{cmvLeft}</TableCell>
						</TableRow>
					</TableHead>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TeamCard;
