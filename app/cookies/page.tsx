import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | KaruviLab",
  description: "Learn how KaruviLab uses essential local storage and privacy-focused performance metrics without third-party advertising cookies.",
};

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-black tracking-tight text-text">Cookie Policy</h1>
      <p className="text-text-4 font-bold">Effective Date: May 30, 2026</p>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">1. What are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
          They are widely used to make websites work more efficiently, provide a better user experience, and supply analytical data to website owners.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">2. How KaruviLab Uses Cookies & Local Storage</h2>
        <p>At KaruviLab, we use browser storage technologies (like LocalStorage and IndexedDB) in the following ways:</p>
        
        <h3 className="text-xl font-bold text-text mt-4">Essential Local Storage (Strictly Necessary)</h3>
        <p>
          Because our platform is designed as a local-first application, we use your browser's LocalStorage and IndexedDB 
          rather than traditional tracking cookies to remember your preferences (like Dark Mode), preserve your starred favorites, 
          and store tool states (such as Notes drafts, calculator scenarios, custom templates, and game high scores). These are essential 
          for the website to function as intended and cannot be switched off in our systems.
        </p>

        <h3 className="text-xl font-bold text-text mt-4">Analytics & Performance Metrics</h3>
        <p>
          We use lightweight, privacy-focused analytics (such as Vercel Speed Insights) to understand how users interact with our tools. 
          This helps us identify performance bottlenecks and improve page load times. These analytics do not collect personally identifiable information.
        </p>

        <h3 className="text-xl font-bold text-text mt-4">Zero Advertising Cookies</h3>
        <p>
          KaruviLab is 100% ad-free. We do not use third-party advertising cookies, do not track your browsing activity across other websites, and do not serve advertisements.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">3. Managing Local Storage Data</h2>
        <p>You have full control over your stored browser data:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>In-App Controls:</strong> You can selectively wipe tool states, drafts, and cached scenarios using <strong>"Clear All Tool Data"</strong>, or perform a complete wipe of all settings, favorites, and local data using the <strong>"Factory Reset App"</strong> button in the KaruviLab Settings menu under Data Management.</li>
          <li><strong>Browser Settings:</strong> You can clear your browser's LocalStorage and IndexedDB at any time through your browser's privacy settings. Note that clearing browser storage will reset your saved theme and app preferences.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">4. Regional Compliance & Privacy Standard</h2>
        <p>
          KaruviLab complies with EEA, UK GDPR, and California CCPA/CPRA privacy laws by default through our zero-tracking architecture. Because we do not deploy non-essential tracking cookies or sell personal data, your privacy is protected without requiring complex cookie banners or tracking opt-outs.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">5. Contact</h2>
        <p>If you have any questions regarding our use of browser storage, please contact us at:</p>
        <p><strong>Email:</strong> <a href="mailto:support@karuvilab.com" className="text-blue hover:underline">support@karuvilab.com</a></p>
      </section>
    </div>
  );
}