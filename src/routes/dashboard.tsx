import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogOut, Copy, Star, Pencil, Check, Loader2, ExternalLink, ShieldCheck, Sparkles,
  MessageSquare, BarChart3, Image as ImageIcon, Share2, QrCode, AlertTriangle, Zap
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { QRDisplay } from "@/components/QRDisplay";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useBusiness, isOnboarded } from "@/lib/useBusiness";
import { PLAN_MAP, isPlanActive } from "@/lib/brand";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPro,
});

function DashboardPro() {
  const navigate = useNavigate();
  const { session, loading, isAdmin, signOut } = useAuth();
  const { data, isLoading, refetch } = useBusiness();

  const [editing, setEditing] = useState(false);
  const [contact, setContact] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [logoDisplay, setLogoDisplay] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // PRO FEATURES STATE
  const [activeTab, setActiveTab] = useState<"overview" | "replies" | "gmb" | "analytics" | "posters">("overview");
  const [replyInput, setReplyInput] = useState("");
  const [replyVariants, setReplyVariants] = useState<string[]>([]);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyCount, setReplyCount] = useState(12); // mock
  const [gmbInput, setGmbInput] = useState("");
  const [gmbPosts, setGmbPosts] = useState<string[]>([]);
  const [gmbLoading, setGmbLoading] = useState(false);
  const [gmbCount, setGmbCount] = useState(2);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (data?.business && !isOnboarded(data.business)) navigate({ to: "/onboarding" });
    if (data?.business) {
      setContact(data.business.contact_number ?? "");
      setLink(data.business.google_review_link ?? "");
    }
  }, [data, navigate]);

  useEffect(() => {
    const logo = data?.business?.logo_url;
    if (!logo) { setLogoDisplay(null); return; }
    if (logo.startsWith("http")) { setLogoDisplay(logo); return; }
    let active = true;
    supabase.storage.from("business-assets").createSignedUrl(logo, 3600).then(({ data: signed }) => {
      if (active) setLogoDisplay(signed?.signedUrl ?? null);
    });
    return () => { active = false; };
  }, [data?.business?.logo_url]);

  if (loading || isLoading || !data?.business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const business = data.business;
  const sub = data.subscription;
  const active = isPlanActive(sub?.status, sub?.current_period_end);
  const planId = sub?.plan || "starter";
  const isStarter = planId === "starter";
  const isGrowth = planId === "growth";
  const isPro = planId === "business" || planId === "pro";
  const onTrial = sub?.status === "trialing" && active;
  const trialDaysLeft = onTrial && sub?.current_period_end ? Math.max(0, Math.ceil((new Date(sub.current_period_end).getTime() - Date.now()) / 86400000)) : 0;
  const reviewUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/r/${business.slug}`;

  const saveEdits = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("businesses").update({ contact_number: contact || null, google_review_link: link.trim() }).eq("id", business.id);
      if (error) throw error;
      await refetch();
      setEditing(false);
      toast.success("Saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally { setSaving(false); }
  };

  const copyLink = () => { navigator.clipboard.writeText(reviewUrl); toast.success("Link copied"); };

  const onLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file || !session) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Logo must be under 5MB"); return; }
    setUploadingLogo(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${session.user.id}/logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("business-assets").upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { error: dbErr } = await supabase.from("businesses").update({ logo_url: path }).eq("id", business.id);
      if (dbErr) throw dbErr;
      await refetch(); toast.success("Logo updated");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploadingLogo(false); }
  };

  // AI REPLY GENERATOR - 3 VARIANTS
  const generateReply = async () => {
    if (!replyInput.trim()) { toast.error("Review text likho"); return; }
    if (isStarter) { toast.error("Upgrade to Growth - ₹5,000/mo ka feature sirf ₹599 me"); navigate({ to: "/pricing" }); return; }
    if (!isPro && replyCount >= 50) { toast.error("50 reply limit reached. Upgrade to Pro for unlimited"); return; }
    setReplyLoading(true);
    // Mock Gemini API - replace with real Gemini call
    setTimeout(() => {
      setReplyVariants([
        `Thank you ${business.business_name} ke liye! Aapka review dil se - Gujarati me warm reply: ${replyInput.slice(0,20)}...`,
        `Dhanyavad! ${business.business_name} parivar aapka aabhari hai. Jaldi fir milenge!`,
        `Thanks a ton! Your support for ${business.business_name} means world to us. Visit again!`
      ]);
      setReplyLoading(false);
      setReplyCount(c => c + 1);
      toast.success("3 variants generated!");
    }, 1500);
  };

  // GMB POST GENERATOR
  const generateGMB = async () => {
    if (!gmbInput.trim()) { toast.error("Festival/Offer likho"); return; }
    if (isStarter) { toast.error("Growth plan me 5 posts, Pro me 15 posts. Upgrade karo"); return; }
    const limit = isPro ? 15 : 5;
    if (gmbCount >= limit) { toast.error(`${limit} posts limit reached. Pro me unlimited`); return; }
    setGmbLoading(true);
    setTimeout(() => {
      const post = `🎉 ${gmbInput} Special at ${business.business_name}! ${business.address} Visit today #${business.business_name.replace(/\s/g,"")} #GoogleReviews`;
      setGmbPosts([post, ...gmbPosts]);
      setGmbLoading(false);
      setGmbCount(c => c + 1);
      toast.success("GMB Post Generated! Copy karo");
    }, 1200);
  };

  const downloadPoster = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFCC00"; ctx.fillRect(0,0,1080,1080);
    ctx.fillStyle = "#000"; ctx.font = "bold 60px sans-serif"; ctx.fillText(business.business_name, 80, 200);
    ctx.font = "40px sans-serif"; ctx.fillText(`⭐⭐⭐⭐⭐ ${data.reviewCount} Reviews`, 80, 300);
    ctx.fillText(reviewUrl, 80, 900);
    const link = document.createElement("a");
    link.download = `${business.business_name}-poster.png`;
    link.href = canvas.toDataURL(); link.click();
    toast.success("Poster Downloaded 1080x1080");
  };

  const downloadStory = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000"; ctx.fillRect(0,0,1080,1920);
    ctx.fillStyle = "#FFCC00"; ctx.font = "bold 70px sans-serif"; ctx.fillText(business.business_name, 80, 300);
    ctx.fillStyle = "#fff"; ctx.font = "40px sans-serif"; ctx.fillText(`⭐ ${data.reviewCount} Happy Customers`, 80, 400);
    ctx.fillText(reviewUrl, 80, 1700);
    const link = document.createElement("a");
    link.download = `${business.business_name}-story.png`;
    link.href = canvas.toDataURL(); link.click();
    toast.success("Story Downloaded 1080x1920");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 to-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-5 sm:py-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex min-w-0 items-center"><Logo /></div>
            <div className="flex shrink-0 items-center gap-2">
              {isAdmin && <Button asChild variant="outline" size="sm"><Link to="/admin"><ShieldCheck className="h-4 w-4" /> <span className="hidden sm:inline">Admin</span></Link></Button>}
              <Button variant="ghost" size="sm" onClick={() => signOut()}><LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span></Button>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border/60 pt-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black tracking-tight sm:text-base">{business.business_name}</p>
              <p className="truncate text-xs text-muted-foreground">{business.address} • Plan: <span className="font-bold">{PLAN_MAP[sub?.plan as keyof typeof PLAN_MAP]?.name || planId}</span> • Market Value ₹{isPro ? "55,000" : isGrowth ? "25,000" : "8,000"}/mo</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-bold"><Star className="h-3.5 w-3.5 text-primary" />{data.reviewCount}</span>
              <Badge variant={active ? "default" : "secondary"} className={active ? "bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white" : ""}>{sub?.status ?? "none"}</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: Star },
            { id: "replies", label: `AI Replies ${!isStarter ? `(${replyCount}/50)` : "🔒"}`, icon: MessageSquare },
            { id: "gmb", label: `GMB Posts ${!isStarter ? `(${gmbCount}/${isPro ? 15 : 5})` : "🔒"}`, icon: Sparkles },
            { id: "analytics", label: "Sentiment & Analytics", icon: BarChart3 },
            { id: "posters", label: "Posters & Story", icon: ImageIcon },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold whitespace-nowrap ${activeTab === t.id ? "bg-black text-white border-black" : "bg-card hover:bg-accent"}`}>
              <t.icon className="h-4 w-4" />{t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button onClick={copyLink} className="group flex flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left shadow-sm hover:border-primary/50">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white"><Copy className="h-4 w-4" /></span>
                <span className="text-sm font-bold">Copy link</span><span className="text-xs text-muted-foreground">Share review page</span>
              </button>
              <a href={reviewUrl} target="_blank" className="group flex flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left shadow-sm hover:border-primary/50">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white"><ExternalLink className="h-4 w-4" /></span>
                <span className="text-sm font-bold">Open page</span><span className="text-xs text-muted-foreground">/r/{business.slug}</span>
              </a>
              <Link to="/pricing" className="group flex flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left shadow-sm hover:border-primary/50">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-yellow-400 text-black"><Zap className="h-4 w-4" /></span>
                <span className="text-sm font-bold">{active ? "Manage plan" : "Upgrade"}</span><span className="text-xs text-muted-foreground">Value ₹55k+ | From ₹299</span>
              </Link>
              <button onClick={() => setEditing(true)} className="group flex flex-col items-start gap-2 rounded-2xl border bg-card p-4 text-left shadow-sm hover:border-primary/50">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white"><Pencil className="h-4 w-4" /></span>
                <span className="text-sm font-bold">Edit details</span><span className="text-xs text-muted-foreground">Update info</span>
              </button>
            </div>

            {onTrial && (
              <div className="mt-5 flex flex-col sm:flex-row justify-between gap-3 rounded-2xl border border-yellow-400/30 bg-yellow-50 p-5">
                <div className="flex gap-3"><Sparkles className="h-5 w-5 text-yellow-600" /><div><p className="font-bold">Free trial active — {trialDaysLeft} days left</p><p className="text-sm text-muted-foreground">Starter trial pe ho. Growth lo 50 AI replies + negative filter Worth ₹25k</p></div></div>
                <Button asChild className="bg-black text-white"><Link to="/pricing">Choose a plan</Link></Button>
              </div>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-bold">Your review QR</h2>
                <p className="mb-4 text-sm text-muted-foreground">Premium Templates {isStarter ? "(5 Basic only) 🔒 20+ locked" : "20+ Premium Unlocked"} Market Value ₹1,000</p>
                <QRDisplay url={reviewUrl} name={business.business_name} />
                <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/40 p-2">
                  <span className="flex-1 truncate text-xs text-muted-foreground">{reviewUrl}</span>
                  <Button size="icon" variant="ghost" onClick={copyLink}><Copy className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" asChild><a href={reviewUrl} target="_blank"><ExternalLink className="h-4 w-4" /></a></Button>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Star className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Reviews driven</span></div>
                    <p className="text-4xl font-black text-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] bg-clip-text">{data.reviewCount}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Value ₹5,000/mo feature</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-6 shadow-sm">
                    <div className="flex justify-between"><span className="text-sm text-muted-foreground">Subscription</span><Badge className={active ? "bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white" : ""}>{sub?.status}</Badge></div>
                    <p className="text-2xl font-black mt-2">{sub?.plan ? PLAN_MAP[sub.plan as keyof typeof PLAN_MAP]?.name : "No plan"} <span className="text-xs font-normal text-muted-foreground">Market Value ₹{isPro ? "55k" : isGrowth ? "25k" : "8k"}/mo</span></p>
                    <Button asChild variant="outline" size="sm" className="mt-4 w-full"><Link to="/pricing">{active ? "Manage plan" : "Upgrade to Growth ₹599"}</Link></Button>
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold">Business details</h2>{!editing ? <Button variant="ghost" size="sm" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /> Edit</Button> : <Button size="sm" onClick={saveEdits} disabled={saving}><Check className="h-4 w-4" /> {saving ? "Saving…" : "Save"}</Button>}</div>
                  <div className="space-y-4">
                    <div className="space-y-1.5"><Label>Business logo (Custom Branding Value ₹1,000/mo) {isStarter && "🔒 Growth me"}</Label>
                      <div className="flex items-center gap-4">
                        {logoDisplay ? <img src={logoDisplay} alt="logo" className="h-16 w-16 rounded-xl border object-contain" /> : <div className="flex h-16 w-16 items-center justify-center rounded-xl border-dashed border text-xl font-black">{business.business_name?.[0]}</div>}
                        <label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={onLogoChange} disabled={uploadingLogo} /><span className="inline-flex gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent">{uploadingLogo ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : "Upload logo"}</span></label>
                      </div>
                    </div>
                    <div className="space-y-1.5"><Label>Contact</Label><Input value={contact} disabled={!editing} onChange={(e) => setContact(e.target.value)} placeholder="Not set" /></div>
                    <div className="space-y-1.5"><Label>Google review link</Label><Input value={link} disabled={!editing} onChange={(e) => setLink(e.target.value)} /></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* AI REPLIES TAB */}
        {activeTab === "replies" && (
          <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-2"><MessageSquare className="h-5 w-5" /> AI Review Reply Generator <span className="text-xs font-normal text-muted-foreground">Value ₹5,000/mo | Growth 50/mo | Pro Unlimited</span></h2>
            <p className="text-sm text-muted-foreground mt-1">Gujarati/Hindi/English 3 tones auto-detect. 1-click copy. Counter: {replyCount}/{isPro ? "Unlimited" : "50"} Market Value ₹12k/mo Pro me</p>
            <div className="mt-6 grid gap-4">
              <Label>Review Text Paste Karo</Label>
              <Input value={replyInput} onChange={(e) => setReplyInput(e.target.value)} placeholder="Customer review yaha paste karo..." />
              <Button onClick={generateReply} disabled={replyLoading} className="bg-black text-white">{replyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate 3 Variants</Button>
              {replyVariants.length > 0 && (
                <div className="grid gap-3 mt-4">
                  {replyVariants.map((v,i) => (
                    <div key={i} className="border rounded-xl p-4 flex justify-between gap-3"><span className="text-sm">{v}</span><Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(v); toast.success("Copied!"); }}><Copy className="h-4 w-4" /></Button></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GMB TAB */}
        {activeTab === "gmb" && (
          <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black flex items-center gap-2"><Sparkles className="h-5 w-5" /> AI GMB Post Generator <span className="text-xs font-normal text-muted-foreground">Value ₹8,000/mo | 15 posts/mo Pro me</span></h2>
            <p className="text-sm text-muted-foreground mt-1">Festival/Offer likho, AI caption + hashtags + CTA banayega. Limit: {gmbCount}/{isPro ? 15 : 5}</p>
            <div className="mt-6 grid gap-4">
              <Label>Festival/Offer Input (e.g., Diwali Offer 20% OFF)</Label>
              <Input value={gmbInput} onChange={(e) => setGmbInput(e.target.value)} placeholder="Diwali, New Year, Monsoon Offer..." />
              <Button onClick={generateGMB} disabled={gmbLoading} className="bg-gradient-to-r from-[#6A4DFF] to-[#2D9CDB] text-white">{gmbLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate GMB Post"}</Button>
              {gmbPosts.map((post, idx) => (
                <div key={idx} className="border rounded-xl p-4 flex justify-between gap-3"><span className="text-sm">{post}</span><Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(post); toast.success("Copied!"); }}><Copy className="h-4 w-4" /></Button></div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Sentiment Analysis <span className="text-xs font-normal">Value ₹5,000/mo | Pro only</span></h3>
              {!isPro ? <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"><p className="text-sm">🔒 Pro plan me unlock hoga - Value ₹5,000/mo ka AI Sentiment Positive % + Keywords</p><Button size="sm" className="mt-2" asChild><Link to="/pricing">Upgrade to Pro ₹1299</Link></Button></div> : (
                <div className="mt-4">
                  <div className="flex gap-4 text-center"><div className="flex-1 bg-green-50 rounded-xl p-4"><div className="text-3xl font-black text-green-600">82%</div><div className="text-xs">Positive</div></div><div className="flex-1 bg-red-50 rounded-xl p-4"><div className="text-3xl font-black text-red-600">18%</div><div className="text-xs">Negative</div></div></div>
                  <div className="mt-4 text-sm"><span className="font-bold">Top Keywords:</span> good service, staff polite, fast delivery, clean, recommended</div>
                </div>
              )}
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Competitor Tracking <span className="text-xs font-normal">Value ₹12,000/mo</span></h3>
              {!isPro ? <div className="mt-4 p-4 bg-gray-50 border rounded-xl text-sm">🔒 Pro me 2 competitors track - Rating + Review Count every 6hr</div> : <div className="mt-4 space-y-2 text-sm"><div className="flex justify-between border-b pb-2"><span>Your Business</span><span>⭐4.6 (124)</span></div><div className="flex justify-between border-b pb-2"><span>Competitor 1</span><span>⭐4.2 (98)</span></div><div className="flex justify-between"><span>Competitor 2</span><span>⭐4.0 (76)</span></div></div>}
            </div>
          </div>
        )}

        {/* POSTERS TAB */}
        {activeTab === "posters" && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Poster Generator <span className="text-xs font-normal">1080x1080 Value ₹2,000/mo</span></h3>
              <p className="text-sm text-muted-foreground mt-1">Canvas poster business name + stars + review count</p>
              <Button className="mt-4 w-full bg-yellow-400 text-black" onClick={downloadPoster}>Download Poster PNG 1080x1080</Button>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="font-bold flex items-center gap-2"><Share2 className="h-5 w-5" /> Instagram Story/Reel <span className="text-xs font-normal">1080x1920 Value ₹4,000/mo Pro</span></h3>
              <p className="text-sm text-muted-foreground mt-1">Select review → Canvas story download</p>
              {isPro ? <Button className="mt-4 w-full bg-black text-white" onClick={downloadStory}>Download Story 1080x1920</Button> : <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm">🔒 Pro only - Value ₹4k/mo <Link to="/pricing" className="text-blue-600 underline">Upgrade</Link></div>}
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm md:col-span-2">
              <h3 className="font-bold flex items-center gap-2"><QrCode className="h-5 w-5" /> QR Templates <span className="text-xs font-normal">5 Basic Starter | 20+ Premium Growth/Pro Value ₹1,000</span></h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {Array.from({length: isStarter ? 5 : 20}).map((_,i) => (
                  <div key={i} className="border rounded-xl p-3 text-center text-xs">Template {i+1} {i<5 ? "✓" : isStarter ? "🔒" : "✓ Premium"}</div>
                ))}
              </div>
              {isStarter && <p className="mt-3 text-xs text-muted-foreground">Growth lo 20+ Premium Templates + Custom Branding Logo Value ₹1k/mo</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
