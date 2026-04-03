import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
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

  // Handle RTL for Arabic and update the html lang attribute
  useEffect(() => {
    const htmlEl = document.getElementById("html-root") || document.documentElement;
    htmlEl.setAttribute("lang", lang);
    if (lang === "ar") {
      htmlEl.setAttribute("dir", "rtl");
      document.body.style.fontFamily = "'Amiri', 'Poppins', sans-serif";
    } else {
      htmlEl.setAttribute("dir", "ltr");
      document.body.style.fontFamily = "'Poppins', sans-serif";
    }
  }, [lang]);

  return (
    <Router>
      <div className={`flex flex-col min-h-screen ${lang === 'ar' ? 'text-right' : ''}`}>
        <Navbar lang={lang} setLang={setLang} t={t} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home t={t} lang={lang} />} />
            <Route path="/services" element={<Services t={t} />} />
            <Route path="/program" element={<Program t={t} />} />
            <Route path="/news" element={<News t={t} />} />
            <Route path="/about" element={<About t={t} />} />
            <Route path="/contact" element={<Contact t={t} />} />
          </Routes>
        </main>
        
        <Footer t={t} />
      </div>
    </Router>
  );
}

export default App;
