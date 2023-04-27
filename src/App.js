import "./App.css";
import Combinations from "./components/Combinations";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import AppBarComponent from "./components/AppBarComponent";

function App() {
  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <AppBarComponent title="TEAM COMBINER" />
      <Combinations />
    </Container>
  );
}

export default App;