import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-black">404</h1>
        <h2 className="mt-4 text-lg font-bold">Page not found - Value ₹55k+ at ₹299</h2>
        <p className="mt-2 text-sm text-zinc-500">Google rating 4.8★ journey starts here</p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link to="/" className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold">Go home - ₹299</Link>
          <Link to="/onboarding" className="px-6 py-2 border rounded-full text-sm font-bold">Start Free</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "root" }); }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcf6ef] px-4">
      <div className="max-w-[420px] w-full bg-white rounded-[20px] border p-6 text-center shadow-xl">
        <div className="w-10 h-10 bg-black text-white rounded-full grid place-items-center font-black mx-auto">!</div>
        <h1 className="text-[18px] font-black mt-4">Market Value ₹55k+ Error - Founder Kaushik Fixing</h1>
        <p className="text-[13px] text-zinc-600 mt-2">This page didn't load - Aap Dukaan Chalao, Google Hum Sambhalenge - Something went wrong.</p>
        <p className="text-[11px] text-zinc-400 mt-2 font-mono break-all">{String(error?.message || error).slice(0,150)}</p>
        <div className="mt-5 flex gap-2 justify-center">
          <button onClick={() => { router.invalidate(); reset(); }} className="px-5 py-2 bg-black text-white rounded-full text-sm font-bold">Try again</button>
          <a href="/" className="px-5 py-2 bg-zinc-100 rounded-full text-sm font-bold">Go home</a>
        </div>
        <p className="text-[10px] text-zinc-400 mt-4">intellectflowteam@gmail.com • Visavadar 362130 • ₹55k+ at ₹299</p>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IntellectFlow.in PRO - Google Review Automation at ₹299 - Founder Kaushik Savaliya" },
      { name: "description", content: "Google Review Automation at ₹299 - QR + AI Writer + Negative Filter + Coupon + GMB - Founder Kaushik Savaliya - 500+ Businesses - Visavadar Gujarat" },
    ],
    links: [{ rel: "stylesheet", href: appCss }, { rel: "icon", href: "/favicon.ico" }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* HEADER REMOVED - No top banner - Clean as you requested */}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}