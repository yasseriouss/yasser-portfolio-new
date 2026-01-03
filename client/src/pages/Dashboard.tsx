import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoginUrl } from "@/const";
import { useLocation, useRoute, Link } from "wouter";
import {
  User,
  Briefcase,
  FolderOpen,
  Award,
  GraduationCap,
  Star,
  MessageSquare,
  Sparkles,
  Moon,
  Sun,
  Globe,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Dashboard sections
import PersonalInfoSection from "@/components/dashboard/PersonalInfoSection";
import ExperiencesSection from "@/components/dashboard/ExperiencesSection";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import SkillsSection from "@/components/dashboard/SkillsSection";
import EducationSection from "@/components/dashboard/EducationSection";
import ReviewsSection from "@/components/dashboard/ReviewsSection";
import TestimonialsSection from "@/components/dashboard/TestimonialsSection";
import TalentsSection from "@/components/dashboard/TalentsSection";

const sidebarItems = [
  { id: "personal", icon: User, labelEn: "Personal Info", labelAr: "المعلومات الشخصية" },
  { id: "experiences", icon: Briefcase, labelEn: "Experiences", labelAr: "الخبرات" },
  { id: "projects", icon: FolderOpen, labelEn: "Projects", labelAr: "المشاريع" },
  { id: "skills", icon: Award, labelEn: "Skills", labelAr: "المهارات" },
  { id: "education", icon: GraduationCap, labelEn: "Education", labelAr: "التعليم" },
  { id: "reviews", icon: Star, labelEn: "Reviews", labelAr: "التقييمات" },
  { id: "testimonials", icon: MessageSquare, labelEn: "Testimonials", labelAr: "الشهادات" },
  { id: "talents", icon: Sparkles, labelEn: "Talents", labelAr: "المواهب" },
];

function DashboardContent({ section }: { section: string }) {
  switch (section) {
    case "personal":
      return <PersonalInfoSection />;
    case "experiences":
      return <ExperiencesSection />;
    case "projects":
      return <ProjectsSection />;
    case "skills":
      return <SkillsSection />;
    case "education":
      return <EducationSection />;
    case "reviews":
      return <ReviewsSection />;
    case "testimonials":
      return <TestimonialsSection />;
    case "talents":
      return <TalentsSection />;
    default:
      return <PersonalInfoSection />;
  }
}

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { t, isRTL, toggleLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/dashboard/:section");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentSection = params?.section || "personal";

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  // Not authenticated or not admin
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>
              {isRTL ? "الوصول مقيد" : "Access Restricted"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {isRTL
                ? "يجب أن تكون مسؤولاً للوصول إلى لوحة التحكم."
                : "You must be an admin to access the dashboard."}
            </p>
            {!isAuthenticated ? (
              <Button asChild>
                <a href={getLoginUrl()}>
                  {isRTL ? "تسجيل الدخول" : "Login"}
                </a>
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setLocation("/")}>
                {isRTL ? "العودة للرئيسية" : "Back to Home"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 h-full w-64 bg-card border-r border-border z-50 transition-transform duration-300 lg:translate-x-0",
          isRTL ? "right-0 border-l border-r-0" : "left-0",
          sidebarOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full lg:translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gradient">
              {isRTL ? "لوحة التحكم" : "Dashboard"}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isRTL ? `مرحباً ${user?.name || "المسؤول"}` : `Welcome, ${user?.name || "Admin"}`}
          </p>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <Link
                key={item.id}
                href={`/dashboard/${item.id}`}
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{isRTL ? item.labelAr : item.labelEn}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <Link href="/">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer text-muted-foreground">
              <Home className="w-5 h-5" />
              <span>{isRTL ? "العودة للموقع" : "Back to Site"}</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("lg:ml-64", isRTL && "lg:mr-64 lg:ml-0")}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold">
                {sidebarItems.find((item) => item.id === currentSection)?.[
                  isRTL ? "labelAr" : "labelEn"
                ]}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                title={isRTL ? "Switch to English" : "التبديل للعربية"}
              >
                <Globe className="h-5 w-5" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  logout();
                  setLocation("/");
                }}
                title={isRTL ? "تسجيل الخروج" : "Logout"}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <DashboardContent section={currentSection} />
        </main>
      </div>
    </div>
  );
}
