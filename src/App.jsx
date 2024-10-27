import WeatherData from "./components/WeatherData";
import { TempContextProvider } from "./context/TempUnitContext";
function App() {
  return (
    <>
      <TempContextProvider>
      <WeatherData />
      </TempContextProvider>
    </>
  );
}

export default App;
