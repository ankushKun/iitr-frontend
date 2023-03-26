import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Profile from "./pages/profile";
import Verification from "./pages/verification";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verification" element={<Verification />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </Router>
  );
}
