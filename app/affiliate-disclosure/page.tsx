import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | KaruviLab",
  description: "Learn about KaruviLab's affiliate relationships and our commitment to editorial independence and transparency.",
};

export default function AffiliateDisclosure() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-black tracking-tight text-text">Affiliate Disclosure</h1>
      <p className="text-text-4 font-bold">Effective Date: May 30, 2026</p>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">1. Transparency Statement</h2>
        <p>
          At KaruviLab, we believe in radical transparency. Maintaining a fast, secure, and privacy-first platform 
          requires significant ongoing resources, including server hosting and development time. To help offset these 
          costs and keep our core browser tools 100% free for users, we may participate in various affiliate marketing programs.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">2. Affiliate Relationships</h2>
        <p>
          This means that occasionally, we may include affiliate links to external products, software, or services 
          within our blog articles, tool descriptions, or resource pages. If you click on an affiliate link and make 
          a purchase, KaruviLab may earn a small commission from the vendor.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">3. No Additional Cost to You</h2>
        <p>
          Clicking on an affiliate link and making a purchase <strong>does not cost you anything extra</strong>. 
          The commission we earn is paid entirely by the vendor as a referral fee.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">4. Editorial Independence</h2>
        <p>
          Our commitment to you, the user, always comes first. We maintain strict editorial independence. 
          We only recommend products or services that we have researched, tested, and genuinely believe provide 
          value to developers, designers, and web professionals. An affiliate partnership will never influence 
          our reviews, rankings, or the technical integrity of the content on KaruviLab.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">5. Questions?</h2>
        <p>
          If you have any questions regarding our affiliate relationships or how we fund the platform, 
          please feel free to reach out.
        </p>
        <p><strong>Email:</strong> <a href="mailto:KaruviLab@proton.me" className="text-blue hover:underline">KaruviLab@proton.me</a></p>
      </section>
    </div>
  );
}