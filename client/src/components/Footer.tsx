import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Mail, Phone, Linkedin, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { t, isRTL } = useLanguage();
  const { data: personalInfo } = trpc.portfolio.getPersonalInfo.useQuery();

  const email = personalInfo?.email || "yassersalllam@gmail.com";
  const phone = personalInfo?.phone || "+201000986942";
  const linkedinUrl = personalInfo?.linkedinUrl || "https://linkedin.com/in/yasserious";

  const fullName = isRTL
    ? personalInfo?.fullNameAr || personalInfo?.fullNameEn || "ياسر سلام"
    : personalInfo?.fullNameEn || "Yasser Sallam";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className={isRTL ? "text-right" : ""}>
            <h3 className="text-2xl font-bold text-gradient mb-2">{fullName}</h3>
            <p className="text-muted-foreground">{t("footer.tagline")}</p>
          </div>

          {/* Quick Links */}
          <div className={`${isRTL ? "text-right" : ""}`}>
            <h4 className="font-semibold mb-4">{isRTL ? "روابط سريعة" : "Quick Links"}</h4>
            <nav className="flex flex-col gap-2">
              {["about", "experience", "projects", "skills", "education", "reviews", "contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t(`nav.${item}` as any)}
                  </a>
                )
              )}
            </nav>
          </div>

          {/* Contact */}
          <div className={isRTL ? "text-right" : ""}>
            <h4 className="font-semibold mb-4">{t("nav.contact")}</h4>
            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>{email}</span>
              </a>
              <a
                href={`tel:${phone}`}
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Phone className="w-4 h-4" />
                <span dir="ltr">{phone}</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {fullName}. {t("footer.rights")}
          </p>

          {/* Back to top */}
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            {t("common.backToTop")}
          </Button>
        </div>
      </div>
    </footer>
  );
}
