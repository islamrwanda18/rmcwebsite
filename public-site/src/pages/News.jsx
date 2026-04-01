const News = ({ t }) => {
  return (
    <div className="bg-white py-16 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="flex justify-between items-end mb-12 border-b pb-4">
          <div>
            <h2 className="text-4xl font-bold text-rmc-black mb-2" dangerouslySetInnerHTML={{ __html: t("head_news") }}></h2>
            <div className="w-24 h-1 bg-rmc-green rounded"></div>
            <p className="text-gray-500 mt-2">Latest happenings, upcoming gatherings, and official news.</p>
          </div>
        </div>

        {/* Upcoming Events */}
        <h3 className="text-2xl font-bold text-rmc-dark-green mb-6 border-l-4 border-rmc-dark-green pl-3">Upcoming Events</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="bg-rmc-blue text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Event</span>
            <h4 className="font-bold text-lg text-gray-900 mb-1">Eid Al'adha</h4>
            <p className="text-sm text-gray-500 mb-3"><i className="fas fa-calendar mr-1"></i> June 15, 2026</p>
            <p className="text-gray-600 text-sm">Eid celebrations at the regional stadium.</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
            <span className="bg-rmc-blue text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Seminar</span>
            <h4 className="font-bold text-lg text-gray-900 mb-1">Annual Dawah Seminar</h4>
            <p className="text-sm text-gray-500 mb-3"><i className="fas fa-calendar mr-1"></i> July 2, 2026</p>
            <p className="text-gray-600 text-sm">A seminar for youth leaders regarding modern Dawah strategies.</p>
          </div>
        </div>

        {/* News & Communications */}
        <h3 className="text-2xl font-bold text-rmc-dark-green mb-6 border-l-4 border-rmc-green pl-3">News & Communications</h3>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="flex gap-4 items-start">
            <img src="https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg" alt="News Image" className="w-24 h-24 rounded-lg object-cover bg-gray-100 border border-gray-200" />
            <div>
              <span className="text-xs font-bold text-rmc-green">Press Release</span>
              <h4 className="font-bold text-lg text-gray-900 mt-1">Official statement on Ramadan moon sighting</h4>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">The office of the Mufti has released the official guidelines for the upcoming holy month...</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <img src="https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg" alt="News Image" className="w-24 h-24 rounded-lg object-cover bg-gray-100 border border-gray-200" />
            <div>
              <span className="text-xs font-bold text-rmc-green">Community News</span>
              <h4 className="font-bold text-lg text-gray-900 mt-1">New scholarships awarded to 50 students</h4>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2">In partnership with external universities, the RMC has officially distributed...</p>
            </div>
          </div>
        </div>

        {/* Past Events */}
        <h3 className="text-2xl font-bold text-gray-500 mb-6 border-l-4 border-gray-400 pl-3">Past Events</h3>
        <div className="grid md:grid-cols-3 gap-6 opacity-80">
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <img src="https://i.postimg.cc/Y2L18bht/MUSABAQAT_1.jpg" alt="Past Event" className="w-full h-32 object-cover grayscale transition hover:grayscale-0" />
            <div className="p-4">
              <h4 className="font-bold text-gray-800">Qur'an Recitation Competition 2025</h4>
              <p className="text-xs text-gray-500 mt-1">Concluded successfully with 12 international participants.</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <img src="https://i.postimg.cc/qqg0XNk7/EID_2024.jpg" alt="Past Event" className="w-full h-32 object-cover grayscale transition hover:grayscale-0" />
            <div className="p-4">
              <h4 className="font-bold text-gray-800">Eid 2024 Celebrations</h4>
              <p className="text-xs text-gray-500 mt-1">A look back at the beautiful mass gathering at the stadium.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
