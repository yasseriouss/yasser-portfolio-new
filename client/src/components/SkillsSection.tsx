import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

const defaultSkills = [
  { nameEn: "WoodWOP 7.2", nameAr: "WoodWOP 7.2", categoryEn: "CNC Programming", categoryAr: "برمجة CNC", proficiency: 95 },
  { nameEn: "ArtCAM", nameAr: "ArtCAM", categoryEn: "CNC Programming", categoryAr: "برمجة CNC", proficiency: 90 },
  { nameEn: "Aspire", nameAr: "Aspire", categoryEn: "CNC Programming", categoryAr: "برمجة CNC", proficiency: 85 },
  { nameEn: "Homag CNC Router", nameAr: "راوتر Homag CNC", categoryEn: "Machine Expertise", categoryAr: "خبرة الماكينات", proficiency: 95 },
  { nameEn: "Homag CNC Drill", nameAr: "درل Homag CNC", categoryEn: "Machine Expertise", categoryAr: "خبرة الماكينات", proficiency: 90 },
  { nameEn: "Homag Auto Saw", nameAr: "منشار Homag الآلي", categoryEn: "Machine Expertise", categoryAr: "خبرة الماكينات", proficiency: 88 },
  { nameEn: "AutoCAD", nameAr: "أوتوكاد", categoryEn: "Software", categoryAr: "البرمجيات", proficiency: 90 },
  { nameEn: "Fusion 360", nameAr: "فيوجن 360", categoryEn: "Software", categoryAr: "البرمجيات", proficiency: 85 },
  { nameEn: "SolidWorks & Swood", nameAr: "سوليدوركس و Swood", categoryEn: "Software", categoryAr: "البرمجيات", proficiency: 80 },
  { nameEn: "Leadership", nameAr: "القيادة", categoryEn: "Project Management", categoryAr: "إدارة المشاريع", proficiency: 90 },
  { nameEn: "Time Management", nameAr: "إدارة الوقت", categoryEn: "Project Management", categoryAr: "إدارة المشاريع", proficiency: 88 },
  { nameEn: "Systems Administration", nameAr: "إدارة الأنظمة", categoryEn: "IT & Sales", categoryAr: "تكنولوجيا المعلومات والمبيعات", proficiency: 85 },
  { nameEn: "Client Relations", nameAr: "علاقات العملاء", categoryEn: "IT & Sales", categoryAr: "تكنولوجيا المعلومات والمبيعات", proficiency: 90 },
  { nameEn: "Arabic (Native)", nameAr: "العربية (اللغة الأم)", categoryEn: "Languages", categoryAr: "اللغات", proficiency: 100 },
  { nameEn: "English (Professional)", nameAr: "الإنجليزية (مهني)", categoryEn: "Languages", categoryAr: "اللغات", proficiency: 85 },
  { nameEn: "Spanish (Basic)", nameAr: "الإسبانية (أساسي)", categoryEn: "Languages", categoryAr: "اللغات", proficiency: 30 },
];

export default function SkillsSection() {
  const { t, isRTL } = useLanguage();
  const { data: skills, isLoading } = trpc.portfolio.getSkills.useQuery();

  const displaySkills = skills && skills.length > 0 ? skills : defaultSkills;

  // Group skills by category
  const groupedSkills = useMemo(() => {
    const groups: Record<string, Array<{ nameEn: string; nameAr?: string | null; categoryEn?: string | null; categoryAr?: string | null; proficiency?: number | null }>> = {};
    displaySkills.forEach((skill) => {
      const category = isRTL
        ? (skill as any).categoryAr || (skill as any).categoryEn || "Other"
        : (skill as any).categoryEn || (skill as any).categoryAr || "Other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(skill);
    });
    return groups;
  }, [displaySkills, isRTL]);

  return (
    <section id="skills" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("skills.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("skills.description")}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
            : Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <Card
                  key={category}
                  className="card-hover border-none bg-card/50 backdrop-blur-sm"
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-primary">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill, index) => {
                        const name = isRTL
                          ? (skill as any).nameAr || (skill as any).nameEn
                          : (skill as any).nameEn || (skill as any).nameAr;

                        return (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                          >
                            {name}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
