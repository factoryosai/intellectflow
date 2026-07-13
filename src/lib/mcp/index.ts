import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listBusinessesTool from "./tools/list-businesses";
import getBusinessStatsTool from "./tools/get-business-stats";

// The OAuth issuer must be the direct Supabase host, not the .lovable.cloud proxy.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "intellectflow-reviews-mcp",
  title: "IntellectFlow Reviews MCP",
  version: "0.1.0",
  instructions:
    "Tools for IntellectFlow Reviews. Use `list_businesses` to see the signed-in user's businesses, then `get_business_stats` with a business id for review and subscription details.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listBusinessesTool, getBusinessStatsTool],
});
