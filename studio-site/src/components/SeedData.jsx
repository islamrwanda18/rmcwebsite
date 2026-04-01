import { useState } from "react";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function SeedData() {
  const [status, setStatus] = useState("");

  const seedDatabase = async () => {
    setStatus("Seeding initializing...");
    try {
      // 1. SERVICES
      const services = [
        { title: "Education Services", desc: "Registration, management, and coordination of Islamic educational institutions.", thumbnailLink: "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg", createdAt: new Date() },
        { title: "Marriage Services", desc: "Facilitating Islamic marriages (Nikah), counseling, and official certifications.", thumbnailLink: "https://i.postimg.cc/Y2L18bht/MUSABAQAT_1.jpg", createdAt: new Date() },
        { title: "Funeral Services", desc: "Respectful handling of Janazah and burial arrangements according to Islamic principles.", thumbnailLink: "https://i.postimg.cc/qqg0XNk7/EID_2024.jpg", createdAt: new Date() },
        { title: "Dawah Services", desc: "Requesting scholars, literature, and programs to learn more about Islam.", thumbnailLink: "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg", createdAt: new Date() },
        { title: "Socio-development Services", desc: "Zakat and Sadaqah distribution, health, and community welfare programs.", thumbnailLink: "https://i.postimg.cc/Y2L18bht/MUSABAQAT_1.jpg", createdAt: new Date() },
      ];
      for (let s of services) await addDoc(collection(db, "services"), s);

      // 2. PROGRAMS
      const programs = [
        { title: "Hijrah & Umrah", desc: "Information and registration for annual Hajj delegations and Umrah travel arrangements facilitated by the community.", thumbnailLink: "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg", createdAt: new Date() },
        { title: "Scholarships", desc: "Discover educational scholarships for domestic and international universities offered to outstanding Muslim students.", thumbnailLink: "https://i.postimg.cc/Y2L18bht/MUSABAQAT_1.jpg", createdAt: new Date() },
        { title: "Job Opportunities", desc: "Browse current job openings within the Rwanda Muslim Community offices, institutions, and partner organizations.", thumbnailLink: "https://i.postimg.cc/qqg0XNk7/EID_2024.jpg", createdAt: new Date() },
      ];
      for (let p of programs) await addDoc(collection(db, "programs"), p);

      // 3. NEWS
      const news = [
        { title: "Official statement on Ramadan moon sighting", desc: "The office of the Mufti has released the official guidelines for the upcoming holy month...", thumbnailLink: "https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg", date: "2026-03-25", driveLink: "", createdAt: new Date() },
        { title: "New scholarships awarded to 50 students", desc: "In partnership with external universities, the RMC has officially distributed...", thumbnailLink: "https://i.postimg.cc/d1VvFwWH/RMC-LOGO.jpg", date: "2026-03-28", driveLink: "", createdAt: new Date() },
      ];
      for (let n of news) await addDoc(collection(db, "news_events"), n);

      // 4. BOARD
      const board = [
        { name: "Sheikh SINDAYIGAYA Mussa", role: "Mufti of Rwanda", profileImage: "https://i.postimg.cc/yxnB0F4N/mufti.jpg", createdAt: new Date() },
        { name: "Sheikh MUSHUMBA Yunus", role: "Deputy Mufti", profileImage: "https://i.postimg.cc/cLS2dvVf/yunus.jpg", createdAt: new Date() },
        { name: "Sheikh BAKERA Ally", role: "Ameer, Foreign Affairs", profileImage: "https://i.postimg.cc/vZskG4pf/ALLY.jpg", createdAt: new Date() },
        { name: "BICAHAGA Hamidu", role: "Ameer, Dev Planning", profileImage: "https://i.postimg.cc/sgrq3MtS/ISSA.jpg", createdAt: new Date() },
      ];
      for (let b of board) await addDoc(collection(db, "board"), b);

      // 5. PARTNERS
      const partners = [
        { name: "ADEF", sector: "Education", logoLink: "https://i.postimg.cc/9XwG1JrT/gathering_1.jpg", createdAt: new Date() },
        { name: "National Institutions", sector: "Government", logoLink: "https://i.postimg.cc/Y2L18bht/MUSABAQAT_1.jpg", createdAt: new Date() },
        { name: "International Islamic Cultural Centers", sector: "Infrastructure", logoLink: "https://i.postimg.cc/qqg0XNk7/EID_2024.jpg", createdAt: new Date() },
      ];
      for (let pat of partners) await addDoc(collection(db, "partners"), pat);

      // 6. X POSTS
      const xposts = [
        { embedCode: `<blockquote class="twitter-tweet"><p lang="in" dir="ltr">Kuri iki Cyumweru, Nyakubahwa Mufti w’u Rwanda Sheikh Sindayigaya Musa yakiriye mu biro bye Visi Perezida ushinzwe amasomo muri Africa School of Governance Prof. Amany El-Sharif hamwe n’abari bamuherekeje.<br/>Ibiganiro ku mpande zombi bikaba byibanze kugusangira amahirwe ku mpande… <a href="https://t.co/AkvWqFnlMN">pic.twitter.com/AkvWqFnlMN</a></p>&mdash; Rwanda Muslim Community (@islamrwanda) <a href="https://twitter.com/islamrwanda/status/2038375707600908754?ref_src=twsrc%5Etfw">March 29, 2026</a></blockquote>`, status: "active", createdAt: new Date() },
        { embedCode: `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">On this Sunday, the Mufti of Rwanda, Sheikh Sindayigaya Musa, received in his office Prof. Amany El-Sharif, Vice-President for Academic Affairs at the Africa School of Governance, together with his delegation.<br/>Their discussions focused on exploring opportunities in education and… <a href="https://t.co/rGDMh7XfMy">pic.twitter.com/rGDMh7XfMy</a></p>&mdash; Rwanda Muslim Community (@islamrwanda) <a href="https://twitter.com/islamrwanda/status/2038374714222227693?ref_src=twsrc%5Etfw">March 29, 2026</a></blockquote>`, status: "active", createdAt: new Date() },
        { embedCode: `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The Rwanda Muslim Community (<a href="https://twitter.com/hashtag/RMC?src=hash&amp;ref_src=twsrc%5Etfw">#RMC</a>) extends its profound gratitude to His Excellency, the President of the Republic of Rwanda, <a href="https://twitter.com/PaulKagame?ref_src=twsrc%5Etfw">@PaulKagame</a>, for the time He graciously devoted to celebrating Eid Al-Fitr with the Muslim community in Rwanda. The Community further expresses its… <a href="https://t.co/vWc83iBPV5">pic.twitter.com/vWc83iBPV5</a></p>&mdash; Rwanda Muslim Community (@islamrwanda) <a href="https://twitter.com/islamrwanda/status/2036926813079801859?ref_src=twsrc%5Etfw">March 25, 2026</a></blockquote>`, status: "active", createdAt: new Date() },
      ];
      for (let x of xposts) await addDoc(collection(db, "xposts"), x);

      // 7. SITE_CONTENT (Singleton)
      await setDoc(doc(db, "site_content", "global_info"), {
        mission: `<ul><li><strong>Spiritual Guidance:</strong> Providing a "path and guidance" for the inhabitants of the world through the teachings of the Quran.</li><li><strong>Educational Advancement:</strong> Collaborating with international partners like the Africa Development and Education Foundation (ADEF) to improve religious literacy.</li><li><strong>Community Support:</strong> Offering religious resources, such as the translated Quran, free of charge to the public.</li></ul>`,
        vision: "Spreading the true teachings of Islam through peaceful outreach and guidance.",
        history: `<p>The <strong>Rwanda Muslim Community (RMC)</strong>, formerly known as the Association des Musulmans au Rwanda (AMUR), is the apex body representing the Islamic faith and interests in Rwanda. Historically a marginalized group, the community has seen a significant shift in its social and political standing in the decades following the 1994 Genocide against the Tutsi.</p><br/><p>A significant part of its modern history involves the effort to make sacred texts accessible to the Rwandan people in their native language, Kinyarwanda. This journey reached a major milestone with the publication of the first translation of the Quran in 2011, refined in 2020 for higher accuracy.</p>`,
        updatedAt: new Date()
      });

      setStatus("Seeding completely successful!");
      alert("Database Seeded Successfully!");
    } catch (e) {
      console.error(e);
      setStatus("Error: " + e.message);
    }
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-4">Initial Database Seeding</h2>
      <button onClick={seedDatabase} className="bg-red-600 text-white font-bold py-2 px-6 rounded shadow hover:bg-red-700">
        EXECUTE DATABASE SEED (ONLY RUN ONCE)
      </button>
      <p className="mt-4 font-mono text-sm">{status}</p>
    </div>
  );
}
