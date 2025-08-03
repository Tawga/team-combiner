import React, { useState, useEffect } from "react";
import {
	Card,
	TextField,
	Button,
	Checkbox,
	FormControlLabel,
	Autocomplete,
} from "@mui/material";

// React.memo prevents this component from re-rendering if its props haven't changed.
const PlayerCard = React.memo(
	({ player, index, allPlayers, onPlayerUpdate, onPlayerRemove }) => {
		// Internal state for this card only. This makes typing feel instantaneous.
		const [currentPlayer, setCurrentPlayer] = useState(player);

		useEffect(() => {
			setCurrentPlayer(player);
		}, [player]);

		// Handle changes to text fields, updating only the internal state.
		const handleInputChange = (event) => {
			const { name, value } = event.target;
			setCurrentPlayer((prev) => ({
				...prev,
				[name]: name === "cmv" ? Number(value) : value,
			}));
		};

		// This function is called when a player is selected from the autocomplete list
		const handleAutocompleteChange = (event, selectedOption) => {
			if (selectedOption) {
				// When a player is selected, update both name and cmv
				const updatedPlayer = {
					...currentPlayer,
					name: selectedOption.player_name,
					cmv: selectedOption.cmv,
				};
				setCurrentPlayer(updatedPlayer);
				// Immediately update the parent to reflect the change
				onPlayerUpdate(index, updatedPlayer);
			}
		};

		const toggleCheckbox = (name) => {
			const updatedPlayer = { ...currentPlayer, [name]: !currentPlayer[name] };
			setCurrentPlayer(updatedPlayer);
			onPlayerUpdate(index, updatedPlayer); // Update parent immediately
		};

		const handleCheckboxChange = (event) => {
			toggleCheckbox(event.target.name); // Update parent immediately for checkboxes
		};

		const handleCheckboxKeyDown = (event) => {
			if (event.key === "Enter") {
				event.preventDefault(); // Prevent default behavior
				toggleCheckbox(event.target.name);
			}
		};

		const handleBlur = () => {
			onPlayerUpdate(index, currentPlayer);
		};

		const handleKeyUp = (event) => {
			if (event.key === "Enter") {
				event.preventDefault(); // Prevents default form submission behavior
				handleBlur(); // Trigger the same logic as onBlur
			}
		};

		return (
			<Card
				sx={{
					padding: 2,
					minHeight: 235,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Autocomplete
					// The value is an object from the allPlayers list that matches the current player's name
					value={
						allPlayers.find((p) => p.player_name === currentPlayer.name) || null
					}
					onChange={handleAutocompleteChange}
					options={allPlayers}
					// Tell Autocomplete how to get the label for each option
					getOptionLabel={(option) => option.player_name || ""}
					// This helps React efficiently render the list
					renderOption={(props, option) => (
						<li {...props} key={option.id}>
							{option.player_name}
						</li>
					)}
					// This is the input field the user types into
					renderInput={(params) => (
						<TextField
							{...params}
							label="Name"
							size="small"
							margin="dense"
							onBlur={handleBlur}
						/>
					)}
				/>
				<TextField
					type="number"
					name="cmv"
					label="CMV"
					size="small"
					margin="dense"
					fullWidth
					value={currentPlayer.cmv}
					onChange={handleInputChange}
					onBlur={handleBlur} // Update on blur
					onKeyUp={handleKeyUp}
				/>
				<FormControlLabel
					control={
						<Checkbox
							name="lock"
							checked={currentPlayer.lock}
							onChange={handleCheckboxChange}
							onKeyDown={handleCheckboxKeyDown}
						/>
					}
					label="Lock to roster"
				/>
				<FormControlLabel
					control={
						<Checkbox
							name="highlight"
							checked={currentPlayer.highlight}
							onChange={handleCheckboxChange}
							onKeyDown={handleCheckboxKeyDown}
						/>
					}
					label="Highlight"
				/>
				<Button
					type="button"
					className="button remove"
					fullWidth
					onClick={() => onPlayerRemove(index)}
					sx={{ marginTop: "auto" }}
				>
					Remove
				</Button>
			</Card>
		);
	}
);

export default PlayerCard;
