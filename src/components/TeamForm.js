import React, { useState } from "react";

const initialPlayers = [
	{
		name: "player1",
		cmv: "1200",
	},
	{
		name: "player2",
		cmv: "1200",
	},
	{
		name: "player3",
		cmv: "1200",
	},
	{
		name: "player4",
		cmv: "1200",
	},
	{
		name: "player5",
		cmv: "1200",
	},
];

const TeamForm = () => {
	const [players, setPlayers] = useState(initialPlayers);

	const inputHandler = (event) => {

  };

	return (
		<div>
			
		</div>
	);
};

export default TeamForm;
