import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Combinations from "./features/TeamCombiner/TeamCombiner";
import AppBarComponent from "./components/AppBarComponent";
import HelpSection from "./components/HelpSection";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<div className="min-h-screen bg-gray-50 pb-10">
				<AppBarComponent title="Team Combiner" />
				<div className="container mx-auto px-4 py-8 max-w-7xl">
					<Combinations />
					<HelpSection />
				</div>
			</div>
		),
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
