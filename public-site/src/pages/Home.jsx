import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const StatCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  // Extract numeric part and suffix
  const match = value.match(/([\d,]+)(.*)/);
  const numericStr = match ? match[1].replace(/,/g, "") : "0";
  const suffix = match ? match[2] : "";
  const targetNumber = parseInt(numericStr, 10) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const duration = 2000; // Animation duration in ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smoother finish (easeOutQuad)
      const easedProgress = progress * (2 - progress);
      
      setCount(Math.floor(easedProgress * targetNumber));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, targetNumber]);

  return (
    <div ref={counterRef} className="text-5xl font-bold mb-2 tabular-nums">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const Home = ({ t, lang }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [xposts, setXposts] = useState([]);
  const [stats, setStats] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const socialScrollRef = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [newsSnap, xpostsSnap, statsSnap] = await Promise.all([
          getDocs(collection(db, "news")),
          getDocs(collection(db, "xposts")),
          getDocs(collection(db, "statistics"))
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
               let tagKey = "tag_recent_news";
               if (isEvent) tagKey = isPast ? "tag_past_event" : "tag_upcoming_event";
               return {
                 img: n.imageLink || "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg",
                 tagKey,
                 colorTag: isPast ? "bg-gray-500" : i === 0 ? "bg-rmc-blue" : i === 1 ? "bg-rmc-dark-green" : "bg-rmc-green",
                 title: n.title,
                 desc: n.desc
               };
            });
            
        // Fallback slides if none found
        if (recentCarousel.length === 0) {
           recentCarousel.push({
             img: "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg",
             tagKey: "tag_latest_update",
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
                               .slice(0, 6);
        setXposts(activePosts);

        const statsList = statsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (statsList.length > 0) {
          setStats(statsList.sort((a,b) => (a.order||0) - (b.order||0)));
        } else {
          // Hardcoded fallback
          setStats([
            { label: t("stat_muslims"), value: "500,000+" },
            { label: t("stat_schools"), value: "50+" },
            { label: t("stat_masjids"), value: "500+" }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchHomeData();
  }, []);

  // Robustly reload all social platform widgets when xposts change
  useEffect(() => {
    if (xposts.length === 0) return;
    
    let attempts = 0;
    const maxAttempts = 5;

    const tryInitWidgets = () => {
      let twitterFound = !!(window.twttr && window.twttr.widgets);
      let instaFound = !!(window.instgrm && window.instgrm.Embeds);
      let fbFound = !!(window.FB && window.FB.XFBML);

      if (twitterFound) window.twttr.widgets.load();
      if (instaFound) window.instgrm.Embeds.process();
      if (fbFound) window.FB.XFBML.parse();

      attempts++;
      // If any platform isn't ready, try again in 1s, up to maxAttempts
      if (attempts < maxAttempts && (!twitterFound || !instaFound || !fbFound)) {
        setTimeout(tryInitWidgets, 1000);
      }
    };

    // Initial check after a short delay
    const initialTimer = setTimeout(tryInitWidgets, 300);
    return () => clearTimeout(initialTimer);
  }, [xposts]);

  // Social carousel scroll helpers
  const updateScrollButtons = useCallback(() => {
    const el = socialScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = socialScrollRef.current;
    if (!el) return;
    const timer = setTimeout(updateScrollButtons, 800);
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
                  <span className={`${slide.colorTag} text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide mb-2 inline-block`}>{t(slide.tagKey)}</span>
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
          <h2 className="text-2xl font-bold text-rmc-dark-green mb-4">{t("head_who_we_are")}</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: t("home_about_text") }}></p>
        </div>
      </div>

      {/* Areas of Intervention */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rmc-black mb-2">{t("head_areas")}</h2>
            <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:-translate-y-1 transition transform border-t-4 border-rmc-blue">
              <div className="w-16 h-16 bg-blue-50 text-rmc-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-book-open"></i></div>
              <h3 className="font-bold text-lg mb-2">{t("area_dawah")}</h3>
              <p className="text-gray-500 text-sm">{t("area_dawah_desc")}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:-translate-y-1 transition transform border-t-4 border-rmc-green">
              <div className="w-16 h-16 bg-green-50 text-rmc-green rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-hands-helping"></i></div>
              <h3 className="font-bold text-lg mb-2">{t("area_socio")}</h3>
              <p className="text-gray-500 text-sm">{t("area_socio_desc")}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:-translate-y-1 transition transform border-t-4 border-yellow-500">
              <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-graduation-cap"></i></div>
              <h3 className="font-bold text-lg mb-2">{t("area_education")}</h3>
              <p className="text-gray-500 text-sm">{t("area_education_desc")}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:-translate-y-1 transition transform border-t-4 border-rmc-black">
              <div className="w-16 h-16 bg-gray-100 text-rmc-black rounded-full flex items-center justify-center text-2xl mx-auto mb-4"><i className="fas fa-globe-africa"></i></div>
              <h3 className="font-bold text-lg mb-2">{t("area_foreign")}</h3>
              <p className="text-gray-500 text-sm">{t("area_foreign_desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities and Events */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rmc-black mb-2">{t("head_activities")}</h2>
            <div className="w-24 h-1 bg-rmc-blue mx-auto rounded"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 relative rounded-xl overflow-hidden shadow-lg group">
              <img src="https://i.postimg.cc/9XwG1JrT/gathering_1.jpg" alt="Recent Event" className="w-full h-80 object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
                <span className="bg-rmc-green text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide w-max mb-2">{t("tag_recent_event")}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{t("activity_title")}</h3>
                <p className="text-gray-300 text-sm">{t("activity_desc")}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-rmc-dark-green"><i className="fas fa-calendar-alt mr-2"></i>{t("upcoming_label")}</h3>
              <div className="space-y-4">
                {upcoming.length === 0 ? (
                  <p className="text-gray-500 text-sm">{t("no_upcoming")}</p>
                ) : upcoming.map(event => (
                  <div key={event.id} className="border-b border-gray-200 pb-4">
                    <p className="text-xs text-rmc-blue font-bold mb-1">{event.date}</p>
                    <h4 className="font-bold text-gray-800 leading-tight">{event.title}</h4>
                  </div>
                ))}
              </div>
              <Link to="/news" className="mt-4 block w-full text-center text-sm font-bold text-rmc-green hover:underline">{t("view_all_events")} &rarr;</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative bg-rmc-dark-green py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url('https://i.postimg.cc/7hbDM5xH/EID_2025.jpg')" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 slide-up text-center text-white">
          <h2 className="text-3xl font-bold mb-12">{t("head_stats")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-400/30">
            {stats.map((s, idx) => (
              <div key={s.id || idx} className="p-4">
                <StatCounter value={s.value} />
                <div className="text-rmc-green-100 text-lg uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Posts Section — Horizontal Carousel */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-rmc-black mb-2"><i className="fas fa-share-alt text-rmc-green mr-2"></i>{t("head_social")}</h2>
            <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
            <p className="text-gray-500 mt-2 text-sm">{t("social_subtitle")}</p>
          </div>

          {xposts.length === 0 ? (
            <p className="text-gray-400 text-center">{t("no_posts")}</p>
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
