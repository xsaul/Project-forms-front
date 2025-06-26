
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from "./pages/HomePage";
import TemplatesPage from "./pages/TemplatesPage";
import TemplateDetails from "./components/TemplateDetails";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/:id" element={<TemplateDetails />} />
      </Routes>
    </Router>
  )
}

export default App
