import React from 'react'
import classes from "./Combinations.module.css";
import { Container, TextField } from '@mui/material'

const TeamCap = (props) => {

    const {teamCap, setTeamCap} = props;

    const teamCapHandler = (event) => {
		if (event.target.value >= 0) {
			setTeamCap(event.target.value);
		}
	};

  return (
    <Container maxWidth="lg" className={classes["container-top"]}>
				<TextField
					type="number"
					name="teamCap"
					label="Team Cap"
					size="small"
					margin="dense"
					required
					value={teamCap}
					onChange={teamCapHandler}
				/>
			</Container>
  )
}

export default TeamCap