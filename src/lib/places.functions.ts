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
}

export const searchPlaces = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SearchInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) throw new Error("Business search is not configured yet.");

    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({ input: data.query }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Places autocomplete failed [${res.status}]: ${body}`);
      throw new Error("Could not search businesses right now.");
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
    return { predictions };
  });

export const getPlaceDetails = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DetailsInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) throw new Error("Business search is not configured yet.");

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(data.placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "id,displayName,formattedAddress,location,googleMapsUri",
        },
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Place details failed [${res.status}]: ${body}`);
      throw new Error("Could not load business details.");
    }

    const json = await res.json();
    const details: PlaceDetails = {
      placeId: json.id ?? data.placeId,
      name: json.displayName?.text ?? "",
      address: json.formattedAddress ?? "",
      lat: json.location?.latitude ?? null,
      lng: json.location?.longitude ?? null,
      // Prefetch a sensible default Google review link; owner can override.
      googleReviewLink: `https://search.google.com/local/writereview?placeid=${json.id ?? data.placeId}`,
    };
    return { details };
  });
