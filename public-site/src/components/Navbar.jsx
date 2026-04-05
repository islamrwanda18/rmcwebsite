import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Navbar = ({ lang, setLang, t }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerData, setHeaderData] = useState(null);
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

  // Translation key map from path to nav translation key
  const pathToTranslationKey = {
    "/": "nav_home",
    "/services": "nav_services",
    "/program": "nav_program",
    "/news": "nav_news",
    "/about": "nav_about",
    "/contact": "nav_contact"
  };

  // Build navLinks from Firestore or defaults
  const navLinks = headerData?.navLinks
    ? headerData.navLinks.map(link => ({
        name: pathToTranslationKey[link.path] ? t(pathToTranslationKey[link.path]) : link.name,
        path: link.path
      }))
    : [
        { name: t("nav_home"), path: "/" },
        { name: t("nav_services"), path: "/services" },
        { name: t("nav_program"), path: "/program" },
        { name: t("nav_news"), path: "/news" },
        { name: t("nav_about"), path: "/about" },
        { name: t("nav_contact"), path: "/contact" }
      ];

  const logoUrl = headerData?.logoUrl || "https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg";
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
                <span dangerouslySetInnerHTML={{ __html: link.name }}></span>
              </Link>
            ))}
          </div>

          {/* Controls: Lang Switcher & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)} 
              className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:ring-rmc-green focus:border-rmc-green bg-gray-50 text-gray-600 font-semibold cursor-pointer"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="rw">🇷🇼 RW</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="sw">🇹🇿 SW</option>
              <option value="ar">🇸🇦 AR</option>
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
              <span dangerouslySetInnerHTML={{ __html: link.name }}></span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
