import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Plus, Pencil, Trash2, Loader2, Sparkles } from "lucide-react";

interface TalentFormData {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  displayOrder: number;
}

const emptyForm: TalentFormData = {
  titleEn: "",
  titleAr: "",
  descriptionEn: "",
  descriptionAr: "",
  icon: "",
  displayOrder: 0,
};

export default function TalentsSection() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: talents, isLoading } = trpc.admin.getTalents.useQuery();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TalentFormData>(emptyForm);

  const createMutation = trpc.admin.createTalent.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الإضافة بنجاح" : "Added successfully");
      utils.admin.getTalents.invalidate();
      utils.portfolio.getTalents.invalidate();
      setDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const updateMutation = trpc.admin.updateTalent.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم التحديث بنجاح" : "Updated successfully");
      utils.admin.getTalents.invalidate();
      utils.portfolio.getTalents.invalidate();
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

  const deleteMutation = trpc.admin.deleteTalent.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الحذف بنجاح" : "Deleted successfully");
      utils.admin.getTalents.invalidate();
      utils.portfolio.getTalents.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const handleEdit = (talent: any) => {
    setEditingId(talent.id);
    setFormData({
      titleEn: talent.titleEn || "",
      titleAr: talent.titleAr || "",
      descriptionEn: talent.descriptionEn || "",
      descriptionAr: talent.descriptionAr || "",
      icon: talent.icon || "",
      displayOrder: talent.displayOrder || 0,
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

  const handleChange = (field: keyof TalentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
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
          {isRTL ? "المواهب" : "Talents"}
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
              {isRTL ? "إضافة موهبة" : "Add Talent"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? isRTL ? "تعديل الموهبة" : "Edit Talent"
                  : isRTL ? "إضافة موهبة جديدة" : "Add New Talent"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) => handleChange("titleEn", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>العنوان (عربي)</Label>
                  <Input
                    value={formData.titleAr}
                    onChange={(e) => handleChange("titleAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Description (English)</Label>
                  <Textarea
                    value={formData.descriptionEn}
                    onChange={(e) => handleChange("descriptionEn", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوصف (عربي)</Label>
                  <Textarea
                    value={formData.descriptionAr}
                    onChange={(e) => handleChange("descriptionAr", e.target.value)}
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Icon (Lucide icon name)</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => handleChange("icon", e.target.value)}
                    placeholder="Music, Camera, Palette, etc."
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

      <div className="grid gap-4 md:grid-cols-2">
        {talents?.map((talent) => (
          <Card key={talent.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{talent.titleEn}</h3>
                    {talent.descriptionEn && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {talent.descriptionEn}
                      </p>
                    )}
                    {talent.icon && (
                      <span className="text-xs text-primary mt-2 inline-block">
                        Icon: {talent.icon}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(talent)}>
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
                            ? "هل أنت متأكد من حذف هذه الموهبة؟"
                            : "Are you sure you want to delete this talent?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate({ id: talent.id })}
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

        {(!talents || talents.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center text-muted-foreground">
              {isRTL ? "لا توجد مواهب مضافة بعد" : "No talents added yet"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
