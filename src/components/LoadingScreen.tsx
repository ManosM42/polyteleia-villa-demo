import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
// Import your logo from assets
import logoImg from "../assets/logo.jpg"; 

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
    
    // 1. At 4.4 seconds (4400ms), trigger the CSS fade-out animation 
    // This gives it 600ms to smoothly fade to completely invisible.
    const startFadeOutTimer = setTimeout(() => {
      setHide(true);
    }, 4400);

    // 2. At exactly 5.0 seconds (4000ms), unmount/remove the element entirely
    const removeScreenTimer = setTimeout(() => {
      setShow(false);
    }, 4000);

    return () => {
      clearTimeout(startFadeOutTimer);
      clearTimeout(removeScreenTimer);
    };
  }, [pathname]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${hide ? "hide" : ""}`} key={key}>
      <div className="loading-logo-container">
        <img 
          src={logoImg} 
          alt="Polyteleia Luxury Living Logo" 
          className="loading-logo-img"
        />
      </div>
      <div className="loading-bar" />
    </div>
  );
}