import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cog, Palette, Users, Lightbulb } from "lucide-react";

const defaultTalents = [
  {
    icon: "Cog",
    titleEn: "CNC & Manufacturing",
    titleAr: "CNC والتصنيع",
    descriptionEn: "5+ years mastering precision production with Homag CNC systems, WoodWOP, and advanced woodworking",
    descriptionAr: "أكثر من 5 سنوات في إتقان الإنتاج الدقيق مع أنظمة Homag CNC وWoodWOP والنجارة المتقدمة",
  },
  {
    icon: "Palette",
    titleEn: "Design & CAD",
    titleAr: "التصميم والـ CAD",
    descriptionEn: "Proficient in AutoCAD, Fusion 360, SolidWorks, and creative 3D modeling for furniture design",
    descriptionAr: "إتقان AutoCAD وFusion 360 وSolidWorks والنمذجة ثلاثية الأبعاد لتصميم الأثاث",
  },
  {
    icon: "Users",
    titleEn: "IT & Client Relations",
    titleAr: "تكنولوجيا المعلومات والعلاقات",
    descriptionEn: "Background in systems administration, technical sales, and building lasting client partnerships",
    descriptionAr: "خلفية في إدارة الأنظمة والمبيعات التقنية وبناء شراكات العملاء",
  },
  {
    icon: "Lightbulb",
    titleEn: "Innovation & Leadership",
    titleAr: "الابتكار والقيادة",
    descriptionEn: "Driving production optimization, implementing solutions, and leading cross-functional teams",
    descriptionAr: "قيادة تحسين الإنتاج وتنفيذ الحلول وإدارة الفرق متعددة التخصصات",
  },
];

const iconMap: Record<string, any> = {
  Cog,
  Palette,
  Users,
  Lightbulb,
};

export default function AboutSection() {
  const { t, isRTL } = useLanguage();
  const { data: talents, isLoading: talentsLoading } = trpc.portfolio.getTalents.useQuery();
  const { data: personalInfo, isLoading: infoLoading } = trpc.portfolio.getPersonalInfo.useQuery();

  const displayTalents = talents && talents.length > 0 ? talents : defaultTalents;

  const summary = isRTL
    ? personalInfo?.summaryAr || personalInfo?.summaryEn || t("about.summary")
    : personalInfo?.summaryEn || t("about.summary");

  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t("about.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("about.description")}
          </p>
        </div>

        {/* Talents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {talentsLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="card-hover">
                    <CardContent className="p-6">
                      <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 mt-1" />
                    </CardContent>
                  </Card>
                ))
            : displayTalents.map((talent, index) => {
                const IconComponent = iconMap[talent.icon || "Cog"] || Cog;
                const title = isRTL
                  ? (talent as any).titleAr || (talent as any).titleEn
                  : (talent as any).titleEn || (talent as any).titleAr;
                const description = isRTL
                  ? (talent as any).descriptionAr || (talent as any).descriptionEn
                  : (talent as any).descriptionEn || (talent as any).descriptionAr;

                return (
                  <Card
                    key={index}
                    className="card-hover border-none bg-card/50 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* Summary */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-none bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {infoLoading ? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </>
              ) : (
                <p
                  className={`text-lg leading-relaxed text-muted-foreground ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {summary}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
