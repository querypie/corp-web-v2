"use client";

import { useEffect } from "react";

/* 뷰포트에 진입한 [data-reveal] 요소에 is-visible 클래스를 추가하는 전역 옵저버 */
export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const observeRevealElements = (root: ParentNode = document) => {
      const elements = root.querySelectorAll("[data-reveal]");
      elements.forEach((element) => {
        if (!(element instanceof HTMLElement)) return;
        if (element.classList.contains("is-visible")) return;
        observer.observe(element);
      });
    };

    observeRevealElements();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;

          if (node.matches("[data-reveal]")) {
            observeRevealElements(node.parentElement ?? document);
            return;
          }

          observeRevealElements(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
