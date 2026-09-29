import { Sidebar } from "./components/Sidebar";
import { TelemetryPage } from "./pages/TelemetryPage";

function App() {
  return (
    <div className="flex h-screen w-screen bg-[#08111F] sm:flex-row flex-col">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <TelemetryPage />
      </div>
    </div>
  );
}

export default App;