import { useState } from "react";

const Contact = () => {
  const [mapLoading, setMapLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState("https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1021111.4552097063!2d29.23126749007421!3d-1.9587426861751147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c29654e73840e3%3A0x7490b026cbcca103!2sRwanda!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus");
  const [formData, setFormData] = useState({ fname: "", lname: "", email: "", message: "" });
  const [modalData, setModalData] = useState({ show: false, title: "", message: "" });

  const findNearestMasjids = () => {
    if (!navigator.geolocation) return;
    setMapLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setMapUrl(`https://maps.google.com/maps?q=masjid+near+${pos.coords.latitude},${pos.coords.longitude}&z=14&output=embed`); setMapLoading(false); },
      () => setMapLoading(false),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendViaWhatsApp = () => {
    if (!formData.message) { setModalData({ show: true, title: "Missing Info", message: "Please write an issue or comment before sending." }); return; }
    window.open(`https://wa.me/250788565998?text=${encodeURIComponent(`Hello, I am ${formData.fname} ${formData.lname}. \n\n${formData.message}`)}`, '_blank');
    setFormData({ ...formData, message: "" });
  };

  const sendViaEmail = () => {
    if (!formData.email || !formData.message) { setModalData({ show: true, title: "Missing Info", message: "Please provide your email and issue/comment." }); return; }
    const body = encodeURIComponent(`Hello,\n\nI am ${formData.fname} ${formData.lname}.\n\n${formData.message}\n\nSender Email: ${formData.email}`);
    const to = "islamrwanda18@gmail.com";
    formData.email.toLowerCase().includes('@gmail.com')
      ? window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=RMC Portal Inquiry&body=${body}`, '_blank')
      : (window.location.href = `mailto:${to}?subject=RMC Portal Inquiry&body=${body}`);
    setFormData({ ...formData, message: "" });
  };

  return (
    <div className="bg-white py-16 min-h-screen fade-in relative">
      {modalData.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center fade-in">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="text-4xl mb-4 text-rmc-green"><i className="fas fa-info-circle"></i></div>
            <h3 className="text-lg font-bold mb-2">{modalData.title}</h3>
            <p className="text-gray-600 mb-6">{modalData.message}</p>
            <button onClick={() => setModalData({ show: false, title: "", message: "" })} className="bg-rmc-green text-white px-6 py-2 rounded-full font-semibold hover:bg-rmc-dark-green transition w-full">OK</button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rmc-black mb-2">Contact Us</h2>
          <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
          <p className="mt-4 text-gray-600">Get in touch with the Rwanda Muslim Community.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-rmc-dark-green mb-4 border-l-4 border-rmc-green pl-3">Near Masjids</h3>
            <div className="relative w-full h-80 bg-gray-200 rounded-xl overflow-hidden shadow-inner mb-8">
              {mapLoading && (<div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10"><div className="mb-2 w-8 h-8 border-4 border-rmc-green border-t-transparent rounded-full animate-spin"></div><p className="text-sm font-semibold text-rmc-dark-green mt-2">Finding nearest Masjids...</p></div>)}
              <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Masjid Map"></iframe>
              <button onClick={findNearestMasjids} className="absolute bottom-4 right-4 bg-rmc-green text-white px-4 py-2 rounded-full shadow-lg hover:bg-rmc-dark-green transition font-bold text-sm z-20 flex items-center"><i className="fas fa-location-arrow mr-2"></i> Near Me</button>
            </div>
            <h3 className="text-2xl font-bold text-rmc-dark-green mb-4 border-l-4 border-rmc-blue pl-3">Our Social Media</h3>
            <div className="flex flex-col space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <a href="https://x.com/islamrwanda" target="_blank" rel="noreferrer" className="flex items-center text-gray-700 hover:text-blue-400 transition text-lg font-medium"><div className="w-10 h-10 bg-white shadow flex items-center justify-center rounded-full mr-4 text-xl"><i className="fab fa-twitter"></i></div>@islamrwanda</a>
              <a href="https://www.instagram.com/islamrwandaofficial/" target="_blank" rel="noreferrer" className="flex items-center text-gray-700 hover:text-pink-600 transition text-lg font-medium"><div className="w-10 h-10 bg-white shadow flex items-center justify-center rounded-full mr-4 text-xl"><i className="fab fa-instagram"></i></div>@islamrwandaofficial</a>
              <a href="https://www.facebook.com/RMC.Islamrwanda/" target="_blank" rel="noreferrer" className="flex items-center text-gray-700 hover:text-blue-600 transition text-lg font-medium"><div className="w-10 h-10 bg-white shadow flex items-center justify-center rounded-full mr-4 text-xl"><i className="fab fa-facebook-f"></i></div>RMC.Islamrwanda</a>
            </div>
          </div>
          <div>
            <div className="bg-rmc-dark-green rounded-t-xl shadow-lg p-1 text-center"><div className="w-full py-4 text-white font-bold text-xl flex justify-center items-center"><i className="fas fa-envelope mr-3"></i> Mail Us</div></div>
            <div className="bg-white shadow-xl rounded-b-xl border border-gray-200 border-t-0">
              <div className="p-6 pt-8">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label><input type="text" name="fname" value={formData.fname} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rmc-green focus:outline-none transition" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label><input type="text" name="lname" value={formData.lname} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rmc-green focus:outline-none transition" /></div>
                </div>
                <div className="mb-4"><label className="block text-sm font-semibold text-gray-700 mb-1">Your Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@gmail.com" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rmc-green focus:outline-none transition" /></div>
                <div className="mb-6"><label className="block text-sm font-semibold text-gray-700 mb-1">Your Issue/Comment</label><textarea rows="4" name="message" value={formData.message} onChange={handleInputChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rmc-green focus:outline-none transition resize-none"></textarea></div>
                <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-6">
                  <button type="button" onClick={sendViaWhatsApp} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center shadow"><i className="fab fa-whatsapp text-xl mr-2"></i> Send Via WhatsApp</button>
                  <button type="button" onClick={sendViaEmail} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center shadow"><i className="fas fa-paper-plane text-xl mr-2"></i> Send Via Email</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
