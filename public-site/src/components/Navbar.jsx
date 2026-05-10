import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const LANG_OPTIONS = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "rw", label: "RW", flag: "🇷🇼" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "sw", label: "SW", flag: "🇹🇿" },
  { code: "ar", label: "AR", flag: "🇸🇦" },
];

const triggerGoogleTranslate = (langCode) => {
  // Google Translate uses the hidden <select> element to change languages
  const gtCombo = document.querySelector(".goog-te-combo");
  if (gtCombo) {
    gtCombo.value = langCode;
    gtCombo.dispatchEvent(new Event("change"));
  }
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [currentLang, setCurrentLang] = useState("en");
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const docRef = doc(db, "siteConfig", "header");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeaderData(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching header config:", err);
      }
    };
    fetchHeader();
  }, []);

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    setCurrentLang(langCode);
    triggerGoogleTranslate(langCode);
  };

  // Default nav link names (in English — Google Translate handles the rest)
  const defaultNavNames = {
    "/": "Home",
    "/services": "Services",
    "/program": "Program",
    "/news": "News & Events",
    "/about": "About Us",
    "/contact": "Contact Us",
    "/gallery": "Gallery"
  };

  // Build navLinks from Firestore or defaults
  const baseLinks = headerData?.navLinks
    ? headerData.navLinks.map(link => ({
        name: defaultNavNames[link.path] || link.name,
        path: link.path
      }))
    : Object.entries(defaultNavNames).map(([path, name]) => ({ name, path }));

  // Always append Gallery if not already in the list
  const navLinks = baseLinks.some(link => link.path === "/gallery")
    ? baseLinks
    : [...baseLinks, { name: "Gallery", path: "/gallery" }];

  const logoUrl = headerData?.logoUrl || "/android-chrome-192x192.png";
  const orgName = headerData?.orgName || "RMC";
  const orgSubtitle = headerData?.orgSubtitle || "Rwanda Muslim Community";

  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center cursor-pointer">
            <img 
              src={logoUrl} 
              alt="RMC Logo" 
              className="h-12 w-auto mr-3 rounded-full border border-gray-200" 
            />
            <div>
              <span className="font-bold text-xl text-rmc-dark-green block leading-tight">{orgName}</span>
              <span className="text-xs text-gray-500">{orgSubtitle}</span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`nav-link font-medium transition ${location.pathname === link.path ? 'text-rmc-green font-bold' : 'text-gray-700 hover:text-rmc-green'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Controls: Language Switcher (Google Translate) & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <select 
              value={currentLang} 
              onChange={handleLanguageChange} 
              className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:ring-rmc-green focus:border-rmc-green bg-gray-50 text-gray-600 font-semibold cursor-pointer notranslate"
              id="language-selector"
            >
              {LANG_OPTIONS.map(opt => (
                <option key={opt.code} value={opt.code}>{opt.flag} {opt.label}</option>
              ))}
            </select>
            
            <button className="lg:hidden text-gray-500 hover:text-rmc-green focus:outline-none" onClick={toggleMobileMenu}>
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-2 pt-2 pb-4 space-y-1 shadow-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={handleLinkClick}
              className={`block px-3 py-2 text-base font-medium rounded-md ${location.pathname === link.path ? 'text-rmc-green bg-gray-50' : 'text-gray-700 hover:text-rmc-green hover:bg-gray-50'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
