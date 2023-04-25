import React from "react";
import classes from "./TeamCard.module.css";

import LockIcon from '@mui/icons-material/Lock';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const TeamCard = (props) => {
	const teamCap = props.cap;
	const { players, cmv } = props;
	const leftoverCmv = teamCap - cmv;

	return (
		<div className={classes.card}>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 100 }} size="small" aria-label="a dense table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="right">CMV</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{players
							.sort((a, b) => (a.cmv < b.cmv ? 1 : -1))
							.map((player, index) => (
								<TableRow
									key={index}
									sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
								>
									<TableCell component="th" scope="player">
										 {player.name} {player.lock && <LockIcon sx={{ height:12}}/>}
									</TableCell>
									<TableCell align="right">{player.cmv}</TableCell>
								</TableRow>
							))}
					</TableBody>
					<TableHead>
						<TableRow>
							<TableCell>CMV left:</TableCell>
							<TableCell align="right">{leftoverCmv}</TableCell>
						</TableRow>
					</TableHead>
				</Table>
			</TableContainer>
		</div>
	);
};

export default TeamCard;
