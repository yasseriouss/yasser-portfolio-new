import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import EducationSection from "@/components/EducationSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { isRTL } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={isRTL 
          ? "ياسر سلام | خبير تقني إبداعي وإنتاجي | مهندس CNC" 
          : "Yasser Sallam | Technical Creative & Production Expert | CNC Engineer"
        }
        description={isRTL
          ? "معرض أعمال ياسر سلام - مهندس إنتاج CNC مع أكثر من 5 سنوات خبرة في التصنيع الدقيق وتصميم الأثاث وتحسين الإنتاج."
          : "Professional portfolio of Yasser Sallam - CNC Production Engineer with 5+ years experience in precision manufacturing, furniture design, and production optimization."
        }
        keywords={isRTL
          ? "ياسر سلام، مهندس CNC، مهندس إنتاج، تصنيع الأثاث، مصر"
          : "Yasser Sallam, CNC Engineer, Production Engineer, Furniture Manufacturing, Egypt"
        }
      />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
