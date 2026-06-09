import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";

function NotFoundComponent() {
  return (
    <div className="site-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 32 }}>
        <h1 className="display" style={{ fontSize: "5rem" }}>404</h1>
        <p style={{ color: "var(--color-stone)", marginTop: 12 }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 24 }}>Go Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="site-bg" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 32, maxWidth: 480 }}>
        <h1 className="display" style={{ fontSize: "2rem" }}>Something went wrong</h1>
        <p style={{ color: "var(--color-stone)", marginTop: 12 }}>Please try again or return home.</p>
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => { router.invalidate(); reset(); }} className="btn btn-filled">Try again</button>
          <a href="/" className="btn btn-outline">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "POLYTELEIA Luxury Living — Villa in Elia, Crete" },
      { name: "description", content: "A private four-bedroom luxury villa with pool in Elia, Heraklion, Crete. Marble, brass, and warm wood — designed to feel like home." },
      { name: "author", content: "Polyteleia" },
      { property: "og:title", content: "POLYTELEIA Luxury Living" },
      { property: "og:description", content: "A luxury retreat in the heart of Crete." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap",
      },
    ],
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
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function LayoutWrapper() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <Outlet />;
  }

  const isHome = pathname === "/";
  const [showNavbar, setShowNavbar] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setShowNavbar(true);
      return;
    }

    const handleScroll = () => {
      const vh = window.innerHeight;
      if (window.scrollY > vh * 0.35) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <div
      className="site-bg"
      style={isHome ? { background: "transparent", backgroundColor: "transparent" } : undefined}
    >
      <Navbar isVisible={showNavbar} isHome={isHome} />
      <Outlet />
      <Footer />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <LoadingScreen />
        <LayoutWrapper />
      </LanguageProvider>
    </QueryClientProvider>
  );
}