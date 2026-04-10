import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const About = ({ t }) => {
  const [openAccordion, setOpenAccordion] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState([]);
  const [partners, setPartners] = useState([]);
  const [globals, setGlobals] = useState({ mission: "", vision: "", history: "" });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [boardSnap, partnersSnap, globalsSnap] = await Promise.all([
          getDocs(collection(db, "board")),
          getDocs(collection(db, "partners")),
          getDoc(doc(db, "globals", "content"))
        ]);

        setBoard(boardSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setPartners(partnersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        if (globalsSnap.exists()) {
          setGlobals(globalsSnap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="bg-gray-50 py-16 min-h-screen fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rmc-black mb-2">{t("head_about")}</h2>
          <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
          <p className="mt-4 text-gray-600">{t("about_subtitle")}</p>
        </div>

        <div className="space-y-4">
          {/* Accordion 1: Mission and Vision */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50" onClick={() => toggleAccordion('acc-mission')}>
              <span className="font-bold text-xl text-rmc-dark-green">{t("mission_vision")}</span>
              <i className={`fas ${openAccordion === 'acc-mission' ? 'fa-minus' : 'fa-plus'} text-gray-400`}></i>
            </button>
            <div className="accordion-content bg-white" style={{ maxHeight: openAccordion === 'acc-mission' ? "500px" : "0px" }}>
              <div className="px-6 pb-5 pt-4 text-gray-600 border-t border-gray-100 flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">{t("our_mission")}</h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{globals.mission}</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">{t("our_vision")}</h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{globals.vision}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion 2: Our History */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50" onClick={() => toggleAccordion('acc-history')}>
              <span className="font-bold text-xl text-rmc-dark-green">{t("our_history")}</span>
              <i className={`fas ${openAccordion === 'acc-history' ? 'fa-minus' : 'fa-plus'} text-gray-400`}></i>
            </button>
            <div className="accordion-content bg-white" style={{ maxHeight: openAccordion === 'acc-history' ? "500px" : "0px" }}>
              <div className="px-6 pb-5 pt-4 text-gray-600 border-t border-gray-100">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{globals.history}</p>
              </div>
            </div>
          </div>

          {/* Accordion 3: Board Members */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50" onClick={() => toggleAccordion('acc-board')}>
              <span className="font-bold text-xl text-rmc-dark-green">{t("board_members")}</span>
              <i className={`fas ${openAccordion === 'acc-board' ? 'fa-minus' : 'fa-plus'} text-gray-400`}></i>
            </button>
            <div className="accordion-content bg-white" style={{ maxHeight: openAccordion === 'acc-board' ? "500px" : "0px" }}>
              <div className="px-6 pb-5 pt-4 text-gray-600 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {board.map(member => (
                    <div key={member.id} className="flex items-center space-x-4">
                      <img src={member.imageLink || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={member.name} className="w-16 h-16 rounded-full border border-gray-200 object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900">{member.name}</h4>
                        <p className={`text-xs font-bold ${(member.role || '').toLowerCase().includes('mufti') ? 'text-rmc-green' : 'text-gray-500'}`}>{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accordion 4: Partners */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50" onClick={() => toggleAccordion('acc-partners')}>
              <span className="font-bold text-xl text-rmc-dark-green">{t("partners")}</span>
              <i className={`fas ${openAccordion === 'acc-partners' ? 'fa-minus' : 'fa-plus'} text-gray-400`}></i>
            </button>
            <div className="accordion-content bg-white" style={{ maxHeight: openAccordion === 'acc-partners' ? "500px" : "0px" }}>
              <div className="px-6 pb-5 pt-4 text-gray-600 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {partners.map(partner => {
                    const PartnerItem = (
                      <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer h-full">
                        <img src={partner.logoLink || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt={partner.name} className="w-16 h-16 object-contain bg-white rounded p-1 shadow-sm" />
                        <div>
                          <h4 className="font-bold text-gray-900">{partner.name}</h4>
                          <p className="text-xs text-rmc-blue font-bold">{partner.sector}</p>
                        </div>
                      </div>
                    );
                    
                    return partner.websiteLink ? (
                      <a key={partner.id} href={partner.websiteLink} target="_blank" rel="noopener noreferrer" className="block">
                        {PartnerItem}
                      </a>
                    ) : (
                      <div key={partner.id}>{PartnerItem}</div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
