import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Home = ({ t }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [xposts, setXposts] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const socialScrollRef = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [newsSnap, xpostsSnap] = await Promise.all([
          getDocs(collection(db, "news")),
          getDocs(collection(db, "xposts"))
        ]);

        const newsList = newsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const events = newsList.filter(n => n.type === "event" && new Date(n.date) >= new Date())
                               .sort((a,b) => new Date(a.date) - new Date(b.date));
                               
        // Setup Carousel with top 3 newest entries (news or event)
        const recentCarousel = [...newsList]
            .sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
            .slice(0, 3)
            .map((n, i) => {
               const isEvent = n.type === "event";
               const isPast = isEvent && n.date && new Date(n.date) < new Date();
               let tagDefault = "Recent News";
               if (isEvent) tagDefault = isPast ? "Past Event" : "Upcoming Event";
               return {
                 img: n.imageLink || "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg",
                 tagDefault,
                 colorTag: isPast ? "bg-gray-500" : i === 0 ? "bg-rmc-blue" : i === 1 ? "bg-rmc-dark-green" : "bg-rmc-green",
                 title: n.title,
                 desc: n.desc
               };
            });
            
        // Fallback slides if none found
        if (recentCarousel.length === 0) {
           recentCarousel.push({
             img: "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg",
             tagDefault: "Latest Update",
             colorTag: "bg-rmc-blue",
             title: "Welcome to RMC",
             desc: "The Rwanda Muslim Community official portal."
           });
        }
        
        setSlides(recentCarousel);
        setUpcoming(events.slice(0, 3));

        const activePosts = xpostsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
                               .filter(x => x.status === "on")
                               .sort((a,b) => b.createdAt - a.createdAt)
                               .slice(0, 3);
        setXposts(activePosts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHomeData();
  }, []);

  // Reload Twitter widgets when xposts change so embedded images render
  useEffect(() => {
    if (xposts.length > 0 && window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [xposts]);

  // Social carousel scroll helpers
  const updateScrollButtons = useCallback(() => {
    const el = socialScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = socialScrollRef.current;
    if (!el) return;
    // Initial check after a slight delay for content to render
    const timer = setTimeout(updateScrollButtons, 500);
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [xposts, updateScrollButtons]);

  const scrollSocial = (direction) => {
    const el = socialScrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    if (slides.length <= 1) return;
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
                {upcoming.length === 0 ? (
                  <p className="text-gray-500 text-sm">No upcoming events scheduled.</p>
                ) : upcoming.map(event => (
                  <div key={event.id} className="border-b border-gray-200 pb-4">
                    <p className="text-xs text-rmc-blue font-bold mb-1">{event.date}</p>
                    <h4 className="font-bold text-gray-800 leading-tight">{event.title}</h4>
                  </div>
                ))}
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

      {/* Social Posts Section — Horizontal Carousel */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-rmc-black mb-2"><i className="fas fa-share-alt text-rmc-green mr-2"></i>Latest from Social Accounts</h2>
            <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
            <p className="text-gray-500 mt-2 text-sm">Stay connected with our real-time updates.</p>
          </div>

          {xposts.length === 0 ? (
            <p className="text-gray-400 text-center">No active posts available.</p>
          ) : (
            <div className="relative">
              {/* Left Arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollSocial("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-rmc-dark-green transition-all hover:scale-110 -ml-2 md:-ml-4"
                  aria-label="Scroll left"
                >
                  <i className="fas fa-chevron-left text-lg"></i>
                </button>
              )}

              {/* Scrollable container */}
              <div
                ref={socialScrollRef}
                className="social-scroll-container flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {xposts.map(post => (
                  <div
                    key={post.id}
                    className="social-card flex-shrink-0 snap-start w-[340px] sm:w-[400px] md:w-[450px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                    dangerouslySetInnerHTML={{ __html: post.embedCode }}
                  />
                ))}
              </div>

              {/* Right Arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scrollSocial("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-rmc-dark-green transition-all hover:scale-110 -mr-2 md:-mr-4"
                  aria-label="Scroll right"
                >
                  <i className="fas fa-chevron-right text-lg"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
