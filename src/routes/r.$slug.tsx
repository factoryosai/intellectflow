import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles, Star, Loader2, Check, MoonStar } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { generateReviews, logReviewPick } from "@/lib/reviews.functions";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/r/$slug")({
  component: PublicReview,
});

function PublicReview() {
  const { slug } = Route.useParams();
  const gen = useServerFn(generateReviews);
  const log = useServerFn(logReviewPick);
  const [picked, setPicked] = useState<number | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["public-reviews", slug],
    queryFn: () => gen({ data: { slug } }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const choose = async (text: string, i: number) => {
    setPicked(i);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard may be blocked; continue to redirect */
    }
    // fire-and-forget log, don't block the redirect
    log({ data: { slug, suggestion: text } }).catch(() => {});
    const link = data?.google_review_link;
    setTimeout(() => {
      if (link) window.location.href = link;
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8">
        <div className="flex justify-center">
          <Logo />
        </div>

        {isLoading || isFetching ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Writing review ideas just for you…
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              We couldn't load this review page. Please try again.
            </p>
            <Button variant="hero" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : data && !data.active ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="bg-gradient-brand flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground">
              <MoonStar className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-black">This review page is currently inactive</h1>
            <p className="text-sm text-muted-foreground">
              {data.business_name || "This business"} isn't collecting reviews right
              now. Please check back later.
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="mt-8 text-center">
              <div className="mb-3 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-primary text-primary" />
                ))}
              </div>
              <h1 className="text-2xl font-black leading-tight">
                Enjoyed {data?.business_name}?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Tap a review you like — we'll copy it and take you to Google to post it
                from your own account.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {data?.suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => choose(s, i)}
                  disabled={picked !== null}
                  className={`w-full rounded-2xl border p-4 text-left text-sm transition-all ${
                    picked === i
                      ? "border-primary bg-accent ring-2 ring-primary/40"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-gradient-brand mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-primary-foreground">
                      {picked === i ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="leading-relaxed">{s}</span>
                  </div>
                </button>
              ))}
            </div>

            {picked !== null && (
              <p className="mt-5 text-center text-sm font-medium text-primary">
                Copied! Taking you to Google…
              </p>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Powered by {BRAND.name}
        </p>
      </div>
    </div>
  );
}
