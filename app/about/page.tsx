import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | KaruviLab",
  description: "Learn about the mission behind KaruviLab. Discover our commitment to privacy-first, local-first browser-native tools built for speed and security.",
};

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-black tracking-tight text-text">About KaruviLab</h1>
      
      <section className="space-y-4 text-text-2 leading-relaxed">
        <p className="text-xl font-bold text-text-3">
          KaruviLab is the world's fastest, most private browser-native productivity platform.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">Our Mission</h2>
        <p>
          In an era where every small utility website demands account creation, uploads your sensitive documents to unknown servers, 
          and tracks your every move, KaruviLab was built to offer a better way. Our mission is to provide professional-grade, 
          everyday utility tools that respect your time and your data. 
        </p>
        <p>
          We believe that compressing an image, formatting a JSON file, or calculating a loan shouldn't require compromising your privacy.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">The Privacy-First Philosophy</h2>
        <p>At KaruviLab, we adhere to a strict set of core principles:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Local-First Processing:</strong> By leveraging WebAssembly and Web Workers, our tools process your files directly inside your browser's memory.</li>
          <li><strong>Zero-Server-Upload:</strong> We do not have cloud storage. We do not upload your PDFs, images, or code. Your data physically never leaves your device.</li>
          <li><strong>Offline Friendly:</strong> As a Progressive Web App (PWA), once KaruviLab loads, the vast majority of our tools will continue to work perfectly even if you lose internet connection.</li>
          <li><strong>No Forced Accounts:</strong> You shouldn't have to surrender your email address just to split a PDF. KaruviLab works instantly, right out of the box.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">User Benefits</h2>
        <p>
          Whether you are a developer debugging API payloads, a student managing assignments, a designer optimizing assets, 
          or an office worker securely manipulating sensitive financial PDFs, KaruviLab offers unparalleled speed. Because data 
          isn't traveling back and forth over a network, operations that usually take seconds happen almost instantly.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">The Founder & Team</h2>
        <p>
          KaruviLab was founded by a team of engineers passionate about web performance and digital privacy. 
          Frustrated by the intrusive nature of modern web utilities, we set out to prove that complex computing—like 
          video manipulation, PDF rendering, and code compilation—can be executed securely and efficiently on the client-side.
        </p>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">Our Technology Stack</h2>
        <p>
          KaruviLab pushes the boundaries of modern web browsers. We utilize:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Next.js & React:</strong> For a highly responsive, app-like user interface.</li>
          <li><strong>WebAssembly (WASM):</strong> To bring near-native speed to complex tasks like image compression and cryptography.</li>
          <li><strong>IndexedDB:</strong> To securely save your tool configurations and history locally on your device.</li>
          <li><strong>Service Workers:</strong> To cache assets and guarantee offline resilience.</li>
        </ul>
      </section>

      <section className="space-y-4 text-text-2 leading-relaxed">
        <h2 className="text-2xl font-black text-text">Commitment to Transparency</h2>
        <p>
          We are committed to operating transparently. We monetize the platform through non-intrusive advertisements (Google AdSense) 
          to keep the tools 100% free for everyone, without resorting to data harvesting.
        </p>
        <p>
          Welcome to the future of web utilities. Fast, free, and fiercely private.
        </p>
      </section>
    </div>
  );
}