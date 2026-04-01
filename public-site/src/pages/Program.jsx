const Program = ({ t }) => {
  return (
    <div className="bg-gray-50 py-16 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 slide-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rmc-black mb-2" dangerouslySetInnerHTML={{ __html: t("head_program") }}></h2>
          <div className="w-24 h-1 bg-rmc-blue mx-auto rounded"></div>
          <p className="mt-4 text-gray-600">Explore opportunities for growth, learning, and spiritual journey.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-xl transition group">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 text-rmc-black rounded-full flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition"><i className="fas fa-kaaba"></i></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hijrah & Umrah</h3>
              <p className="text-gray-500 mb-6 line-clamp-3">Information and registration for annual Hajj delegations and Umrah travel arrangements facilitated by the community.</p>
              <span className="inline-block bg-rmc-black text-white px-6 py-2 rounded-full font-bold text-sm group-hover:bg-gray-800 transition">View Details</span>
            </div>
          </a>

          <a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-xl transition group">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-50 text-rmc-blue rounded-full flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition"><i className="fas fa-user-graduate"></i></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Scholarships</h3>
              <p className="text-gray-500 mb-6 line-clamp-3">Discover educational scholarships for domestic and international universities offered to outstanding Muslim students.</p>
              <span className="inline-block bg-rmc-blue text-white px-6 py-2 rounded-full font-bold text-sm group-hover:bg-blue-800 transition">Apply Now</span>
            </div>
          </a>

          <a href="https://rmc-brown.vercel.app/" target="_blank" rel="noreferrer" className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-xl transition group">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-50 text-rmc-green rounded-full flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition"><i className="fas fa-briefcase"></i></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Job Opportunities</h3>
              <p className="text-gray-500 mb-6 line-clamp-3">Browse current job openings within the Rwanda Muslim Community offices, institutions, and partner organizations.</p>
              <span className="inline-block bg-rmc-green text-white px-6 py-2 rounded-full font-bold text-sm group-hover:bg-rmc-dark-green transition">Find Jobs</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Program;
