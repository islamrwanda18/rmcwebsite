import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const News = ({ t }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "news"));
        setItems(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const upcomingEvents = items.filter(i => i.type === "event" && i.date && new Date(i.date) >= new Date());
  const pastEvents = items.filter(i => i.type === "event" && i.date && new Date(i.date) < new Date());
  const newsEntries = items.filter(i => i.type === "news");

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><i className="fas fa-spinner fa-spin text-4xl text-rmc-green"></i></div>;

  return (
    <div className="bg-white py-16 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="flex justify-between items-end mb-12 border-b pb-4">
          <div>
            <h2 className="text-4xl font-bold text-rmc-black mb-2">{t("head_news")}</h2>
            <div className="w-24 h-1 bg-rmc-green rounded"></div>
            <p className="text-gray-500 mt-2">{t("news_subtitle")}</p>
          </div>
        </div>

        {/* Upcoming Events */}
        <h3 className="text-2xl font-bold text-rmc-dark-green mb-6 border-l-4 border-rmc-dark-green pl-3">{t("upcoming_events")}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {upcomingEvents.length === 0 ? (
            <div className="col-span-full text-gray-400">{t("no_upcoming_events")}</div>
          ) : upcomingEvents.map(event => (
            <div key={event.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
              <div>
                <span className="bg-rmc-blue text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">{t("tag_event")}</span>
                <h4 className="font-bold text-lg text-gray-900 mb-1">{event.title}</h4>
                <p className="text-sm text-gray-500 mb-3"><i className="fas fa-calendar mr-1"></i> {event.date}</p>
                <p className="text-gray-600 text-sm mb-4">{event.desc}</p>
              </div>
              {event.imageLink && (
                <div className="mt-auto pt-4">
                  <img src={event.imageLink} alt="Thumb" className="h-32 w-full object-cover rounded" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* News & Communications */}
        <h3 className="text-2xl font-bold text-rmc-dark-green mb-6 border-l-4 border-rmc-green pl-3" dangerouslySetInnerHTML={{ __html: t("news_communications") }}></h3>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {newsEntries.length === 0 ? (
            <div className="col-span-full text-gray-400">{t("no_recent_news")}</div>
          ) : newsEntries.map(news => (
            <div key={news.id} className="flex gap-4 items-start">
              <img src={news.imageLink || "https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg"} alt="News Image" className="w-24 h-24 rounded-lg object-cover bg-gray-100 border border-gray-200 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-rmc-green">{t("tag_statement")}</span>
                <h4 className="font-bold text-lg text-gray-900 mt-1">{news.title}</h4>
                <p className="text-gray-500 text-xs mb-1">{news.date}</p>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{news.desc}</p>
                {news.driveLink && (
                  <a href={news.driveLink} target="_blank" rel="noreferrer" className="text-rmc-blue text-xs font-bold hover:underline mt-2 inline-block">{t("read_full_pdf")} &rarr;</a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Past Events */}
        <h3 className="text-2xl font-bold text-gray-500 mb-6 border-l-4 border-gray-400 pl-3">{t("past_events")}</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {pastEvents.length === 0 ? (
            <div className="col-span-full text-gray-400">{t("no_past_events")}</div>
          ) : pastEvents.map(event => (
            <div key={event.id} className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              {event.imageLink && <img src={event.imageLink} alt="Past Event" className="w-full h-32 object-cover" />}
              <div className="p-4">
                <span className="bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">{t("tag_past_event")}</span>
                <h4 className="font-bold text-gray-800">{event.title}</h4>
                <p className="text-xs text-gray-500 font-bold mb-1">{event.date}</p>
                <p className="text-xs text-gray-500 mt-1">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
