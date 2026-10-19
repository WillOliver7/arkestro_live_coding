import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Lendings from "./pages/Lendings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="members" element={<Members />} />
        <Route path="lendings" element={<Lendings />} />
      </Route>
    </Routes>
  );
}

export default App;
