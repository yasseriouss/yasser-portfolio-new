import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({
  title = "Yasser Sallam | Technical Creative & Production Expert",
  description = "Professional portfolio of Yasser Sallam - CNC Production Engineer with 5+ years experience in precision manufacturing, furniture design, and production optimization.",
  keywords = "Yasser Sallam, CNC Engineer, Production Engineer, Furniture Manufacturing, Egypt",
  image = "/og-image.png",
  url = "/",
  type = "website",
}: SEOHeadProps) {
  const { language, isRTL } = useLanguage();

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update HTML lang attribute
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    // Update meta tags dynamically
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Primary meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:url", url, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:locale", language === "ar" ? "ar_EG" : "en_US", true);

    // Twitter
    updateMetaTag("twitter:title", title, true);
    updateMetaTag("twitter:description", description, true);
    updateMetaTag("twitter:image", image, true);

  }, [title, description, keywords, image, url, type, language, isRTL]);

  return null;
}
