import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function LoadingScreen() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [show, setShow] = useState(true);
  const [hide, setHide] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setShow(false);
      return;
    }
    setShow(true);
    setHide(false);
    setKey((k) => k + 1);
    const minTimer = setTimeout(() => setHide(true), 1200);
    const maxTimer = setTimeout(() => {
      setHide(true);
      setTimeout(() => setShow(false), 450);
    }, 3000);
    const removeTimer = setTimeout(() => setShow(false), 1700);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  if (!show) return null;
  return (
    <div className={`loading-screen ${hide ? "hide" : ""}`} key={key}>
      <div className="loading-logo">POLYTELEIA</div>
      <div className="loading-sub">Luxury Living</div>
      <div className="loading-bar" />
    </div>
  );
}
