import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, MapPin, Calendar } from "lucide-react";

const defaultExperiences = [
  {
    positionEn: "CNC Production Engineer",
    positionAr: "مهندس إنتاج CNC",
    companyEn: "Larouch for Wooden Furniture",
    companyAr: "لاروش للأثاث الخشبي",
    locationEn: "10th of Ramadan City",
    locationAr: "مدينة العاشر من رمضان",
    startDate: "2024-08-01",
    endDate: null,
    isCurrent: true,
    responsibilitiesEn: JSON.stringify([
      "Operate and program CNC machines using WoodWOP software for Homag equipment",
      "Supervise woodworking operations for high-end kitchen and wardrobe products",
      "Coordinate production schedules and ensure timely delivery",
      "Liaise with design and quality departments to maintain standards",
    ]),
    responsibilitiesAr: JSON.stringify([
      "تشغيل وبرمجة ماكينات CNC باستخدام برنامج WoodWOP لمعدات Homag",
      "الإشراف على عمليات النجارة لمنتجات المطابخ والدواليب الراقية",
      "تنسيق جداول الإنتاج وضمان التسليم في الوقت المحدد",
      "التنسيق مع أقسام التصميم والجودة للحفاظ على المعايير",
    ]),
  },
  {
    positionEn: "CNC Production Engineer",
    positionAr: "مهندس إنتاج CNC",
    companyEn: "Ebdaa Factory (ENCID)",
    companyAr: "مصنع إبداع (ENCID)",
    locationEn: "Badr City",
    locationAr: "مدينة بدر",
    startDate: "2024-04-01",
    endDate: "2024-08-01",
    isCurrent: false,
    responsibilitiesEn: JSON.stringify([
      "Created machine programs and reports",
      "Managed production processes involving Homag CNC machinery",
      "Maintained coordination with the quality control department",
    ]),
    responsibilitiesAr: JSON.stringify([
      "إنشاء برامج الماكينات والتقارير",
      "إدارة عمليات الإنتاج باستخدام ماكينات Homag CNC",
      "الحفاظ على التنسيق مع قسم مراقبة الجودة",
    ]),
  },
  {
    positionEn: "CNC Production Engineer",
    positionAr: "مهندس إنتاج CNC",
    companyEn: "Artniture",
    companyAr: "Artniture",
    locationEn: "6 October City",
    locationAr: "مدينة 6 أكتوبر",
    startDate: "2019-11-01",
    endDate: "2024-06-01",
    isCurrent: false,
    responsibilitiesEn: JSON.stringify([
      "Developed CNC programs and controlled production for kitchens and wardrobes",
      "Maintained operational continuity across all CNC processes",
      "Generated production reports and maintained client communication",
    ]),
    responsibilitiesAr: JSON.stringify([
      "تطوير برامج CNC والتحكم في إنتاج المطابخ والدواليب",
      "الحفاظ على استمرارية التشغيل عبر جميع عمليات CNC",
      "إعداد تقارير الإنتاج والحفاظ على التواصل مع العملاء",
    ]),
  },
  {
    positionEn: "Account Manager",
    positionAr: "مدير حسابات",
    companyEn: "Yieldz IT Solutions",
    companyAr: "Yieldz لحلول تكنولوجيا المعلومات",
    locationEn: "6 October City",
    locationAr: "مدينة 6 أكتوبر",
    startDate: "2017-04-01",
    endDate: "2019-09-01",
    isCurrent: false,
    responsibilitiesEn: JSON.stringify([
      "Provided IT consultancy and software solutions",
      "Managed client accounts, business needs, and solution implementation",
    ]),
    responsibilitiesAr: JSON.stringify([
      "تقديم استشارات تكنولوجيا المعلومات وحلول البرمجيات",
      "إدارة حسابات العملاء واحتياجات العمل وتنفيذ الحلول",
    ]),
  },
];

function formatDate(dateStr: string | null | Date, isRTL: boolean): string {
  if (!dateStr) return isRTL ? "حتى الآن" : "Present";
  const date = new Date(dateStr);
  const month = date.toLocaleString(isRTL ? "ar-EG" : "en-US", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

export default function ExperienceSection() {
  const { t, isRTL } = useLanguage();
  const { data: experiences, isLoading } = trpc.portfolio.getExperiences.useQuery();

  const displayExperiences = experiences && experiences.length > 0 ? experiences : defaultExperiences;

  return (
    <section id="experience" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("exp.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("exp.description")}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="timeline-line" />

          {/* Experience items */}
          <div className="space-y-12">
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="relative pl-12 md:pl-0">
                      <div className="timeline-dot" style={{ top: "2rem" }} />
                      <Card className="md:w-[calc(50%-2rem)] md:ml-auto">
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                      </Card>
                    </div>
                  ))
              : displayExperiences.map((exp, index) => {
                  const position = isRTL
                    ? exp.positionAr || exp.positionEn
                    : exp.positionEn || exp.positionAr;
                  const company = isRTL
                    ? exp.companyAr || exp.companyEn
                    : exp.companyEn || exp.companyAr;
                  const location = isRTL
                    ? exp.locationAr || exp.locationEn
                    : exp.locationEn || exp.locationAr;

                  let responsibilities: string[] = [];
                  try {
                    const respStr = isRTL
                      ? exp.responsibilitiesAr || exp.responsibilitiesEn
                      : exp.responsibilitiesEn || exp.responsibilitiesAr;
                    if (respStr) {
                      responsibilities = JSON.parse(respStr);
                    }
                  } catch {
                    responsibilities = [];
                  }

                  const isLeft = index % 2 === 0;

                  return (
                    <div
                      key={index}
                      className={`relative pl-12 md:pl-0 ${
                        isLeft ? "md:pr-[calc(50%+2rem)]" : "md:pl-[calc(50%+2rem)]"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="timeline-dot" style={{ top: "2rem" }} />

                      {/* Current badge */}
                      {exp.isCurrent && (
                        <Badge
                          className={`absolute top-0 ${
                            isLeft ? "md:right-[calc(50%+3rem)]" : "md:left-[calc(50%+3rem)]"
                          } left-12 md:left-auto bg-primary text-primary-foreground`}
                        >
                          {t("exp.current")}
                        </Badge>
                      )}

                      <Card className="card-hover border-none bg-card/50 backdrop-blur-sm mt-8 md:mt-0">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-1">{position}</h3>
                          <div className="flex items-center gap-2 text-primary font-medium mb-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{company}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span dir="ltr">
                                {formatDate(exp.startDate, isRTL)} -{" "}
                                {exp.isCurrent
                                  ? t("exp.present")
                                  : formatDate(exp.endDate, isRTL)}
                              </span>
                            </div>
                          </div>

                          {responsibilities.length > 0 && (
                            <ul
                              className={`space-y-2 text-sm text-muted-foreground ${
                                isRTL ? "pr-4" : "pl-4"
                              }`}
                            >
                              {responsibilities.map((resp, i) => (
                                <li
                                  key={i}
                                  className={`relative before:absolute before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full before:top-2 ${
                                    isRTL
                                      ? "before:-right-3 text-right"
                                      : "before:-left-3"
                                  }`}
                                >
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}
