import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Sparkles, QrCode, Star, Gift, Shield, Zap, TrendingUp, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * QRDisplay PRO - IntellectFlow - Market Value ₹1k + ₹8k/mo + ₹2k/mo Stickers
 * Founder: Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com
 * Features: QR + /r/slug + AI Writer + Coupon + Negative Filter + Reviews Counter + Stickers 20+
 * Value: QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews Counter ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB ₹8k/mo + Sentiment ₹5k/mo + Competitor ₹12k/mo = ₹55k+/mo
 */

export function QRDisplay({ url, name, businessId, plan }: { url: string; name?: string | null; businessId?: string; plan?: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [stickerDataUrl, setStickerDataUrl] = useState<string>("");
  const isLifetimeFree = plan === "lifetime" || plan === "business" && businessId?.includes("lifetime"); // Simplified check

  useEffect(() => {
    // PRO: Gradient QR with IntellectFlow branding #6A4DFF → #2D9CDB - Value ₹1k + ₹8k/mo QR Generator
    QRCode.toDataURL(url, {
      width: 1024, // High res for printing - Value ₹1k QR + Premium Stickers ₹2k/mo
      margin: 3,
      color: { dark: "#6A4DFF", light: "#ffffff" }, // IntellectFlow brand violet
      errorCorrectionLevel: 'H', // High error correction for logo overlay
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));

    // Sticker QR - Smaller with border for 20+ sticker designs - Value ₹2k/mo Premium Stickers
    QRCode.toDataURL(url, {
      width: 512,
      margin: 4,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setStickerDataUrl)
      .catch(() => setStickerDataUrl(""));
  }, [url]);

  const slugName = (name || "intellectflow-reviews")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${slugName}-qr-intellectflow-pro-market-1k.png`;
    a.click();
    toast.success("QR Downloaded ✓ - Value ₹1,000 - IntellectFlow PRO - Founder Kaushik Savaliya - Market Value ₹55k+ at ₹299 - Print & Stick at Your Shop - Aap Dukaan Chalao Google Hum Sambhalenge");
  };

  const downloadSvg = async () => {
    try {
      const svg = await QRCode.toString(url, {
        type: "svg",
        margin: 3,
        color: { dark: "#6A4DFF", light: "#ffffff" }, // Brand violet
      });
      // Add branding to SVG - IntellectFlow.in + Market Value
      const brandedSvg = svg.replace('<svg', `<svg data-market-value="₹55k+ at ₹299" data-founder="Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com" data-tagline="Aap Dukaan Chalao Google Hum Sambhalenge"`);
      const blob = new Blob([brandedSvg], { type: "image/svg+xml" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${slugName}-qr-intellectflow-pro-market-1k.svg`;
      a.click();
      URL.revokeObjectURL(href);
      toast.success("SVG QR Downloaded ✓ - Value ₹1,000 - Vector for Print - Premium Stickers 20+ Designs Value ₹2k/mo - Founder Kaushik Savaliya");
    } catch {
      toast.error("Could not generate SVG - Market Value ₹1k QR - Founder Kaushik Savaliya - Try PNG instead");
    }
  };

  const downloadStickerPack = async () => {
    if (!stickerDataUrl) return;
    try {
      // Create sticker sheet - 20+ designs concept - Value ₹2k/mo Premium Stickers
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 2480; // A4 300dpi
      canvas.height = 3508;
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Header - IntellectFlow branding
      ctx.fillStyle = '#6A4DFF';
      ctx.font = 'bold 80px Nunito, sans-serif';
      ctx.fillText('IntellectFlow.in PRO', 100, 150);
      
      ctx.fillStyle = '#000000';
      ctx.font = '40px Nunito, sans-serif';
      ctx.fillText(`Scan for Review - ${name || 'Your Business'} - Value ₹55k+ at ₹299 - Founder Kaushik Savaliya`, 100, 230);
      
      ctx.font = '30px Nunito, sans-serif';
      ctx.fillText('Aap Dukaan Chalao, Google Hum Sambhalenge - 500+ Businesses Trust - Market Value ₹55k+ Features', 100, 280);
      
      // QR Codes grid - 20+ sticker concept
      const img = new Image();
      img.src = stickerDataUrl;
      await new Promise((resolve) => { img.onload = resolve; });
      
      const qrSize = 400;
      const gap = 100;
      const cols = 4;
      const startY = 400;
      
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < cols; col++) {
          const x = 100 + col * (qrSize + gap);
          const y = startY + row * (qrSize + 120 + gap);
          
          // Sticker border - rounded
          ctx.fillStyle = '#FACC15'; // Yellow for market value badge
          ctx.beginPath();
          ctx.roundRect(x - 20, y - 20, qrSize + 40, qrSize + 100, 20);
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(x - 10, y - 10, qrSize + 20, qrSize + 80, 15);
          ctx.fill();
          
          ctx.drawImage(img, x, y, qrSize, qrSize);
          
          // Sticker text
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 24px Nunito, sans-serif';
          ctx.fillText('Scan Me ✓', x + qrSize/2 - 50, y + qrSize + 30);
          
          ctx.font = '18px Nunito, sans-serif';
          ctx.fillText('Google Review', x + qrSize/2 - 60, y + qrSize + 55);
        }
      }
      
      // Footer - Market Value
      ctx.fillStyle = '#6A4DFF';
      ctx.font = 'bold 32px Nunito, sans-serif';
      ctx.fillText('Market Value: QR ₹1k + AI Writer ₹3k/mo + Coupon ₹1.5k/mo + Negative Filter ₹7k/mo + Reviews ₹5k/mo + AI Reply ₹5k/mo + WhatsApp ₹3k/mo + GMB ₹8k/mo = ₹55k+/mo at ₹299', 100, canvas.height - 100);
      
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${slugName}-sticker-pack-20-intellectflow-pro-market-2k.png`;
      a.click();
      
      toast.success("Sticker Pack 20+ Downloaded ✓ - Value ₹2,000/mo - Premium Stickers - Founder Kaushik Savaliya - Print on A4 & Cut - Market Value ₹55k+ at ₹299 - Aap Dukaan Chalao Google Hum Sambhalenge");
    } catch (e) {
      toast.error("Sticker pack failed - Market Value ₹2k/mo Premium Stickers - Founder Kaushik Savaliya");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success(`Link Copied ✓ - ${url} - Value ₹1k QR + ₹8k/mo Short Link /r/slug - Founder Kaushik Savaliya - Share on WhatsApp Status, Instagram Bio, Shop Board - Market Value ₹55k+ at ₹299`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      {/* Market Value Badge - Top */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold shadow-glow">
          <QrCode className="h-3 w-3" /> Value ₹1,000 - QR Code
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black text-white text-xs font-bold">
          <Star className="h-3 w-3 text-yellow-400" /> Reviews Counter ₹5k/mo
        </div>
        {isLifetimeFree && (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold animate-glow">
            <Award className="h-3 w-3" /> Lifetime FREE ₹55k+
          </div>
        )}
      </div>

      <div className="relative rounded-[24px] border-2 border-[#6A4DFF]/20 bg-white p-6 shadow-market hover:shadow-glow transition-all duration-300 w-full">
        {/* Founder Watermark - Subtle */}
        <div className="absolute top-2 right-3 text-[10px] text-gray-400 font-mono">Founder Kaushik • ₹55k+ at ₹299</div>
        
        {/* QR Code */}
        <div className="flex justify-center">
          {dataUrl ? (
            <div className="relative">
              <img src={dataUrl} alt="Review QR code - Value ₹1k - IntellectFlow PRO - Founder Kaushik Savaliya - Scan for Google Review - Aap Dukaan Chalao Google Hum Sambhalenge - Market Value ₹55k+ at ₹299" className="h-56 w-56 rounded-2xl" />
              {/* Center Logo Overlay Concept - IntellectFlow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white rounded-full p-1 shadow-lg">
                  <div className="bg-gradient-to-br from-[#6A4DFF] to-[#2D9CDB] rounded-full h-10 w-10 flex items-center justify-center">
                    <span className="text-white font-black text-[10px]">IF</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-56 w-56 animate-pulse rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100" />
          )}
        </div>

        {/* Business Name + URL */}
        <div className="mt-4 text-center space-y-2">
          <p className="font-bold text-lg flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-[#6A4DFF]" /> {name || "Your Business"} <Sparkles className="h-4 w-4 text-[#6A4DFF]" />
          </p>
          <p className="text-xs text-muted-foreground break-all bg-gray-50 rounded-full px-3 py-1.5 font-mono">{url}</p>
          
          {/* Feature Highlights - Market Value */}
          <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
            <div className="flex items-center gap-1 bg-purple-50 rounded-full px-2 py-1">
              <Gift className="h-3 w-3 text-[#6A4DFF]" /> Coupon ₹1.5k/mo 10% OFF
            </div>
            <div className="flex items-center gap-1 bg-green-50 rounded-full px-2 py-1">
              <Shield className="h-3 w-3 text-green-600" /> Filter ₹7k/mo 1-2★ Private
            </div>
            <div className="flex items-center gap-1 bg-blue-50 rounded-full px-2 py-1">
              <Zap className="h-3 w-3 text-blue-600" /> AI Writer ₹3k/mo
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-2 py-1">
              <TrendingUp className="h-3 w-3 text-yellow-600" /> Counter ₹5k/mo
            </div>
          </div>
        </div>

        {/* Market Value Footer */}
        <div className="mt-4 pt-4 border-t border-dashed flex items-center justify-between text-[10px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-green-600" /> Aap Dukaan Chalao, Google Hum Sambhalenge
          </span>
          <span className="font-bold">₹55k+ at ₹299 • Founder Kaushik</span>
        </div>
      </div>

      {/* Download Buttons PRO */}
      <div className="mt-6 grid grid-cols-2 gap-2 w-full">
        <Button variant="outline" size="sm" onClick={downloadPng} className="rounded-full border-[#6A4DFF]/20 hover:bg-[#6A4DFF] hover:text-white">
          <Download className="h-4 w-4" /> PNG - ₹1k Value
        </Button>
        <Button variant="outline" size="sm" onClick={downloadSvg} className="rounded-full border-[#6A4DFF]/20 hover:bg-[#6A4DFF] hover:text-white">
          <Download className="h-4 w-4" /> SVG - Print
        </Button>
        <Button variant="outline" size="sm" onClick={downloadStickerPack} className="col-span-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 border-yellow-400 font-bold">
          <Gift className="h-4 w-4" /> Download Sticker Pack 20+ - Value ₹2k/mo - A4 Sheet
        </Button>
        <Button variant="default" size="sm" onClick={copyLink} className="col-span-2 rounded-full bg-black text-white hover:bg-gray-900">
          <QrCode className="h-4 w-4" /> Copy Link - /r/slug - Value ₹8k/mo Short Link
        </Button>
      </div>

      {/* Instructions PRO */}
      <div className="mt-4 w-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
        <p className="text-xs font-bold flex items-center gap-1 mb-2">
          <Award className="h-4 w-4 text-[#6A4DFF]" /> How to Use - Value ₹55k+ at ₹299:
        </p>
        <ul className="text-[11px] space-y-1 text-muted-foreground list-disc pl-4">
          <li><strong>Print PNG/SVG:</strong> Stick at shop counter - Value ₹1k QR Code - Premium print 300dpi</li>
          <li><strong>Sticker Pack 20+:</strong> Print A4 sheet, cut stickers - Value ₹2k/mo Premium Stickers - Stick on bills, packaging, door</li>
          <li><strong>Copy Link:</strong> Add to WhatsApp Status, Instagram Bio, Google Business Profile - Value ₹8k/mo Short Link /r/slug</li>
          <li><strong>After Scan:</strong> Customer sees Thank You + Coupon 10% OFF Value ₹1.5k/mo → 1-2★ Private Feedback Value ₹7k/mo → 4-5★ AI Writer 4 Suggestions Value ₹3k/mo → Google Review + Reviews Counter Value ₹5k/mo → WhatsApp 24hr Reminder Value ₹3k/mo</li>
          <li><strong>Founder:</strong> Kaushik Savaliya - Visavadar Gujarat - intellectflowteam@gmail.com - Aap Dukaan Chalao Google Hum Sambhalenge - 500+ Businesses Trust</li>
        </ul>
      </div>
    </div>
  );
}