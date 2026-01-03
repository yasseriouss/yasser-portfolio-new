import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Plus, User, Quote } from "lucide-react";
import { toast } from "sonner";

function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "text-amber-500 fill-amber-500"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ onSuccess }: { onSuccess: () => void }) {
  const { t, isRTL } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = trpc.portfolio.submitReview.useMutation({
    onSuccess: () => {
      toast.success(t("reviews.thankYou"), {
        description: t("reviews.pending"),
      });
      setName("");
      setEmail("");
      setRating(5);
      setComment("");
      onSuccess();
    },
    onError: (error) => {
      toast.error(t("common.error"), {
        description: error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview.mutate({
      reviewerName: name,
      reviewerEmail: email || undefined,
      rating,
      comment,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t("reviews.yourName")} *
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("reviews.yourEmail")}
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("reviews.yourRating")} *
        </label>
        <StarRating rating={rating} onRatingChange={setRating} size="lg" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t("reviews.yourComment")} *
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
          rows={4}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={submitReview.isPending}
      >
        {submitReview.isPending ? t("common.loading") : t("reviews.submitReview")}
      </Button>
    </form>
  );
}

export default function ReviewsSection() {
  const { t, isRTL } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: reviews, isLoading } = trpc.portfolio.getApprovedReviews.useQuery();
  const { data: stats } = trpc.portfolio.getReviewStats.useQuery();

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section id="reviews" className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">{t("reviews.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {t("reviews.description")}
          </p>

          {/* Stats */}
          {stats && stats.approved > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <StarRating rating={Math.round(stats.average)} readonly size="lg" />
              <span className="text-2xl font-bold">{stats.average.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({stats.approved} {t("reviews.totalReviews")})
              </span>
            </div>
          )}

          {/* Add Review Button */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                {t("reviews.addReview")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("reviews.addReview")}</DialogTitle>
              </DialogHeader>
              <ReviewForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))
            : reviews?.map((review) => (
                <Card
                  key={review.id}
                  className="card-hover border-none bg-card/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-primary/20 mb-4" />

                    {/* Rating */}
                    <div className="mb-4">
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>

                    {/* Comment */}
                    <p
                      className={`text-muted-foreground mb-4 line-clamp-4 ${
                        isRTL ? "text-right" : ""
                      }`}
                    >
                      "{review.comment}"
                    </p>

                    {/* Admin Reply */}
                    {review.adminReply && (
                      <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-primary">
                            {isRTL ? "الرد:" : "Reply:"}
                          </span>{" "}
                          {review.adminReply}
                        </p>
                      </div>
                    )}

                    {/* Reviewer Info */}
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="font-medium">{review.reviewerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Empty State */}
        {!isLoading && (!reviews || reviews.length === 0) && (
          <div className="text-center py-12">
            <Quote className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isRTL ? "لا توجد تقييمات بعد. كن أول من يضيف تقييمه!" : "No reviews yet. Be the first to add your review!"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
