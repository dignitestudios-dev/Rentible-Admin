import { Route, Routes } from "react-router-dom";
import "./App.css";
import { auth } from "./routes/auth";
import Splash from "./pages/authentication/Splash";
import { app } from "./routes/app";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      {auth?.map((route) => {
        return (
          <Route key={route?.title} path={route?.url} element={route?.page} />
        );
      })}

      {app?.map((route) => {
        return (
          <Route key={route?.title} path={route?.url} element={route?.page} />
        );
      })}
    </Routes>
  );
}

export default App;
