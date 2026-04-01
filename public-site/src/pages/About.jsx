import { useState } from "react";

const About = ({ t }) => {
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="bg-gray-50 py-16 min-h-screen fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rmc-black mb-2" dangerouslySetInnerHTML={{ __html: t("head_about") }}></h2>
          <div className="w-24 h-1 bg-rmc-green mx-auto rounded"></div>
          <p className="mt-4 text-gray-600">Learn about our foundation, leadership, and vision.</p>
        </div>

        <div className="space-y-4">
          {/* Accordion 1: Mission and Vision */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50" onClick={() => toggleAccordion('acc-mission')}>
              <span className="font-bold text-xl text-rmc-dark-green">Mission and Vision</span>
              <i className={`fas ${openAccordion === 'acc-mission' ? 'fa-minus' : 'fa-plus'} text-gray-400`}></i>
            </button>
            <div className="accordion-content bg-white" style={{ maxHeight: openAccordion === 'acc-mission' ? "500px" : "0px" }}>
              <div className="px-6 pb-5 pt-2 text-gray-600 border-t border-gray-100 prose">
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Spiritual Guidance:</strong> Providing a "path and guidance" for the inhabitants of the world through the teachings of the Quran.</li>
                  <li><strong>Educational Advancement:</strong> Collaborating with international partners like the Africa Development and Education Foundation (ADEF) to improve religious literacy.</li>
                  <li><strong>Community Support:</strong> Offering religious resources, such as the translated Quran, free of charge to the public.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Accordion 2: Our History */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50" onClick={() => toggleAccordion('acc-history')}>
              <span className="font-bold text-xl text-rmc-dark-green">Our History</span>
              <i className={`fas ${openAccordion === 'acc-history' ? 'fa-minus' : 'fa-plus'} text-gray-400`}></i>
            </button>
            <div className="accordion-content bg-white" style={{ maxHeight: openAccordion === 'acc-history' ? "500px" : "0px" }}>
              <div className="px-6 pb-5 pt-2 text-gray-600 border-t border-gray-100 prose">
                <p>The <strong>Rwanda Muslim Community (RMC)</strong>, formerly known as the Association des Musulmans au Rwanda (AMUR), is the apex body representing the Islamic faith and interests in Rwanda. Historically a marginalized group, the community has seen a significant shift in its social and political standing in the decades following the 1994 Genocide against the Tutsi.</p>
                <br/>
                <p>A significant part of its modern history involves the effort to make sacred texts accessible to the Rwandan people in their native language, Kinyarwanda. This journey reached a major milestone with the publication of the first translation of the Quran in 2011, refined in 2020 for higher accuracy.</p>
              </div>
            </div>
          </div>

          {/* Accordion 3: Board Members */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50" onClick={() => toggleAccordion('acc-board')}>
              <span className="font-bold text-xl text-rmc-dark-green">The Board Members</span>
              <i className={`fas ${openAccordion === 'acc-board' ? 'fa-minus' : 'fa-plus'} text-gray-400`}></i>
            </button>
            <div className="accordion-content bg-white" style={{ maxHeight: openAccordion === 'acc-board' ? "500px" : "0px" }}>
              <div className="px-6 pb-5 pt-4 text-gray-600 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <img src="https://i.postimg.cc/yxnB0F4N/mufti.jpg" alt="Mufti" className="w-16 h-16 rounded-full border-2 border-rmc-green object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900">Sheikh SINDAYIGAYA Mussa</h4>
                      <p className="text-xs text-rmc-green font-bold">Mufti of Rwanda</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <img src="https://i.postimg.cc/cLS2dvVf/yunus.jpg" alt="Deputy Mufti" className="w-16 h-16 rounded-full border-2 border-rmc-blue object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900">Sheikh MUSHUMBA Yunus</h4>
                      <p className="text-xs text-rmc-blue font-bold">Deputy Mufti</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <img src="https://i.postimg.cc/vZskG4pf/ALLY.jpg" alt="Ameer" className="w-16 h-16 rounded-full border border-gray-200 object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900">Sheikh BAKERA Ally</h4>
                      <p className="text-xs text-gray-500">Ameer, Foreign Affairs</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <img src="https://i.postimg.cc/sgrq3MtS/ISSA.jpg" alt="Ameer" className="w-16 h-16 rounded-full border border-gray-200 object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900">BICAHAGA Hamidu</h4>
                      <p className="text-xs text-gray-500">Ameer, Dev Planning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion 4: Partners */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50" onClick={() => toggleAccordion('acc-partners')}>
              <span className="font-bold text-xl text-rmc-dark-green">Partners</span>
              <i className={`fas ${openAccordion === 'acc-partners' ? 'fa-minus' : 'fa-plus'} text-gray-400`}></i>
            </button>
            <div className="accordion-content bg-white" style={{ maxHeight: openAccordion === 'acc-partners' ? "500px" : "0px" }}>
              <div className="px-6 pb-5 pt-2 text-gray-600 border-t border-gray-100 prose">
                <p>We work collaboratively with local and international partners to achieve our goals. Notable partners include:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>ADEF:</strong> Africa Development and Education Foundation, instrumental in the translation of the Holy Quran.</li>
                  <li><strong>National Institutions:</strong> Government ministries regarding health, education, and peace-building initiatives (Ndi Umunyarwanda).</li>
                  <li><strong>International Islamic Cultural Centers:</strong> Providing educational and infrastructural support.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
