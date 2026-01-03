import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Check, X, Trash2, MessageSquare, Star, User, Loader2 } from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const { isRTL } = useLanguage();
  const utils = trpc.useUtils();
  
  const { data: reviews, isLoading } = trpc.admin.getAllReviews.useQuery();
  const { data: stats } = trpc.portfolio.getReviewStats.useQuery();
  
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const approveMutation = trpc.admin.approveReview.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم التحديث بنجاح" : "Updated successfully");
      utils.admin.getAllReviews.invalidate();
      utils.portfolio.getApprovedReviews.invalidate();
      utils.portfolio.getReviewStats.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const replyMutation = trpc.admin.replyToReview.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم إرسال الرد بنجاح" : "Reply sent successfully");
      utils.admin.getAllReviews.invalidate();
      utils.portfolio.getApprovedReviews.invalidate();
      setReplyDialogOpen(false);
      setSelectedReview(null);
      setReplyText("");
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const deleteMutation = trpc.admin.deleteReview.useMutation({
    onSuccess: () => {
      toast.success(isRTL ? "تم الحذف بنجاح" : "Deleted successfully");
      utils.admin.getAllReviews.invalidate();
      utils.portfolio.getApprovedReviews.invalidate();
      utils.portfolio.getReviewStats.invalidate();
    },
    onError: (error) => {
      toast.error(isRTL ? "حدث خطأ" : "An error occurred", {
        description: error.message,
      });
    },
  });

  const handleReply = (review: any) => {
    setSelectedReview(review);
    setReplyText(review.adminReply || "");
    setReplyDialogOpen(true);
  };

  const submitReply = () => {
    if (selectedReview && replyText.trim()) {
      replyMutation.mutate({ id: selectedReview.id, reply: replyText });
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const pendingReviews = reviews?.filter((r) => !r.isApproved) || [];
  const approvedReviews = reviews?.filter((r) => r.isApproved) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isRTL ? "إدارة التقييمات" : "Reviews Management"}
        </h2>
        {stats && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {isRTL ? "المعتمدة:" : "Approved:"} {stats.approved}
            </span>
            <span>
              {isRTL ? "المعلقة:" : "Pending:"} {pendingReviews.length}
            </span>
            <span>
              {isRTL ? "المتوسط:" : "Average:"} {stats.average.toFixed(1)} ⭐
            </span>
          </div>
        )}
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-amber-600">
            {isRTL ? "تقييمات معلقة" : "Pending Reviews"} ({pendingReviews.length})
          </h3>
          <div className="grid gap-4">
            {pendingReviews.map((review) => (
              <Card key={review.id} className="border-amber-500/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.reviewerName}</span>
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            {isRTL ? "معلق" : "Pending"}
                          </Badge>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="text-muted-foreground mt-2">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600"
                        onClick={() => approveMutation.mutate({ id: review.id, approved: true })}
                        disabled={approveMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
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
                                ? "هل أنت متأكد من حذف هذا التقييم؟"
                                : "Are you sure you want to delete this review?"}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate({ id: review.id })}
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
          </div>
        </div>
      )}

      {/* Approved Reviews */}
      <div className="space-y-4">
        <h3 className="font-semibold text-green-600">
          {isRTL ? "تقييمات معتمدة" : "Approved Reviews"} ({approvedReviews.length})
        </h3>
        <div className="grid gap-4">
          {approvedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.reviewerName}</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {isRTL ? "معتمد" : "Approved"}
                        </Badge>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="text-muted-foreground mt-2">{review.comment}</p>
                      
                      {review.adminReply && (
                        <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium text-primary">
                              {isRTL ? "ردك:" : "Your reply:"}
                            </span>{" "}
                            {review.adminReply}
                          </p>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReply(review)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-amber-600"
                      onClick={() => approveMutation.mutate({ id: review.id, approved: false })}
                      disabled={approveMutation.isPending}
                    >
                      <X className="w-4 h-4" />
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
                              ? "هل أنت متأكد من حذف هذا التقييم؟"
                              : "Are you sure you want to delete this review?"}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate({ id: review.id })}
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

          {approvedReviews.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                {isRTL ? "لا توجد تقييمات معتمدة بعد" : "No approved reviews yet"}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? "الرد على التقييم" : "Reply to Review"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReview && (
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{selectedReview.reviewerName}</span>
                  <StarRating rating={selectedReview.rating} />
                </div>
                <p className="text-sm text-muted-foreground">{selectedReview.comment}</p>
              </div>
            )}
            <Input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={isRTL ? "اكتب ردك هنا..." : "Write your reply here..."}
              dir={isRTL ? "rtl" : "ltr"}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button onClick={submitReply} disabled={replyMutation.isPending || !replyText.trim()}>
                {replyMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isRTL ? "إرسال" : "Send"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
