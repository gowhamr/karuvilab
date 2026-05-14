export const translations = {
  en: {
    hero: {
      title: "Build faster with KV.",
      subtitle: "Privacy you can trust.",
      desc: "The world's most private browser-side toolkit. Local-first tools by KaruviLab.",
      tag: "Productivity Refined"
    },
    common: {
      search: "Search tools... (⌘K)",
      popular: "Most Popular",
      favorites: "Personal Favorites",
      recent: "Recently Used",
      all: "All Tools",
      settings: "Settings",
      home: "Home",
      about: "About",
      help: "Help",
      privacy: "Privacy",
      terms: "Terms",
      disclaimer: "Disclaimer",
    }
  },
  hi: {
    hero: {
      title: "KV के साथ तेज़ी से बनाएँ।",
      subtitle: "गोपनीयता जिस पर आप भरोसा कर सकते हैं।",
      desc: "दुनिया का सबसे निजी ब्राउज़र-साइड टूलकिट।",
      tag: "उत्पादकता परिष्कृत"
    },
    common: {
      search: "उपकरण खोजें... (⌘K)",
      popular: "सबसे लोकप्रिय",
      favorites: "व्यक्तिगत पसंदीदा",
      recent: "हाल ही में उपयोग किए गए",
      all: "सभी उपकरण",
      settings: "सेटिंग्स",
      home: "होम",
      about: "के बारे में",
      help: "सहायता",
      privacy: "गोपनीयता",
      terms: "शर्तें",
      disclaimer: "अस्वीकरण",
    }
  },
  ta: {
    hero: {
      title: "KV உடன் வேகமாக உருவாக்குங்கள்.",
      subtitle: "நீங்கள் நம்பக்கூடிய தனியுரிமை.",
      desc: "உலகின் மிகவும் தனிப்பட்ட உலாவி-பக்க கருவித்தொகுப்பு.",
      tag: "உற்பத்தித்திறன் மேம்படுத்தப்பட்டது"
    },
    common: {
      search: "கருவிகளைத் தேடுங்கள்... (⌘K)",
      popular: "மிகவும் பிரபலமானவை",
      favorites: "தனிப்பட்ட விருப்பமானவை",
      recent: "சமீபத்தில் பயன்படுத்தப்பட்டவை",
      all: "அனைத்து கருவிகள்",
      settings: "அமைப்புகள்",
      home: "முகப்பு",
      about: "பற்றி",
      help: "உதவி",
      privacy: "தனியுரிமை",
      terms: "விதிமுறைகள்",
      disclaimer: "பொறுப்புத் துறப்பு",
    }
  }
};

export type Locale = keyof typeof translations;
export type TranslationPath = string;

export function getTranslation(locale: string, path: string) {
  const parts = path.split('.');
  let current: any = translations[locale as Locale] || translations.en;
  
  for (const part of parts) {
    if (current[part] === undefined) return path;
    current = current[part];
  }
  
  return current;
}
