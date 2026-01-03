import { Mail, Phone, Linkedin, ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSection() {
  const { t, isRTL } = useLanguage();
  const { data: personalInfo, isLoading } = trpc.portfolio.getPersonalInfo.useQuery();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Default contact info
  const email = personalInfo?.email || "yassersalllam@gmail.com";
  const phone = personalInfo?.phone || "+201000986942";
  const whatsapp = personalInfo?.whatsapp || "+201000986942";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsapp.replace(/[^0-9]/g, "")}`;
  const linkedinUrl = personalInfo?.linkedinUrl || "https://linkedin.com/in/yasserious";
  const linkedinHandle = linkedinUrl.split("/").pop() || "yasserious";

  const fullName = isRTL
    ? personalInfo?.fullNameAr || personalInfo?.fullNameEn || "ياسر سلام"
    : personalInfo?.fullNameEn || "Yasser Sallam";

  const nameParts = fullName.split(" ");
  const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0];
  const lastName = nameParts[nameParts.length - 1] || "";

  const title = isRTL
    ? personalInfo?.titleAr || personalInfo?.titleEn || t("hero.subtitle")
    : personalInfo?.titleEn || t("hero.subtitle");

  const bio = isRTL
    ? personalInfo?.bioAr || personalInfo?.bioEn || t("hero.description")
    : personalInfo?.bioEn || t("hero.description");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-4 md:left-10 w-16 md:w-32 h-16 md:h-32 border border-primary/20 rounded-full animate-float opacity-30" />
      <div className="absolute top-32 md:top-40 right-4 md:right-20 w-12 md:w-24 h-12 md:h-24 border border-primary/30 rotate-45 animate-float-delayed opacity-20" />
      <div className="absolute bottom-32 md:bottom-40 left-[10%] md:left-1/4 w-10 md:w-16 h-10 md:h-16 bg-primary/10 rounded-lg rotate-12 animate-float opacity-40" />
      <div className="absolute top-1/4 md:top-1/3 right-[15%] md:right-1/4 w-12 md:w-20 h-12 md:h-20 border-2 border-accent/20 rounded-full animate-pulse-glow" />

      {/* Gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] lg:w-[600px] h-[300px] md:h-[450px] lg:h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-3xl">
            {/* Name */}
            <div className="animate-fade-up">
              {isLoading ? (
                <Skeleton className="h-16 w-96 mx-auto mb-6" />
              ) : (
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                  {firstName} <span className="text-gradient">{lastName}</span>
                </h1>
              )}
            </div>

            {/* Title & Bio */}
            <div className="animate-fade-up-delayed">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-64 mx-auto mb-4" />
                  <Skeleton className="h-6 w-full max-w-2xl mx-auto mb-8" />
                </>
              ) : (
                <>
                  <p className="text-xl md:text-2xl lg:text-3xl text-primary font-medium mb-4">
                    {title}
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    {bio}
                  </p>
                </>
              )}
            </div>

            {/* Contact info pills */}
            <div
              className={`flex flex-wrap gap-3 mb-10 justify-center animate-fade-up ${
                isRTL ? "flex-row-reverse" : ""
              }`}
              style={{ animationDelay: "0.4s" }}
            >
              <a
                href={`mailto:${email}`}
                className={`flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm hover:bg-secondary transition-smooth group ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Mail className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-secondary-foreground">{email}</span>
              </a>
              <a
                href={`tel:${phone}`}
                className={`flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm hover:bg-secondary transition-smooth group ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Phone className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-secondary-foreground" dir="ltr">
                  {phone}
                </span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 bg-green-600/20 rounded-full text-sm hover:bg-green-600/30 transition-smooth group ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <MessageCircle className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                <span className="text-green-600 dark:text-green-400">WhatsApp</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-sm hover:bg-secondary transition-smooth group ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Linkedin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-secondary-foreground">{linkedinHandle}</span>
              </a>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-4 justify-center animate-fade-up ${
                isRTL ? "flex-row-reverse" : ""
              }`}
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("experience")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              >
                {t("hero.cta.explore")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg"
              >
                {t("hero.cta.contact")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-smooth animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
