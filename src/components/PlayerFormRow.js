import { Button, FormControlLabel, Checkbox, Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import DeleteIcon from "@mui/icons-material/Delete";

const PlayerFormRow = ({ player, index, onPlayerUpdate, onPlayerRemove }) => {
	const handleCheckboxChange = (event) => {
		const updatedPlayer = {
			...player,
			[event.target.name]: event.target.checked,
		};
		onPlayerUpdate(index, updatedPlayer);
	};

	return (
		<Grid item key={index} xs={12} md={12}>
			<Divider />
			<Grid
				container
				sx={{ justifyContent: "space-between", alignItems: "center" }}
			>
				<Grid item xs={6} md={2}>
					<p>{player.name}</p>
				</Grid>
				<Grid item xs={6} md={2}>
					<p>{player.cmv}</p>
				</Grid>
				<Grid item xs={5} md={2}>
					<FormControlLabel
						control={
							<Checkbox
								name="lock"
								checked={player?.lock}
								onChange={handleCheckboxChange}
							/>
						}
						label="Lock to roster"
					/>
				</Grid>
				<Grid item xs={5} md={2}>
					<FormControlLabel
						control={
							<Checkbox
								name="highlight"
								checked={player?.highlight}
								onChange={handleCheckboxChange}
							/>
						}
						label="Highlight"
					/>
				</Grid>
				<Grid item xs={2} md={1}>
					<Button onClick={() => onPlayerRemove(index)}>
						<DeleteIcon />
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default PlayerFormRow;
