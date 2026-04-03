import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Services = ({ t }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "services"));
        const servicesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesList);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-gray-50"><i className="fas fa-spinner fa-spin text-4xl text-rmc-green"></i></div>;
  }

  return (
    <div className="bg-gray-50 py-16 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rmc-black mb-2" dangerouslySetInnerHTML={{ __html: t("head_services") }}></h2>
          <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
          <p className="mt-4 text-gray-600">Access official services provided by the Rwanda Muslim Community.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <a key={service.id || index} href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 block border border-gray-100 flex flex-col h-full">
              {service.imageLink && service.imageLink !== 'https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg' ? (
                <div className="h-32 w-full">
                   <img src={service.imageLink} alt={service.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-white text-4xl" style={{ background: service.thumbStyle || 'linear-gradient(to right, #059669, #059669)' }}>
                  <i className={`fas ${service.icon || 'fa-info-circle'}`}></i>
                </div>
              )}
              <div className="p-6 text-center flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-rmc-dark-green">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-4 flex-1">{service.desc}</p>
                <span className="text-rmc-green font-bold text-sm">Access Service &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
