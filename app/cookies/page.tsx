import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | KaruviLab",
  description: "Learn how KaruviLab uses essential, analytics, and advertising cookies to improve your experience while maintaining your privacy.",
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
        <h2 className="text-2xl font-black text-text">2. How KaruviLab Uses Cookies</h2>
        <p>At KaruviLab, we use cookies and similar technologies (like LocalStorage and IndexedDB) in the following ways:</p>
        
        <h3 className="text-xl font-bold text-text mt-4">Essential Technologies (Strictly Necessary)</h3>
        <p>
          Because our platform is designed as a local-first application, we use your browser's LocalStorage and IndexedDB 
          rather than traditional tracking cookies to remember your preferences (like Dark Mode) and preserve the state of 
          the tools you use. These are essential for the website to function as intended and cannot be switched off in our systems.
        </p>

        <h3 className="text-xl font-bold text-text mt-4">Analytics Cookies</h3>
        <p>
          We use lightweight, privacy-focused analytics (such as Vercel Speed Insights) to understand how users interact with our tools. 
          This helps us identify performance bottlenecks and improve page load times. These cookies do not collect personally identifiable information.
        </p>

        <h3 className="text-xl font-bold text-text mt-4">Advertising Cookies (Google AdSense)</h3>
        <p>
          To keep KaruviLab free for everyone, we use third-party advertising companies, including Google AdSense, to serve ads.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads based on your internet browsing history.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">3. Managing and Disabling Cookies</h2>
        <p>You have full control over your cookie preferences:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Browser Settings:</strong> You can configure your browser to refuse all cookies or to indicate when a cookie is being sent. Note that disabling essential local storage may cause some KaruviLab tools to lose your saved preferences.</li>
          <li><strong>AdSense Opt-Out:</strong> You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">Google Ads Settings</a>.</li>
          <li><strong>Third-Party Opt-Out:</strong> You can opt out of some third-party vendor's uses of cookies for personalized advertising by visiting <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">www.aboutads.info</a>.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">4. Regional Compliance</h2>
        <p>
          If you are visiting from the European Economic Area (EEA), the UK, or California, we operate a consent management system 
          that asks for your explicit permission before placing non-essential advertising and analytics cookies on your device.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">5. Contact</h2>
        <p>If you have any questions regarding our use of cookies, please contact us at:</p>
        <p><strong>Email:</strong> <a href="mailto:support@karuvilab.com" className="text-blue hover:underline">support@karuvilab.com</a></p>
      </section>
    </div>
  );
}