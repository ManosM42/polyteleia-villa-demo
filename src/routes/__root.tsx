import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

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
      setShowNavbar(window.scrollY > window.innerHeight * 0.35);
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