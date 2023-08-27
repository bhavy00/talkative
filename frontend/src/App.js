import "./App.css"
import { Routes, Route } from "react-router-dom";
import Main from "./pages";
import Sidebar from "./layouts/sidebar/sidebar";
import Home from "./pages/home/home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Main/>} />
        <Route path="/home" element={<Sidebar/>}>
          <Route index element={<Home/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
