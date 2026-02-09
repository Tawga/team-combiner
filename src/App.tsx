import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Combinations from "./features/TeamCombiner/TeamCombiner";
import AppBarComponent from "./components/AppBarComponent";
import HelpSection from "./components/HelpSection";
import FooterComponent from "./components/FooterComponent";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<div className="flex min-h-screen flex-col bg-gray-50">
				<AppBarComponent title="Team Combiner" />
				<div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
					<Combinations />
					<HelpSection />
				</div>
				<FooterComponent />
			</div>
		),
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
