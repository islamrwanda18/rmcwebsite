import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const docRef = doc(db, "siteConfig", "footer");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFooterData(docSnap.data());
        }
      } catch (err) {
        console.error("Error fetching footer config:", err);
      }
    };
    fetchFooter();
  }, []);

  const socialLinks = footerData?.socialLinks || [
    { name: "@islamrwanda", link: "https://x.com/islamrwanda", icon: "fab fa-twitter" },
    { name: "@islamrwandaofficial", link: "https://www.instagram.com/islamrwandaofficial/", icon: "fab fa-instagram" },
    { name: "RMC.Islamrwanda", link: "https://www.facebook.com/RMC.Islamrwanda/", icon: "fab fa-facebook-f" }
  ];

  const quickLinks = footerData?.quickLinks || [
    { name: "Education", link: "https://rmc-brown.vercel.app/" },
    { name: "Scholarships", link: "https://rmc-brown.vercel.app/" },
    { name: "Sadaqat", link: "https://rmc-brown.vercel.app/" },
    { name: "Zakat", link: "https://rmc-brown.vercel.app/" },
    { name: "Job Opportunity", link: "https://rmc-brown.vercel.app/" }
  ];

  const services = footerData?.services || [
    { name: "Education Services", link: "https://rmc-brown.vercel.app/" },
    { name: "Marriage Services", link: "https://rmc-brown.vercel.app/" },
    { name: "Funeral Services", link: "https://rmc-brown.vercel.app/" },
    { name: "Dawah Services", link: "https://rmc-brown.vercel.app/" },
    { name: "Hijrah and Umrah", link: "https://rmc-brown.vercel.app/" },
    { name: "Scholarship", link: "https://rmc-brown.vercel.app/" }
  ];

  const contactInfo = footerData?.contactInfo || {
    location: "Kigali, Rwanda",
    hq: "Headquarters",
    email: "islamrwanda18@gmail.com",
    phone: "+250 788 565 998"
  };

  const getHoverClass = (icon) => {
    if (icon?.includes("twitter")) return "hover:bg-blue-400";
    if (icon?.includes("instagram")) return "hover:bg-pink-600";
    if (icon?.includes("facebook")) return "hover:bg-blue-600";
    if (icon?.includes("youtube")) return "hover:bg-red-600";
    if (icon?.includes("linkedin")) return "hover:bg-blue-700";
    if (icon?.includes("tiktok")) return "hover:bg-black";
    return "hover:bg-rmc-green";
  };

  return (
    <footer className="bg-rmc-black text-white pt-16 pb-8 mt-auto border-t-4 border-rmc-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <img src={footerData?.branding?.logoUrl || "/android-chrome-192x192.png"} alt="RMC Logo" className="h-16 w-16 rounded-full border-2 border-gray-600 mb-4" />
            <h3 className="font-bold text-lg mb-3">{footerData?.branding?.orgName || "Rwanda Muslim Community"}</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{footerData?.branding?.description || "The apex body representing the Islamic faith and interests in Rwanda, dedicated to spiritual guidance and socio-economic development."}</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, idx) => (
                <a key={idx} href={social.link} target="_blank" rel="noreferrer" className={`w-10 h-10 bg-gray-800 ${getHoverClass(social.icon)} flex items-center justify-center rounded-full transition`}>
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-rmc-green">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {quickLinks.map((item, idx) => (<li key={idx}><a href={item.link} target="_blank" rel="noreferrer" className="hover:text-white transition">{item.name}</a></li>))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-rmc-green">Services</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {services.map((item, idx) => (<li key={idx}><a href={item.link} target="_blank" rel="noreferrer" className="hover:text-white transition">{item.name}</a></li>))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-rmc-green">Contact Info</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start"><i className="fas fa-map-marker-alt mt-1 mr-3 text-rmc-green"></i><span>{contactInfo.location}<br/>{contactInfo.hq}</span></li>
              <li className="flex items-center"><i className="fas fa-envelope mr-3 text-rmc-green"></i><a href={`mailto:${contactInfo.email}`} className="hover:text-white transition">{contactInfo.email}</a></li>
              <li className="flex items-center"><i className="fas fa-phone-alt mr-3 text-rmc-green"></i><span>{contactInfo.phone}</span></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-8">
          &copy; {new Date().getFullYear()} Rwanda Muslim Community. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
