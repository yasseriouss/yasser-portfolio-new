import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

export default function PersonalInfoSection() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: personalInfo, isLoading } = trpc.portfolio.getPersonalInfo.useQuery();
  
  const [formData, setFormData] = useState({
    fullNameEn: "",
    fullNameAr: "",
    titleEn: "",
    titleAr: "",
    bioEn: "",
    bioAr: "",
    summaryEn: "",
    summaryAr: "",
    email: "",
    phone: "",
    whatsapp: "",
    linkedinUrl: "",
    locationEn: "",
    locationAr: "",
    avatarUrl: "",
  });

  useEffect(() => {
    if (personalInfo) {
      setFormData({
        fullNameEn: personalInfo.fullNameEn || "",
        fullNameAr: personalInfo.fullNameAr || "",
        titleEn: personalInfo.titleEn || "",
        titleAr: personalInfo.titleAr || "",
        bioEn: personalInfo.bioEn || "",
        bioAr: personalInfo.bioAr || "",
        summaryEn: personalInfo.summaryEn || "",
        summaryAr: personalInfo.summaryAr || "",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        whatsapp: personalInfo.whatsapp || "",
        linkedinUrl: personalInfo.linkedinUrl || "",
        locationEn: personalInfo.locationEn || "",
        locationAr: personalInfo.locationAr || "",
        avatarUrl: personalInfo.avatarUrl || "",
      });
    }
  }, [personalInfo]);

  const updateMutation = trpc.admin.updatePersonalInfo.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الحفظ بنجاح" : "Saved successfully");
      utils.portfolio.getPersonalInfo.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isRTL ? "المعلومات الشخصية" : "Personal Information"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isRTL ? "الاسم" : "Name"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullNameEn">Full Name (English)</Label>
              <Input
                id="fullNameEn"
                value={formData.fullNameEn}
                onChange={(e) => handleChange("fullNameEn", e.target.value)}
                placeholder="Yasser Sallam"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullNameAr">الاسم الكامل (عربي)</Label>
              <Input
                id="fullNameAr"
                value={formData.fullNameAr}
                onChange={(e) => handleChange("fullNameAr", e.target.value)}
                placeholder="ياسر سلام"
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Title */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isRTL ? "المسمى الوظيفي" : "Job Title"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titleEn">Title (English)</Label>
              <Input
                id="titleEn"
                value={formData.titleEn}
                onChange={(e) => handleChange("titleEn", e.target.value)}
                placeholder="Technical Creative & Production Expert"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAr">المسمى (عربي)</Label>
              <Input
                id="titleAr"
                value={formData.titleAr}
                onChange={(e) => handleChange("titleAr", e.target.value)}
                placeholder="خبير تقني إبداعي وإنتاجي"
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isRTL ? "النبذة التعريفية" : "Bio"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bioEn">Bio (English)</Label>
              <Textarea
                id="bioEn"
                value={formData.bioEn}
                onChange={(e) => handleChange("bioEn", e.target.value)}
                placeholder="Short bio description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bioAr">النبذة (عربي)</Label>
              <Textarea
                id="bioAr"
                value={formData.bioAr}
                onChange={(e) => handleChange("bioAr", e.target.value)}
                placeholder="وصف مختصر..."
                rows={3}
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isRTL ? "الملخص المهني" : "Professional Summary"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="summaryEn">Summary (English)</Label>
              <Textarea
                id="summaryEn"
                value={formData.summaryEn}
                onChange={(e) => handleChange("summaryEn", e.target.value)}
                placeholder="Detailed professional summary..."
                rows={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summaryAr">الملخص (عربي)</Label>
              <Textarea
                id="summaryAr"
                value={formData.summaryAr}
                onChange={(e) => handleChange("summaryAr", e.target.value)}
                placeholder="ملخص مهني مفصل..."
                rows={5}
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isRTL ? "معلومات الاتصال" : "Contact Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+201000000000"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="+201000000000"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isRTL ? "الموقع" : "Location"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="locationEn">Location (English)</Label>
              <Input
                id="locationEn"
                value={formData.locationEn}
                onChange={(e) => handleChange("locationEn", e.target.value)}
                placeholder="10th of Ramadan City, Egypt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locationAr">الموقع (عربي)</Label>
              <Input
                id="locationAr"
                value={formData.locationAr}
                onChange={(e) => handleChange("locationAr", e.target.value)}
                placeholder="مدينة العاشر من رمضان، مصر"
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Avatar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isRTL ? "الصورة الشخصية" : "Avatar"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                value={formData.avatarUrl}
                onChange={(e) => handleChange("avatarUrl", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="min-w-32"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isRTL ? "حفظ" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
