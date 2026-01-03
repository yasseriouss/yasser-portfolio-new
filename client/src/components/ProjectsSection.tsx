import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, FolderOpen } from "lucide-react";

const defaultProjects = [
  {
    titleEn: "Modern Kitchen Design",
    titleAr: "تصميم مطبخ حديث",
    descriptionEn: "Complete CNC production for a luxury modern kitchen with custom cabinets and precision-cut components.",
    descriptionAr: "إنتاج CNC كامل لمطبخ فاخر حديث مع خزائن مخصصة ومكونات مقطوعة بدقة.",
    category: "kitchen",
    imageUrl: null,
    isFeatured: true,
  },
  {
    titleEn: "Executive Wardrobe System",
    titleAr: "نظام دولاب تنفيذي",
    descriptionEn: "High-end wardrobe system with integrated lighting and smart storage solutions.",
    descriptionAr: "نظام دولاب راقي مع إضاءة متكاملة وحلول تخزين ذكية.",
    category: "wardrobe",
    imageUrl: null,
    isFeatured: true,
  },
  {
    titleEn: "Office Furniture Collection",
    titleAr: "مجموعة أثاث مكتبي",
    descriptionEn: "Complete office furniture line including desks, storage units, and conference tables.",
    descriptionAr: "خط أثاث مكتبي كامل يشمل مكاتب ووحدات تخزين وطاولات اجتماعات.",
    category: "office",
    imageUrl: null,
    isFeatured: true,
  },
];

export default function ProjectsSection() {
  const { t, isRTL } = useLanguage();
  const { data: projects, isLoading } = trpc.portfolio.getProjects.useQuery();

  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="projects" className="section-padding bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("projects.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("projects.description")}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                  </Card>
                ))
            : displayProjects.map((project, index) => {
                const title = isRTL
                  ? (project as any).titleAr || (project as any).titleEn
                  : (project as any).titleEn || (project as any).titleAr;
                const description = isRTL
                  ? (project as any).descriptionAr || (project as any).descriptionEn
                  : (project as any).descriptionEn || (project as any).descriptionAr;

                return (
                  <Card
                    key={index}
                    className="group overflow-hidden card-hover border-none bg-card/50 backdrop-blur-sm"
                  >
                    {/* Project Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FolderOpen className="w-16 h-16 text-primary/40" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Category Badge */}
                      {project.category && (
                        <Badge
                          className="absolute top-4 left-4 bg-primary/90 text-primary-foreground"
                          variant="secondary"
                        >
                          {project.category}
                        </Badge>
                      )}

                      {/* Featured Badge */}
                      {project.isFeatured && (
                        <Badge
                          className="absolute top-4 right-4 bg-amber-500/90 text-white"
                          variant="secondary"
                        >
                          {isRTL ? "مميز" : "Featured"}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {description}
                      </p>

                      {(project as any).projectUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a
                            href={(project as any).projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            {t("projects.viewDetails")}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* View All Button */}
        {displayProjects.length > 6 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              {t("projects.viewAll")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
