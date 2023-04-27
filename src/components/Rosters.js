import React from "react";
import { Container, Card, Grid } from "@mui/material";
import TeamCard from "./TeamCard";

const Rosters = ({ possibleRosters, teamCap }) => {
  return (
    <Container maxWidth="lg">
      <h3>Possible rosters: {possibleRosters.length}</h3>
      <Grid container spacing={2}>
        {possibleRosters.map((team, index) => (
          <Grid key={index} item xs={6} sm={4} md={3}>
            <Card>
              <TeamCard players={team.players} cap={teamCap} cmv={team.totalCmv} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Rosters;