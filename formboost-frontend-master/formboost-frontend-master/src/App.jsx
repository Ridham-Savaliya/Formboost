import { RecoilRoot } from "recoil";
import "./App.css";
import AppRoutes from "./routes";

function App() {
  return (
    <>
      <RecoilRoot>
        <AppRoutes />
      </RecoilRoot>
    </>
  );
}

export default App;
