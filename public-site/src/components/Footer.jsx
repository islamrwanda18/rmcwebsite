import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-rmc-black text-white pt-16 pb-8 mt-auto border-t-4 border-rmc-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brief + Socials */}
          <div>
            <img src="https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg" alt="RMC Logo" className="h-16 w-16 rounded-full border-2 border-gray-600 mb-4" />
            <h3 className="font-bold text-lg mb-3">Rwanda Muslim Community</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">The apex body representing the Islamic faith and interests in Rwanda, dedicated to spiritual guidance and socio-economic development.</p>
            <div className="flex space-x-4">
              <a href="https://x.com/islamrwanda" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 flex items-center justify-center rounded-full transition"><i className="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com/islamrwandaofficial/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 flex items-center justify-center rounded-full transition"><i className="fab fa-instagram"></i></a>
              <a href="https://www.facebook.com/RMC.Islamrwanda/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 flex items-center justify-center rounded-full transition"><i className="fab fa-facebook-f"></i></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-rmc-green">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Education</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Scholarships</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Sadaqat</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Zakat</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Job Opportunity</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-rmc-green">Services</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Education Services</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Marriage Services</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Funeral Services</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Dawah Services</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Hijrah and Umrah</a></li>
              <li><a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="hover:text-white transition">Scholarship</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-rmc-green">Contact Info</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-rmc-green"></i>
                <span>Kigali, Rwanda<br/>Headquarters</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-rmc-green"></i>
                <a href="mailto:islamrwanda18@gmail.com" className="hover:text-white transition">islamrwanda18@gmail.com</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-rmc-green"></i>
                <span>+250 788 565 998</span>
              </li>
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
