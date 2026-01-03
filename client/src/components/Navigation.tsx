import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, Globe, X } from "lucide-react";
import { Link } from "wouter";

const navItems = [
  { key: "about", href: "#about" },
  { key: "experience", href: "#experience" },
  { key: "projects", href: "#projects" },
  { key: "skills", href: "#skills" },
  { key: "education", href: "#education" },
  { key: "reviews", href: "#reviews" },
  { key: "contact", href: "#contact" },
];

export default function Navigation() {
  const { t, isRTL, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-xl md:text-2xl font-bold text-gradient"
        >
          {isRTL ? "ياسر سلام" : "Yasser Sallam"}.
        </a>

        {/* Desktop Navigation */}
        <div className={`hidden lg:flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.href)}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-smooth rounded-lg hover:bg-secondary/50"
            >
              {t(`nav.${item.key}` as any)}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="text-muted-foreground hover:text-primary"
            title={t("lang.switch")}
          >
            <Globe className="h-5 w-5" />
            <span className="sr-only">{t("lang.switch")}</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-primary"
            title={t("theme.toggle")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">{t("theme.toggle")}</span>
          </Button>

          {/* Dashboard Link (Admin only) */}
          {isAuthenticated && user?.role === "admin" && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hidden md:flex">
                {t("nav.dashboard")}
              </Button>
            </Link>
          )}

          {/* Hire Me Button */}
          <Button
            onClick={() => scrollToSection("#contact")}
            className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t("nav.hireMe")}
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? "left" : "right"} className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.href)}
                    className={`px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-smooth ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t(`nav.${item.key}` as any)}
                  </button>
                ))}
                
                {isAuthenticated && user?.role === "admin" && (
                  <Link href="/dashboard">
                    <button
                      className={`px-4 py-3 text-lg font-medium text-primary hover:bg-secondary/50 rounded-lg transition-smooth w-full ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {t("nav.dashboard")}
                    </button>
                  </Link>
                )}

                <Button
                  onClick={() => scrollToSection("#contact")}
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t("nav.hireMe")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
