import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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

const SocialEmbedCard = memo(({ embedCode }) => {
  const cardRef = useRef(null);

  // Memoize the cleaning to prevent irrelevant prop changes
  const cleanCode = useMemo(() => {
    return embedCode.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
  }, [embedCode]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let attempts = 0;
    const max = 10;

    const init = () => {
      let success = false;
      
      // Check if we already have an iframe (don't re-trigger)
      if (el.querySelector('iframe')) return;

      if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(el);
        success = true;
      }
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process(el);
        success = true;
      }
      if (window.FB && window.FB.XFBML) {
        window.FB.XFBML.parse(el);
        success = true;
      }

      attempts++;
      if (!success && attempts < max) {
        setTimeout(init, 1000);
      }
    };

    init();
  }, [cleanCode]);

  return (
    <div 
      ref={cardRef} 
      className="social-card flex-shrink-0 snap-start w-[340px] sm:w-[400px] md:w-[450px] bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
      dangerouslySetInnerHTML={{ __html: cleanCode }}
    />
  );
});

const getYouTubeIframe = (url) => {
  if (!url) return "";
  let videoId = "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  }
  if (!videoId) return "";
  return `<iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}" title="YouTube Center Card" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
};

const Home = ({ t, lang }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [socials, setSocials] = useState({ xEmbed: "", youtubeLink: "", facebookEmbed: "" });
  const [partners, setPartners] = useState([]);
  const [stats, setStats] = useState([]);
  const [socialSlideIndex, setSocialSlideIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSocial = () => setSocialSlideIndex(p => Math.min(p + 1, 2));
  const prevSocial = () => setSocialSlideIndex(p => Math.max(p - 1, 0));

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [newsSnap, statsSnap, partnersSnap, socialsSnap] = await Promise.all([
          getDocs(collection(db, "news")),
          getDocs(collection(db, "statistics")),
          getDocs(collection(db, "partners")),
          getDoc(doc(db, "socials", "accounts"))
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

        if (partnersSnap) {
          setPartners(partnersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
        if (socialsSnap.exists()) {
          setSocials(socialsSnap.data());
        }

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

  const youtubeFrame = useMemo(() => getYouTubeIframe(socials.youtubeLink), [socials.youtubeLink]);

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

      {/* Our Partners Section */}
      {partners.length > 0 && (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-rmc-black mb-2">{t("Our Partners") || "Our Partners"}</h2>
            <div className="w-24 h-1 bg-rmc-blue mx-auto rounded"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-80 mix-blend-multiply">
            {partners.map(p => (
              <img key={p.id} src={p.logoLink} alt={p.name} title={p.sector} className="h-16 md:h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110" />
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Social Posts Section — Strict Block Carousel */}
      <div className="bg-gray-100 py-16 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-rmc-black mb-2"><i className="fas fa-share-alt text-rmc-green mr-2"></i>{t("Latest from Social Accounts") || "Latest from Social Accounts"}</h2>
            <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
          </div>

          <div className="relative mx-auto max-w-[340px] sm:max-w-[400px] md:max-w-none">
            {/* Left/Right controls (Mobile Only) */}
            <div className="md:hidden">
              {socialSlideIndex > 0 && (
                <button
                  onClick={prevSocial}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-rmc-dark-green transition-all"
                  aria-label="Previous card"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}
              {socialSlideIndex < 2 && (
                <button
                  onClick={nextSocial}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 bg-white/90 shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-rmc-dark-green transition-all"
                  aria-label="Next card"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </div>

            {/* Slider Container properly clipped on mobile, flexed evenly on desktop */}
            <div className="overflow-hidden md:overflow-visible mx-auto w-full">
              <div 
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{ transform: windowWidth < 768 ? `translateX(calc(-${socialSlideIndex * 100}% - ${socialSlideIndex * 1.5}rem))` : 'none' }}
              >
                {/* 1. X Card */}
                <div className="w-full flex-shrink-0 md:flex-1 md:w-auto flex justify-center">
                   {socials.xEmbed ? <SocialEmbedCard embedCode={socials.xEmbed} className="w-full bg-white rounded-xl shadow-md border border-gray-200" /> : <div className="w-full bg-white rounded-xl shadow-md p-8 text-center text-gray-400">X Post Not Available</div>}
                </div>
                {/* 2. YouTube Card */}
                <div className="w-full flex-shrink-0 md:flex-1 md:w-auto flex justify-center">
                   {youtubeFrame ? <SocialEmbedCard embedCode={youtubeFrame} className="w-full bg-white rounded-xl shadow-md border border-gray-200" /> : <div className="w-full bg-white rounded-xl shadow-md p-8 text-center text-gray-400">YouTube Not Available</div>}
                </div>
                {/* 3. Facebook Card */}
                <div className="w-full flex-shrink-0 md:flex-1 md:w-auto flex justify-center">
                   {socials.facebookEmbed ? <SocialEmbedCard embedCode={socials.facebookEmbed} className="w-full bg-white rounded-xl shadow-md border border-gray-200" /> : <div className="w-full bg-white rounded-xl shadow-md p-8 text-center text-gray-400">Facebook Not Available</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
