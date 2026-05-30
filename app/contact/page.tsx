import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | KaruviLab",
  description: "Get in touch with the KaruviLab team. Report bugs, share feedback, or make business inquiries.",
};

export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-black tracking-tight text-text">Contact Us</h1>
      
      <p className="text-lg text-text-2 leading-relaxed">
        We love hearing from our users! Whether you've found a bug, have an idea for a new tool, 
        or want to discuss a business opportunity, the KaruviLab team is ready to help.
      </p>

      <section className="space-y-4 text-text-2 leading-relaxed mt-8">
        <h2 className="text-2xl font-black text-text">General Support & Feedback</h2>
        <p>
          Have a question about how to use a specific tool? Or perhaps you have feedback on how we can improve the UI?
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:support@karuvilab.com" className="text-blue font-bold hover:underline">support@karuvilab.com</a>
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">Bug Reporting</h2>
        <p>
          Because our tools run entirely in your browser, bug reports are incredibly helpful for our engineering team. 
          When reporting a bug, please include:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The name of the tool you were using.</li>
          <li>Your browser name and version (e.g., Chrome 120, Safari 17).</li>
          <li>Your operating system (e.g., Windows 11, iOS 17).</li>
          <li>A brief description of what happened vs. what you expected to happen.</li>
        </ul>
        <p>
          <strong>Report Bugs To:</strong> <a href="mailto:support@karuvilab.com" className="text-blue font-bold hover:underline">support@karuvilab.com</a>
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">Business & Partnership Inquiries</h2>
        <p>
          For advertising inquiries, API integrations, or platform partnerships, please reach out to our management team.
        </p>
        <p>
          <strong>Business Email:</strong> <a href="mailto:support@karuvilab.com" className="text-blue font-bold hover:underline">support@karuvilab.com</a>
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed p-6 bg-surface border border-border rounded-2xl mt-8">
        <h2 className="text-xl font-black text-text">Response Expectations</h2>
        <p>
          We aim to read every single email that comes our way. While we cannot guarantee a personalized response to every 
          piece of feedback, we typically respond to critical bug reports and business inquiries within <strong>24 to 48 hours</strong>.
        </p>
      </section>
    </div>
  );
}