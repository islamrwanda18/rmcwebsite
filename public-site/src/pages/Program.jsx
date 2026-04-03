import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Program = ({ t }) => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "programs"));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrograms(list);
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-gray-50"><i className="fas fa-spinner fa-spin text-4xl text-rmc-blue"></i></div>;
  }

  return (
    <div className="bg-gray-50 py-16 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rmc-black mb-2">{t("head_program")}</h2>
          <div className="w-24 h-1 bg-rmc-blue mx-auto rounded"></div>
          <p className="mt-4 text-gray-600">{t("program_subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <a key={program.id || index} href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-xl transition group flex flex-col h-full">
              {program.imageLink && program.imageLink !== 'https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg' ? (
                 <div className="h-40 w-full overflow-hidden">
                    <img src={program.imageLink} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                 </div>
              ) : null}
              <div className="p-8 text-center flex-1 flex flex-col">
                {(!program.imageLink || program.imageLink === 'https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg') && (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition" style={{ background: program.thumbStyle || '#eff6ff', color: program.thumbTextColor || '#1e40af' }}><i className={`fas ${program.icon || 'fa-info-circle'}`}></i></div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-500 mb-6 flex-1">{program.desc}</p>
                <span className="inline-block bg-rmc-blue text-white px-6 py-2 rounded-full font-bold text-sm group-hover:bg-blue-800 transition mx-auto mt-auto">{t("details_btn")}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Program;
