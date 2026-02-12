import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import Combinations from "./features/TeamCombiner/TeamCombiner";
import RosterLayout from "./layouts/RosterLayout";
import Dashboard from "./pages/Dashboard";
import RollingLineup from "./features/RollingLineup/RollingLineup";
import HelpSection from "./features/TeamCombiner/HelpSection";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RosterLayout />,
		children: [
			{
				index: true,
				element: <Dashboard />,
			},
			{
				path: "combiner",
				element: (
					<>
						<Combinations />
						<HelpSection />
					</>
				),
			},
			{
				path: "rolling-lineup",
				element: <RollingLineup />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
