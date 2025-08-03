import "./App.css";
import Combinations from "./components/Combinations";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import AppBarComponent from "./components/AppBarComponent";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Container maxWidth="lg" sx={{marginBottom: "1rem"}}>
				<CssBaseline />
				<AppBarComponent title="TEAM COMBINER" />
				<Combinations />
			</Container>
		),
	},
]);

function App() {
	return (
		<RouterProvider router={router} />
	);
}

export default App;
