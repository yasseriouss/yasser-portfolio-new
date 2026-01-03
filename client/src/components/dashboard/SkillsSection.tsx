import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface SkillFormData {
  nameEn: string;
  nameAr: string;
  categoryEn: string;
  categoryAr: string;
  proficiency: number;
  displayOrder: number;
}

const emptyForm: SkillFormData = {
  nameEn: "",
  nameAr: "",
  categoryEn: "",
  categoryAr: "",
  proficiency: 80,
  displayOrder: 0,
};

export default function SkillsSection() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: skills, isLoading } = trpc.admin.getSkills.useQuery();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SkillFormData>(emptyForm);

  const createMutation = trpc.admin.createSkill.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الإضافة بنجاح" : "Added successfully");
      utils.admin.getSkills.invalidate();
      utils.portfolio.getSkills.invalidate();
      setDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const updateMutation = trpc.admin.updateSkill.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم التحديث بنجاح" : "Updated successfully");
      utils.admin.getSkills.invalidate();
      utils.portfolio.getSkills.invalidate();
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

  const deleteMutation = trpc.admin.deleteSkill.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الحذف بنجاح" : "Deleted successfully");
      utils.admin.getSkills.invalidate();
      utils.portfolio.getSkills.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
    setFormData({
      nameEn: skill.nameEn || "",
      nameAr: skill.nameAr || "",
      categoryEn: skill.categoryEn || "",
      categoryAr: skill.categoryAr || "",
      proficiency: skill.proficiency || 80,
      displayOrder: skill.displayOrder || 0,
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

  const handleChange = (field: keyof SkillFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Group skills by category
  const groupedSkills = skills?.reduce((acc, skill) => {
    const category = skill.categoryEn || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

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
          {isRTL ? "المهارات" : "Skills"}
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
              {isRTL ? "إضافة مهارة" : "Add Skill"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? isRTL ? "تعديل المهارة" : "Edit Skill"
                  : isRTL ? "إضافة مهارة جديدة" : "Add New Skill"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name (English)</Label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => handleChange("nameEn", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم (عربي)</Label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) => handleChange("nameAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category (English)</Label>
                  <Input
                    value={formData.categoryEn}
                    onChange={(e) => handleChange("categoryEn", e.target.value)}
                    placeholder="CNC Programming, Software, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>التصنيف (عربي)</Label>
                  <Input
                    value={formData.categoryAr}
                    onChange={(e) => handleChange("categoryAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Proficiency ({formData.proficiency}%)</Label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) => handleChange("proficiency", parseInt(e.target.value))}
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

      <div className="space-y-6">
        {groupedSkills && Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <Card key={category}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-primary mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills?.map((skill) => (
                  <div key={skill.id} className="group relative">
                    <Badge
                      variant="secondary"
                      className="px-3 py-1.5 pr-8 cursor-default"
                    >
                      {skill.nameEn}
                    </Badge>
                    <div className="absolute right-0 top-0 h-full flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleEdit(skill)}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {isRTL ? "تأكيد الحذف" : "Confirm Delete"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {isRTL
                                ? "هل أنت متأكد من حذف هذه المهارة؟"
                                : "Are you sure you want to delete this skill?"}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate({ id: skill.id })}
                              className="bg-destructive text-destructive-foreground"
                            >
                              {isRTL ? "حذف" : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {(!skills || skills.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {isRTL ? "لا توجد مهارات مضافة بعد" : "No skills added yet"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
