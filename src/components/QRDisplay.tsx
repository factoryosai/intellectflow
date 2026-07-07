import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function QRDisplay({ url, name }: { url: string; name?: string | null }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: "#4C1D95", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [url]);

  const slugName = (name || "intellectflow-reviews")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const downloadPng = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${slugName}-qr.png`;
    a.click();
  };

  const downloadSvg = async () => {
    try {
      const svg = await QRCode.toString(url, {
        type: "svg",
        margin: 2,
        color: { dark: "#4C1D95", light: "#ffffff" },
      });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `${slugName}-qr.svg`;
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      toast.error("Could not generate SVG");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        {dataUrl ? (
          <img src={dataUrl} alt="Review QR code" className="h-44 w-44" />
        ) : (
          <div className="h-44 w-44 animate-pulse rounded bg-muted" />
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" onClick={downloadPng}>
          <Download className="h-4 w-4" /> PNG
        </Button>
        <Button variant="outline" size="sm" onClick={downloadSvg}>
          <Download className="h-4 w-4" /> SVG
        </Button>
      </div>
    </div>
  );
}
