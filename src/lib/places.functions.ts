import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SearchInput = z.object({ query: z.string().min(1).max(200) });
const DetailsInput = z.object({ placeId: z.string().min(1).max(400) });

export interface PlacePrediction {
  placeId: string;
  primary: string;
  secondary: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  googleReviewLink: string;
  phone: string;
  website: string;
  rating: number | null;
  userRatingsTotal: number | null;
  logoUrl: string | null;
  description: string | null; // NEW - For AI Writer + GMB Post Value ₹8k/mo
  googleMapsUri: string | null; // NEW - For review link
  marketValue: string; // NEW - For UI
}

function domainFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export const searchPlaces = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SearchInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("Business search is not configured yet. Add GOOGLE_PLACES_API_KEY in .env - Value ₹1k feature");

    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({ 
        input: data.query,
        // Bias to India for better results - Founder Kaushik Savaliya - Intellectflow.in
        locationBias: {
          circle: {
            center: { latitude: 23.0225, longitude: 72.5714 }, // Ahmedabad center
            radius: 500000 // 500km
          }
        }
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Places autocomplete failed [${res.status}]: ${body} - Market Value ₹1k feature`);
      throw new Error("Could not search businesses right now. Check API key - Value ₹1k");
    }

    const json = await res.json();
    const suggestions = (json?.suggestions ?? []) as any[];
    const predictions: PlacePrediction[] = suggestions
      .filter((s) => s.placePrediction)
      .map((s) => ({
        placeId: s.placePrediction.placeId as string,
        primary:
          s.placePrediction.structuredFormat?.mainText?.text ??
          s.placePrediction.text?.text ??
          "",
        secondary:
          s.placePrediction.structuredFormat?.secondaryText?.text ?? "",
      }));
    return { predictions, marketValue: "₹1,000 - Place ID Search Feature" };
  });

export const getPlaceDetails = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DetailsInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("Business search is not configured yet. Add GOOGLE_PLACES_API_KEY");

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(data.placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "id,displayName,formattedAddress,location,googleMapsUri,internationalPhoneNumber,nationalPhoneNumber,websiteUri,rating,userRatingCount,editorialSummary,primaryTypeDisplayName,reviews",
        },
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Place details failed [${res.status}]: ${body}`);
      throw new Error("Could not load business details. Value ₹1k feature");
    }

    const json = await res.json();
    const website: string = json.websiteUri ?? "";
    const domain = website ? domainFromUrl(website) : null;
    const logoKey = process.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY;
    
    // Extract description for AI Writer + GMB Post - Value ₹8k/mo
    const description = json.editorialSummary?.text || json.primaryTypeDisplayName?.text || "";
    
    const details: PlaceDetails = {
      placeId: json.id ?? data.placeId,
      name: json.displayName?.text ?? "",
      address: json.formattedAddress ?? "",
      lat: json.location?.latitude ?? null,
      lng: json.location?.longitude ?? null,
      googleMapsUri: json.googleMapsUri ?? null,
      googleReviewLink: `https://search.google.com/local/writereview?placeid=${json.id ?? data.placeId}`,
      phone: json.internationalPhoneNumber ?? json.nationalPhoneNumber ?? "",
      website,
      rating: typeof json.rating === "number" ? json.rating : null,
      userRatingsTotal: typeof json.userRatingCount === "number" ? json.userRatingCount : null,
      logoUrl: domain && logoKey ? `https://img.logo.dev/${domain}?token=${logoKey}&size=200&format=png` : null,
      description: description || null,
      marketValue: "₹8,000/mo - QR + AI Writer + Review Page + Description for GMB Value ₹8k/mo",
    };
    
    return { details };
  });

// ============ NEW PRO FUNCTIONS - For Admin & Dashboard ============

// Get competitor details for tracking - Value ₹12k/mo - Pro only
export const getCompetitorDetails = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ placeId: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("API not configured");

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(data.placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,formattedAddress",
        },
      },
    );

    if (!res.ok) throw new Error("Could not load competitor");
    const json = await res.json();
    
    return {
      placeId: json.id,
      name: json.displayName?.text,
      address: json.formattedAddress,
      rating: json.rating,
      reviewCount: json.userRatingCount,
      marketValue: "₹12,000/mo - Competitor Tracking Pro Feature - Founder Kaushik Savaliya",
    };
  });

// Generate /r/slug review link - Value ₹500
export const generateReviewLink = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ slug: z.string(), placeId: z.string().optional(), customLink: z.string().optional() }).parse(input))
  .handler(async ({ data }) => {
    const origin = process.env.VITE_APP_URL || "https://intellectflow.in";
    
    // Priority: Custom link > Place ID link > Slug link
    if (data.customLink) {
      return { reviewLink: data.customLink, type: "custom", marketValue: "₹500 - Custom Review Link" };
    }
    if (data.placeId) {
      return { 
        reviewLink: `https://search.google.com/local/writereview?placeid=${data.placeId}`, 
        type: "google",
        shortLink: `${origin}/r/${data.slug}`,
        marketValue: "₹500 - Google Review Direct Link + Short Link /r/slug Value ₹1k" 
      };
    }
    return { 
      reviewLink: `${origin}/r/${data.slug}`, 
      type: "internal",
      marketValue: "₹1,000 - Short Link QR Feature" 
    };
  });