import React from "react";
import { Container, Card } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import TeamCard from "./TeamCard";

const Rosters = (props) => {

    const {legalTeams, teamCap} = props;

	return (
		<Container maxWidth="lg">
			<h3>Possible rosters: {legalTeams.length}</h3>
			<Grid container spacing={2}>
				{legalTeams.map((team, index) => {
					return (
						<Grid key={index} xs={6} sm={4} md={3}>
							<Card>
								<TeamCard
									players={team.players}
									cap={teamCap}
									cmv={team.totalCmv}
								/>
							</Card>
						</Grid>
					);
				})}
			</Grid>
		</Container>
	);
};

export default Rosters;
