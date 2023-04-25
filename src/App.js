import "./App.css";
import Combinations from "./components/Combinations";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function App() {
	return (
		<Container maxWidth="lg">
			<CssBaseline />
			<AppBar>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						TEAM COMBINER
					</Typography>
				</Toolbar>
			</AppBar>
			<Combinations />
		</Container>
	);
}

export default App;
