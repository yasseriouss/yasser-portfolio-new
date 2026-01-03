import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

const defaultEducation = [
  {
    degreeEn: "B.Sc.",
    degreeAr: "بكالوريوس",
    fieldEn: "Management Information Systems",
    fieldAr: "نظم المعلومات الإدارية",
    institutionEn: "Higher Technological Institute - 10th of Ramadan Branch",
    institutionAr: "المعهد التكنولوجي العالي - فرع العاشر من رمضان",
    startDate: "2012-09-01",
    endDate: "2016-06-01",
    isCurrent: false,
  },
];

function formatYear(dateStr: string | null | Date): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.getFullYear().toString();
}

export default function EducationSection() {
  const { t, isRTL } = useLanguage();
  const { data: education, isLoading } = trpc.portfolio.getEducation.useQuery();

  const displayEducation = education && education.length > 0 ? education : defaultEducation;

  return (
    <section id="education" className="section-padding bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("edu.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("edu.description")}
          </p>
        </div>

        {/* Education Cards */}
        <div className="max-w-3xl mx-auto space-y-6">
          {isLoading
            ? Array(2)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <Skeleton className="h-5 w-2/3 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            : displayEducation.map((edu, index) => {
                const degree = isRTL
                  ? (edu as any).degreeAr || (edu as any).degreeEn
                  : (edu as any).degreeEn || (edu as any).degreeAr;
                const field = isRTL
                  ? (edu as any).fieldAr || (edu as any).fieldEn
                  : (edu as any).fieldEn || (edu as any).fieldAr;
                const institution = isRTL
                  ? (edu as any).institutionAr || (edu as any).institutionEn
                  : (edu as any).institutionEn || (edu as any).institutionAr;

                return (
                  <Card
                    key={index}
                    className="card-hover border-none bg-card/50 backdrop-blur-sm"
                  >
                    <CardContent className="p-6">
                      <div className={`flex gap-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="w-8 h-8 text-primary" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                          <h3 className="text-xl font-bold mb-1">{degree}</h3>
                          <p className="text-lg text-primary font-medium mb-2">
                            {field}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <MapPin className="w-4 h-4" />
                              <span>{institution}</span>
                            </div>
                            <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <Calendar className="w-4 h-4" />
                              <span dir="ltr">
                                {formatYear(edu.startDate)} - {formatYear(edu.endDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </div>
    </section>
  );
}
