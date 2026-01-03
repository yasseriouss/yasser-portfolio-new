import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Pencil, Trash2, Loader2, GraduationCap } from "lucide-react";

interface EducationFormData {
  institutionEn: string;
  institutionAr: string;
  degreeEn: string;
  degreeAr: string;
  fieldEn: string;
  fieldAr: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  displayOrder: number;
}

const emptyForm: EducationFormData = {
  institutionEn: "",
  institutionAr: "",
  degreeEn: "",
  degreeAr: "",
  fieldEn: "",
  fieldAr: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  displayOrder: 0,
};

export default function EducationSection() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: education, isLoading } = trpc.admin.getEducation.useQuery();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<EducationFormData>(emptyForm);

  const createMutation = trpc.admin.createEducation.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الإضافة بنجاح" : "Added successfully");
      utils.admin.getEducation.invalidate();
      utils.portfolio.getEducation.invalidate();
      setDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const updateMutation = trpc.admin.updateEducation.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم التحديث بنجاح" : "Updated successfully");
      utils.admin.getEducation.invalidate();
      utils.portfolio.getEducation.invalidate();
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

  const deleteMutation = trpc.admin.deleteEducation.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الحذف بنجاح" : "Deleted successfully");
      utils.admin.getEducation.invalidate();
      utils.portfolio.getEducation.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const handleEdit = (edu: any) => {
    setEditingId(edu.id);
    setFormData({
      institutionEn: edu.institutionEn || "",
      institutionAr: edu.institutionAr || "",
      degreeEn: edu.degreeEn || "",
      degreeAr: edu.degreeAr || "",
      fieldEn: edu.fieldEn || "",
      fieldAr: edu.fieldAr || "",
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : "",
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : "",
      isCurrent: edu.isCurrent || false,
      displayOrder: edu.displayOrder || 0,
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

  const handleChange = (field: keyof EducationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {Array(2).fill(0).map((_, i) => (
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
          {isRTL ? "التعليم" : "Education"}
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
              {isRTL ? "إضافة مؤهل" : "Add Education"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? isRTL ? "تعديل المؤهل" : "Edit Education"
                  : isRTL ? "إضافة مؤهل جديد" : "Add New Education"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Institution (English)</Label>
                  <Input
                    value={formData.institutionEn}
                    onChange={(e) => handleChange("institutionEn", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>المؤسسة (عربي)</Label>
                  <Input
                    value={formData.institutionAr}
                    onChange={(e) => handleChange("institutionAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Degree (English)</Label>
                  <Input
                    value={formData.degreeEn}
                    onChange={(e) => handleChange("degreeEn", e.target.value)}
                    required
                    placeholder="B.Sc., M.Sc., Ph.D."
                  />
                </div>
                <div className="space-y-2">
                  <Label>الدرجة (عربي)</Label>
                  <Input
                    value={formData.degreeAr}
                    onChange={(e) => handleChange("degreeAr", e.target.value)}
                    dir="rtl"
                    placeholder="بكالوريوس، ماجستير"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Field of Study (English)</Label>
                  <Input
                    value={formData.fieldEn}
                    onChange={(e) => handleChange("fieldEn", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>التخصص (عربي)</Label>
                  <Input
                    value={formData.fieldAr}
                    onChange={(e) => handleChange("fieldAr", e.target.value)}
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
                <Label>{isRTL ? "لا يزال يدرس" : "Currently Studying"}</Label>
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
        {education?.map((edu) => (
          <Card key={edu.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{edu.degreeEn}</h3>
                    <p className="text-primary">{edu.fieldEn}</p>
                    <p className="text-sm text-muted-foreground">{edu.institutionEn}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(edu)}>
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
                            ? "هل أنت متأكد من حذف هذا المؤهل؟"
                            : "Are you sure you want to delete this education?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate({ id: edu.id })}
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

        {(!education || education.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {isRTL ? "لا توجد مؤهلات مضافة بعد" : "No education added yet"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
