import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = ({ t }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      img: "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg",
      tagKey: "tag_latest_event",
      tagDefault: "Latest Event",
      colorTag: "bg-rmc-blue",
      title: "Meeting the President",
      desc: "A historic gathering demonstrating the strong unity and collaboration between the Rwanda Muslim Community and national leadership."
    },
    {
      img: "https://i.postimg.cc/Y2L18bht/MUSABAQAT_1.jpg",
      tagKey: "tag_recent_program",
      tagDefault: "Recent Program",
      colorTag: "bg-rmc-dark-green",
      title: "International Qur'an Recitation",
      desc: "Hosting talented reciters from across the globe in Kigali, promoting spiritual literacy and peaceful understanding."
    },
    {
      img: "https://i.postimg.cc/qqg0XNk7/EID_2024.jpg",
      tagKey: "tag_upcoming_event",
      tagDefault: "Upcoming Event",
      colorTag: "bg-rmc-green",
      title: "Eid Al-Fitr Preparations",
      desc: "Join thousands of Muslims at the regional stadium to perform Eid prayers, reflecting the growth and unity of the community."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="pb-12 fade-in">
      {/* Hero Carousel */}
      <div className="relative w-full max-w-7xl mx-auto mt-4 px-4 sm:px-6 lg:px-8">
        <div className="carousel-container shadow-2xl">
          {slides.map((slide, idx) => {
            let className = "carousel-slide";
            if (idx === currentSlide) {
              className += " active";
            } else if (idx === (currentSlide - 1 + slides.length) % slides.length) {
              className += " slide-out";
            } else {
              className += " no-transition";
            }

            return (
              <div 
                key={idx} 
                className={className} 
                style={{ backgroundImage: `url('${slide.img}')` }}
              >
                <div className="carousel-content">
                  <span className={`${slide.colorTag} text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide mb-2 inline-block`} dangerouslySetInnerHTML={{ __html: t(slide.tagKey) || slide.tagDefault }}></span>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2">{slide.title}</h3>
                  <p className="text-gray-200 md:text-lg">{slide.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brief About Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center slide-up">
          <h2 className="text-2xl font-bold text-rmc-dark-green mb-4" dangerouslySetInnerHTML={{ __html: t("head_who_we_are") }}></h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            The <strong>Rwanda Muslim Community (RMC)</strong> is the apex body representing the Islamic faith and interests in Rwanda. 
            Headquartered in Kigali and operating under the leadership of the Mufti of Rwanda, we are dedicated to spiritual guidance, educational advancement, and the socio-economic development of all Rwandans.
          </p>
        </div>
      </div>

      {/* Areas of Intervention */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rmc-black mb-2" dangerouslySetInnerHTML={{ __html: t("head_areas") }}></h2>
            <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:-translate-y-1 transition transform border-t-4 border-rmc-blue">
              <div className="w-16 h-16 bg-blue-50 text-rmc-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-book-open"></i></div>
              <h3 className="font-bold text-lg mb-2">Dawah</h3>
              <p className="text-gray-500 text-sm">Spreading the true teachings of Islam through peaceful outreach and guidance.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:-translate-y-1 transition transform border-t-4 border-rmc-green">
              <div className="w-16 h-16 bg-green-50 text-rmc-green rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-hands-helping"></i></div>
              <h3 className="font-bold text-lg mb-2">Socio Development</h3>
              <p className="text-gray-500 text-sm">Empowering communities through health, poverty alleviation, and welfare initiatives.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:-translate-y-1 transition transform border-t-4 border-yellow-500">
              <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-graduation-cap"></i></div>
              <h3 className="font-bold text-lg mb-2">Education</h3>
              <p className="text-gray-500 text-sm">Providing quality secular and Islamic education to the youth across the nation.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:-translate-y-1 transition transform border-t-4 border-rmc-black">
              <div className="w-16 h-16 bg-gray-100 text-rmc-black rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-globe-africa"></i></div>
              <h3 className="font-bold text-lg mb-2">Foreign Affairs</h3>
              <p className="text-gray-500 text-sm">Building and maintaining strong international relations and partnerships.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities and Events */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rmc-black mb-2" dangerouslySetInnerHTML={{ __html: t("head_activities") }}></h2>
            <div className="w-24 h-1 bg-rmc-blue mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 relative rounded-xl overflow-hidden shadow-lg group">
              <img src="https://i.postimg.cc/9XwG1JrT/gathering_1.jpg" alt="Recent Event" className="w-full h-80 object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
                <span className="bg-rmc-green text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide w-max mb-2">Recent Event</span>
                <h3 className="text-2xl font-bold text-white mb-2">National Unity Conference with President</h3>
                <p className="text-gray-300 text-sm">A major gathering with President focused on community development and interfaith dialogue held recently in Kigali.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-rmc-dark-green"><i className="fas fa-calendar-alt mr-2"></i>Upcoming</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-xs text-rmc-blue font-bold mb-1">May 25, 2026</p>
                  <h4 className="font-bold text-gray-800 leading-tight">Eid Al'adha</h4>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-xs text-rmc-blue font-bold mb-1">July 2, 2026</p>
                  <h4 className="font-bold text-gray-800 leading-tight">Annual Dawah Seminar</h4>
                </div>
                <div>
                  <p className="text-xs text-rmc-blue font-bold mb-1">August 10, 2026</p>
                  <h4 className="font-bold text-gray-800 leading-tight">Islamic Education Fundraiser</h4>
                </div>
              </div>
              <Link to="/news" className="mt-4 block w-full text-center text-sm font-bold text-rmc-green hover:underline">View All Events &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative bg-rmc-dark-green py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://i.postimg.cc/7hbDM5xH/EID_2025.jpg')" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 slide-up text-center text-white">
          <h2 className="text-3xl font-bold mb-12">RMC in Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-400/30">
            <div className="p-4">
              <div className="text-5xl font-bold mb-2 tabular-nums">500,000+</div>
              <div className="text-rmc-green-100 text-lg uppercase tracking-wide">Muslims in Rwanda</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold mb-2 tabular-nums">50+</div>
              <div className="text-rmc-green-100 text-lg uppercase tracking-wide">Islamic Schools</div>
            </div>
            <div className="p-4">
              <div className="text-5xl font-bold mb-2 tabular-nums">500+</div>
              <div className="text-rmc-green-100 text-lg uppercase tracking-wide">Masjids</div>
            </div>
          </div>
        </div>
      </div>

      {/* X Post Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-rmc-black mb-2"><i className="fab fa-twitter text-blue-400 mr-2"></i>Latest from X</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto rounded"></div>
            <p className="text-gray-500 mt-2 text-sm">Stay connected with our real-time updates.</p>
          </div>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full max-w-[550px]">
              <blockquote className="twitter-tweet"><p lang="in" dir="ltr">Kuri iki Cyumweru, Nyakubahwa Mufti w’u Rwanda Sheikh Sindayigaya Musa yakiriye mu biro bye Visi Perezida ushinzwe amasomo muri Africa School of Governance Prof. Amany El-Sharif hamwe n’abari bamuherekeje.<br/>Ibiganiro ku mpande zombi bikaba byibanze kugusangira amahirwe ku mpande… <a href="https://t.co/AkvWqFnlMN">pic.twitter.com/AkvWqFnlMN</a></p>&mdash; Rwanda Muslim Community (@islamrwanda) <a href="https://twitter.com/islamrwanda/status/2038375707600908754?ref_src=twsrc%5Etfw">March 29, 2026</a></blockquote>
            </div>
            <div className="w-full max-w-[550px]">
              <blockquote className="twitter-tweet"><p lang="en" dir="ltr">On this Sunday, the Mufti of Rwanda, Sheikh Sindayigaya Musa, received in his office Prof. Amany El-Sharif, Vice-President for Academic Affairs at the Africa School of Governance, together with his delegation.<br/>Their discussions focused on exploring opportunities in education and… <a href="https://t.co/rGDMh7XfMy">pic.twitter.com/rGDMh7XfMy</a></p>&mdash; Rwanda Muslim Community (@islamrwanda) <a href="https://twitter.com/islamrwanda/status/2038374714222227693?ref_src=twsrc%5Etfw">March 29, 2026</a></blockquote>
            </div>
            <div className="w-full max-w-[550px]">
              <blockquote className="twitter-tweet"><p lang="en" dir="ltr">The Rwanda Muslim Community (<a href="https://twitter.com/hashtag/RMC?src=hash&amp;ref_src=twsrc%5Etfw">#RMC</a>) extends its profound gratitude to His Excellency, the President of the Republic of Rwanda, <a href="https://twitter.com/PaulKagame?ref_src=twsrc%5Etfw">@PaulKagame</a>, for the time He graciously devoted to celebrating Eid Al-Fitr with the Muslim community in Rwanda. The Community further expresses its… <a href="https://t.co/vWc83iBPV5">pic.twitter.com/vWc83iBPV5</a></p>&mdash; Rwanda Muslim Community (@islamrwanda) <a href="https://twitter.com/islamrwanda/status/2036926813079801859?ref_src=twsrc%5Etfw">March 25, 2026</a></blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
