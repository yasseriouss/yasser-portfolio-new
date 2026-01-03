import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, MessageCircle, Linkedin, MapPin } from "lucide-react";

export default function ContactSection() {
  const { t, isRTL } = useLanguage();
  const { data: personalInfo, isLoading } = trpc.portfolio.getPersonalInfo.useQuery();

  const email = personalInfo?.email || "yassersalllam@gmail.com";
  const phone = personalInfo?.phone || "+201000986942";
  const whatsapp = personalInfo?.whatsapp || "+201000986942";
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsapp.replace(/[^0-9]/g, "")}`;
  const linkedinUrl = personalInfo?.linkedinUrl || "https://linkedin.com/in/yasserious";
  const location = isRTL
    ? personalInfo?.locationAr || personalInfo?.locationEn || "مدينة العاشر من رمضان، مصر"
    : personalInfo?.locationEn || "10th of Ramadan City, Egypt";

  const contactItems = [
    {
      icon: Mail,
      label: t("contact.email"),
      value: email,
      href: `mailto:${email}`,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Phone,
      label: t("contact.phone"),
      value: phone,
      href: `tel:${phone}`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: MessageCircle,
      label: t("contact.whatsapp"),
      value: "WhatsApp",
      href: whatsappUrl,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      external: true,
    },
    {
      icon: Linkedin,
      label: t("contact.linkedin"),
      value: "LinkedIn",
      href: linkedinUrl,
      color: "text-blue-600",
      bgColor: "bg-blue-600/10",
      external: true,
    },
    {
      icon: MapPin,
      label: t("contact.location"),
      value: location,
      href: null,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("contact.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-5 w-3/4" />
                      </CardContent>
                    </Card>
                  ))
              : contactItems.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <Card
                      className={`card-hover border-none bg-card/50 backdrop-blur-sm ${
                        item.href ? "cursor-pointer" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div
                          className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-4`}
                        >
                          <Icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {item.label}
                        </p>
                        <p
                          className={`font-medium ${item.href ? "hover:text-primary transition-colors" : ""}`}
                          dir={item.label === t("contact.phone") ? "ltr" : undefined}
                        >
                          {item.value}
                        </p>
                      </CardContent>
                    </Card>
                  );

                  if (item.href) {
                    return (
                      <a
                        key={index}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="block"
                      >
                        {content}
                      </a>
                    );
                  }

                  return <div key={index}>{content}</div>;
                })}
          </div>
        </div>
      </div>
    </section>
  );
}
