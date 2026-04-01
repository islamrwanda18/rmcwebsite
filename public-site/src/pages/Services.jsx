const Services = ({ t }) => {
  return (
    <div className="bg-gray-50 py-16 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rmc-black mb-2" dangerouslySetInnerHTML={{ __html: t("head_services") }}></h2>
          <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
          <p className="mt-4 text-gray-600">Access official services provided by the Rwanda Muslim Community.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 block border border-gray-100">
            <div className="h-32 bg-gradient-to-r from-rmc-blue to-blue-600 flex items-center justify-center text-white text-4xl">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-rmc-dark-green">Education Services</h3>
              <p className="text-gray-500 text-sm mb-4">Registration, management, and coordination of Islamic educational institutions.</p>
              <span className="text-rmc-blue font-bold text-sm">Access Service &rarr;</span>
            </div>
          </a>
          
          <a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 block border border-gray-100">
            <div className="h-32 bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-4xl">
              <i className="fas fa-ring"></i>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-rmc-dark-green">Marriage Services</h3>
              <p className="text-gray-500 text-sm mb-4">Facilitating Islamic marriages (Nikah), counseling, and official certifications.</p>
              <span className="text-pink-600 font-bold text-sm">Access Service &rarr;</span>
            </div>
          </a>

          <a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 block border border-gray-100">
            <div className="h-32 bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center text-white text-4xl">
              <i className="fas fa-bed"></i>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-rmc-dark-green">Funeral Services</h3>
              <p className="text-gray-500 text-sm mb-4">Respectful handling of Janazah and burial arrangements according to Islamic principles.</p>
              <span className="text-gray-800 font-bold text-sm">Access Service &rarr;</span>
            </div>
          </a>

          <a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 block border border-gray-100">
            <div className="h-32 bg-gradient-to-r from-rmc-green to-emerald-600 flex items-center justify-center text-white text-4xl">
              <i className="fas fa-book-reader"></i>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-rmc-dark-green">Dawah Services</h3>
              <p className="text-gray-500 text-sm mb-4">Requesting scholars, literature, and programs to learn more about Islam.</p>
              <span className="text-rmc-green font-bold text-sm">Access Service &rarr;</span>
            </div>
          </a>

          <a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 block border border-gray-100">
            <div className="h-32 bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white text-4xl">
              <i className="fas fa-hands-helping"></i>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2 text-rmc-dark-green">Socio-development Services</h3>
              <p className="text-gray-500 text-sm mb-4">Zakat and Sadaqah distribution, health, and community welfare programs.</p>
              <span className="text-orange-600 font-bold text-sm">Access Service &rarr;</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
