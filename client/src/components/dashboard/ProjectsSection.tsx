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
import { Plus, Pencil, Trash2, Loader2, FolderOpen, ExternalLink } from "lucide-react";

interface ProjectFormData {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  category: string;
  technologies: string;
  projectUrl: string;
  isFeatured: boolean;
  displayOrder: number;
}

const emptyForm: ProjectFormData = {
  titleEn: "",
  titleAr: "",
  descriptionEn: "",
  descriptionAr: "",
  imageUrl: "",
  category: "",
  technologies: "",
  projectUrl: "",
  isFeatured: false,
  displayOrder: 0,
};

export default function ProjectsSection() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: projects, isLoading } = trpc.admin.getProjects.useQuery();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);

  const createMutation = trpc.admin.createProject.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الإضافة بنجاح" : "Added successfully");
      utils.admin.getProjects.invalidate();
      utils.portfolio.getProjects.invalidate();
      setDialogOpen(false);
      setFormData(emptyForm);
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const updateMutation = trpc.admin.updateProject.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم التحديث بنجاح" : "Updated successfully");
      utils.admin.getProjects.invalidate();
      utils.portfolio.getProjects.invalidate();
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

  const deleteMutation = trpc.admin.deleteProject.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الحذف بنجاح" : "Deleted successfully");
      utils.admin.getProjects.invalidate();
      utils.portfolio.getProjects.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      titleEn: project.titleEn || "",
      titleAr: project.titleAr || "",
      descriptionEn: project.descriptionEn || "",
      descriptionAr: project.descriptionAr || "",
      imageUrl: project.imageUrl || "",
      category: project.category || "",
      technologies: project.technologies || "",
      projectUrl: project.projectUrl || "",
      isFeatured: project.isFeatured || false,
      displayOrder: project.displayOrder || 0,
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

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isRTL ? "المشاريع" : "Projects"}
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
              {isRTL ? "إضافة مشروع" : "Add Project"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? isRTL ? "تعديل المشروع" : "Edit Project"
                  : isRTL ? "إضافة مشروع جديد" : "Add New Project"}
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

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    placeholder="kitchen, wardrobe, office"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <Input
                    value={formData.technologies}
                    onChange={(e) => handleChange("technologies", e.target.value)}
                    placeholder="CNC, WoodWOP, AutoCAD"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project URL</Label>
                <Input
                  value={formData.projectUrl}
                  onChange={(e) => handleChange("projectUrl", e.target.value)}
                  placeholder="https://example.com/project"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleChange("isFeatured", checked)}
                  />
                  <Label>{isRTL ? "مميز" : "Featured"}</Label>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.titleEn}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FolderOpen className="w-12 h-12 text-primary/40" />
                </div>
              )}
              {project.isFeatured && (
                <span className="absolute top-2 right-2 px-2 py-1 text-xs bg-amber-500 text-white rounded">
                  {isRTL ? "مميز" : "Featured"}
                </span>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{project.titleEn}</h3>
                  {project.category && (
                    <span className="text-xs text-primary">{project.category}</span>
                  )}
                </div>
                <div className="flex gap-1">
                  {project.projectUrl && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
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
                            ? "هل أنت متأكد من حذف هذا المشروع؟"
                            : "Are you sure you want to delete this project?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate({ id: project.id })}
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

        {(!projects || projects.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center text-muted-foreground">
              {isRTL ? "لا توجد مشاريع مضافة بعد" : "No projects added yet"}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
