import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Program from "./pages/Program";
import News from "./pages/News";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { translations } from "./translations";
import "./index.css";

function App() {
  const [lang, setLang] = useState("en");

  // Get current language translations
  const t = (key) => {
    return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar lang={lang} setLang={setLang} t={t} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/services" element={<Services t={t} />} />
            <Route path="/program" element={<Program t={t} />} />
            <Route path="/news" element={<News t={t} />} />
            <Route path="/about" element={<About t={t} />} />
            <Route path="/contact" element={<Contact t={t} />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
