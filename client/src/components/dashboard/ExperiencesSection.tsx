import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Briefcase } from "lucide-react";

interface ExperienceFormData {
  companyEn: string;
  companyAr: string;
  positionEn: string;
  positionAr: string;
  locationEn: string;
  locationAr: string;
  descriptionEn: string;
  descriptionAr: string;
  responsibilitiesEn: string;
  responsibilitiesAr: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  displayOrder: number;
}

const emptyForm: ExperienceFormData = {
  companyEn: "",
  companyAr: "",
  positionEn: "",
  positionAr: "",
  locationEn: "",
  locationAr: "",
  descriptionEn: "",
  descriptionAr: "",
  responsibilitiesEn: "",
  responsibilitiesAr: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  displayOrder: 0,
};

export default function ExperiencesSection() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: experiences, isLoading } = trpc.admin.getExperiences.useQuery();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>(emptyForm);

  const createMutation = trpc.admin.createExperience.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الإضافة بنجاح" : "Added successfully");
      utils.admin.getExperiences.invalidate();
      utils.portfolio.getExperiences.invalidate();
      setDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const updateMutation = trpc.admin.updateExperience.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم التحديث بنجاح" : "Updated successfully");
      utils.admin.getExperiences.invalidate();
      utils.portfolio.getExperiences.invalidate();
      setDialogOpen(false);
      setEditingId(null);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const deleteMutation = trpc.admin.deleteExperience.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الحذف بنجاح" : "Deleted successfully");
      utils.admin.getExperiences.invalidate();
      utils.portfolio.getExperiences.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormData({
      companyEn: exp.companyEn || "",
      companyAr: exp.companyAr || "",
      positionEn: exp.positionEn || "",
      positionAr: exp.positionAr || "",
      locationEn: exp.locationEn || "",
      locationAr: exp.locationAr || "",
      descriptionEn: exp.descriptionEn || "",
      descriptionAr: exp.descriptionAr || "",
      responsibilitiesEn: exp.responsibilitiesEn || "",
      responsibilitiesAr: exp.responsibilitiesAr || "",
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split("T")[0] : "",
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split("T")[0] : "",
      isCurrent: exp.isCurrent || false,
      displayOrder: exp.displayOrder || 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (field: keyof ExperienceFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {Array(3).fill(0).map((_, i) => (
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
          {isRTL ? "الخبرات المهنية" : "Work Experiences"}
        </h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingId(null);
            setFormData(emptyForm);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {isRTL ? "إضافة خبرة" : "Add Experience"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? isRTL ? "تعديل الخبرة" : "Edit Experience"
                  : isRTL ? "إضافة خبرة جديدة" : "Add New Experience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company (English)</Label>
                  <Input
                    value={formData.companyEn}
                    onChange={(e) => handleChange("companyEn", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الشركة (عربي)</Label>
                  <Input
                    value={formData.companyAr}
                    onChange={(e) => handleChange("companyAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Position (English)</Label>
                  <Input
                    value={formData.positionEn}
                    onChange={(e) => handleChange("positionEn", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>المنصب (عربي)</Label>
                  <Input
                    value={formData.positionAr}
                    onChange={(e) => handleChange("positionAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location (English)</Label>
                  <Input
                    value={formData.locationEn}
                    onChange={(e) => handleChange("locationEn", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الموقع (عربي)</Label>
                  <Input
                    value={formData.locationAr}
                    onChange={(e) => handleChange("locationAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    disabled={formData.isCurrent}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isCurrent}
                  onCheckedChange={(checked) => handleChange("isCurrent", checked)}
                />
                <Label>{isRTL ? "الوظيفة الحالية" : "Current Position"}</Label>
              </div>

              <div className="space-y-2">
                <Label>Responsibilities (English) - JSON array</Label>
                <Textarea
                  value={formData.responsibilitiesEn}
                  onChange={(e) => handleChange("responsibilitiesEn", e.target.value)}
                  placeholder='["Responsibility 1", "Responsibility 2"]'
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>المسؤوليات (عربي) - JSON array</Label>
                <Textarea
                  value={formData.responsibilitiesAr}
                  onChange={(e) => handleChange("responsibilitiesAr", e.target.value)}
                  placeholder='["المسؤولية 1", "المسؤولية 2"]'
                  rows={3}
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => handleChange("displayOrder", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {isRTL ? "حفظ" : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {experiences?.map((exp) => (
          <Card key={exp.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{exp.positionEn}</h3>
                    <p className="text-primary">{exp.companyEn}</p>
                    <p className="text-sm text-muted-foreground">{exp.locationEn}</p>
                    {exp.isCurrent && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-500/10 text-green-600 rounded">
                        {isRTL ? "الوظيفة الحالية" : "Current"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {isRTL ? "تأكيد الحذف" : "Confirm Delete"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {isRTL
                            ? "هل أنت متأكد من حذف هذه الخبرة؟"
                            : "Are you sure you want to delete this experience?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate({ id: exp.id })}
                          className="bg-destructive text-destructive-foreground"
                        >
                          {isRTL ? "حذف" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!experiences || experiences.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {isRTL ? "لا توجد خبرات مضافة بعد" : "No experiences added yet"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
