import { useEffect } from "react";

export function useScrollAnimation() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up, .fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    els.forEach((el) => {
      if (!el.classList.contains("visible")) observer.observe(el);
    });
    return () => observer.disconnect();
  });
}
