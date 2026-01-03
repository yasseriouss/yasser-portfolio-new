import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Loader2, Quote } from "lucide-react";

interface TestimonialFormData {
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  companyEn: string;
  companyAr: string;
  contentEn: string;
  contentAr: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
}

const emptyForm: TestimonialFormData = {
  nameEn: "",
  nameAr: "",
  titleEn: "",
  titleAr: "",
  companyEn: "",
  companyAr: "",
  contentEn: "",
  contentAr: "",
  imageUrl: "",
  isActive: true,
  displayOrder: 0,
};

export default function TestimonialsSection() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: testimonials, isLoading } = trpc.admin.getTestimonials.useQuery();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(emptyForm);

  const createMutation = trpc.admin.createTestimonial.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الإضافة بنجاح" : "Added successfully");
      utils.admin.getTestimonials.invalidate();
      utils.portfolio.getTestimonials.invalidate();
      setDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const updateMutation = trpc.admin.updateTestimonial.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم التحديث بنجاح" : "Updated successfully");
      utils.admin.getTestimonials.invalidate();
      utils.portfolio.getTestimonials.invalidate();
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

  const deleteMutation = trpc.admin.deleteTestimonial.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الحذف بنجاح" : "Deleted successfully");
      utils.admin.getTestimonials.invalidate();
      utils.portfolio.getTestimonials.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    setFormData({
      nameEn: testimonial.nameEn || "",
      nameAr: testimonial.nameAr || "",
      titleEn: testimonial.titleEn || "",
      titleAr: testimonial.titleAr || "",
      companyEn: testimonial.companyEn || "",
      companyAr: testimonial.companyAr || "",
      contentEn: testimonial.contentEn || "",
      contentAr: testimonial.contentAr || "",
      imageUrl: testimonial.imageUrl || "",
      isActive: testimonial.isActive ?? true,
      displayOrder: testimonial.displayOrder || 0,
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

  const handleChange = (field: keyof TestimonialFormData, value: any) => {
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
          {isRTL ? "الشهادات" : "Testimonials"}
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
              {isRTL ? "إضافة شهادة" : "Add Testimonial"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? isRTL ? "تعديل الشهادة" : "Edit Testimonial"
                  : isRTL ? "إضافة شهادة جديدة" : "Add New Testimonial"}
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
                  <Label>Title (English)</Label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) => handleChange("titleEn", e.target.value)}
                    placeholder="CEO, Manager, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>المسمى (عربي)</Label>
                  <Input
                    value={formData.titleAr}
                    onChange={(e) => handleChange("titleAr", e.target.value)}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company (English)</Label>
                  <Input
                    value={formData.companyEn}
                    onChange={(e) => handleChange("companyEn", e.target.value)}
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
                  <Label>Content (English)</Label>
                  <Textarea
                    value={formData.contentEn}
                    onChange={(e) => handleChange("contentEn", e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>المحتوى (عربي)</Label>
                  <Textarea
                    value={formData.contentAr}
                    onChange={(e) => handleChange("contentAr", e.target.value)}
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange("isActive", checked)}
                  />
                  <Label>{isRTL ? "نشط" : "Active"}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => handleChange("displayOrder", parseInt(e.target.value) || 0)}
                    className="w-20"
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

      <div className="grid gap-4">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id} className="">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {testimonial.avatarUrl ? (
                      <img
                        src={testimonial.avatarUrl}
                        alt={testimonial.nameEn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Quote className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.nameEn}</h3>
                    <p className="text-sm text-primary">
                      {testimonial.titleEn}
                      {testimonial.companyEn && ` - ${testimonial.companyEn}`}
                    </p>
                    <p className="text-muted-foreground mt-2 line-clamp-2">
                      "{testimonial.contentEn}"
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(testimonial)}>
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
                            ? "هل أنت متأكد من حذف هذه الشهادة؟"
                            : "Are you sure you want to delete this testimonial?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate({ id: testimonial.id })}
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

        {(!testimonials || testimonials.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              {isRTL ? "لا توجد شهادات مضافة بعد" : "No testimonials added yet"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
