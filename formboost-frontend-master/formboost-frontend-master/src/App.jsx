import { RecoilRoot } from "recoil";
import "./App.css";
import AppRoutes from "./routes";
import PerformanceOptimizer from "./components/PerformanceOptimizer";

function App() {
  return (
    <>
      <PerformanceOptimizer />
      <RecoilRoot>
        <AppRoutes />
      </RecoilRoot>
    </>
  );
}

export default App;
