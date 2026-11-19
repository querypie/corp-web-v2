"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import styles from "./anniversary.module.css";

export default function AnniversaryMotion({ id }: { id: string }) {
  useEffect(() => {
    const host = document.getElementById(id);
    const hero = host?.querySelector("#intro");
    const canvas = hero?.querySelector("canvas");
    if (!host || !hero || !canvas) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) {
          host.toggleAttribute("data-hero-visible", entry.isIntersecting);
        } else if (entry.isIntersecting) {
          observer.unobserve(canvas);
          void import("./sky").then(({ mountSky }) => {
            if (!cancelled) dispose = mountSky(canvas);
          });
        }
      }
    });
    observer.observe(hero);
    observer.observe(canvas);
    return () => {
      cancelled = true;
      observer.disconnect();
      dispose?.();
      host.removeAttribute("data-hero-visible");
    };
  }, [id]);
  useEffect(() => {
    const surface = document.getElementById(id)?.parentElement;
    if (!surface) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const wheel = matchMedia("(any-pointer: fine) and (any-hover: hover)");
    let scroll: Lenis | undefined;
    let frame = 0;
    let generation = 0;
    const tick = (now: number) => {
      frame = 0;
      scroll?.raf(now);
      if (scroll?.isSmooth) frame = requestAnimationFrame(tick);
    };
    const configure = () => {
      const current = ++generation;
      cancelAnimationFrame(frame);
      frame = 0;
      scroll?.destroy();
      scroll = undefined;
      if (motion.matches || !wheel.matches || document.hidden) return;
      void import("lenis").then(({ default: Lenis }) => {
        if (current !== generation) return;
        scroll = new Lenis({ eventsTarget: surface, smoothWheel: true, lerp: 0.1 });
        scroll.on("virtual-scroll", ({ event }) => {
          if (frame || event.type !== "wheel") return;
          // Prime the clock before the first wheel event after idle.
          scroll?.raf(performance.now());
          frame = requestAnimationFrame(tick);
        });
      });
    };
    configure();
    motion.addEventListener("change", configure);
    wheel.addEventListener("change", configure);
    document.addEventListener("visibilitychange", configure);
    return () => {
      generation++;
      motion.removeEventListener("change", configure);
      wheel.removeEventListener("change", configure);
      document.removeEventListener("visibilitychange", configure);
      cancelAnimationFrame(frame);
      scroll?.destroy();
    };
  }, [id]);
  useEffect(() => {
    const host = document.getElementById(id);
    if (!host) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const layers = (
      [
        // Both tiles are fixed. Subtract the document scroll to preserve their relative speeds.
        ["decade-dust", -0.16, 563],
        ["decade-stars", -0.6, 719],
      ] as const
    ).map(([id, offset, period]) => ({
      node: document.getElementById(id),
      offset,
      period,
    }));
    const sections = Array.from(
      host.querySelectorAll<HTMLElement>("[data-station]"),
    );
    const links = new Map(Array.from(
      host.querySelectorAll<HTMLAnchorElement>(`.${styles.rail} a`),
      (link) => [link.hash.slice(1), link],
    ));
    let geometry = {
      marker: 0,
      end: 0,
      starts: [] as number[],
      anchors: new Map<string, number>(),
    };
    let selected = "intro";
    let previousStarScroll = -1;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      let id = "intro";
      for (let i = 0; i < sections.length; i++) {
        if (geometry.starts[i] > y + geometry.marker) break;
        id = sections[i].id;
      }
      const anchor = window.location.hash.slice(1);
      const anchorY = geometry.anchors.get(anchor);
      if (anchorY !== undefined && Math.abs(y - anchorY) <= 2) id = anchor;
      else if (y >= geometry.end - 2) id = sections[sections.length - 1].id;
      if (id !== selected) {
        links.get(selected)?.removeAttribute("aria-current");
        links.get(id)?.setAttribute("aria-current", "location");
        selected = id;
      }
      const starScroll = motion.matches ? 0 : y;
      if (starScroll === previousStarScroll) return;
      previousStarScroll = starScroll;
      for (const { node, offset, period } of layers) {
        node?.setAttribute(
          "patternTransform",
          `translate(0 ${(starScroll * offset) % period})`,
        );
      }
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      const y = window.scrollY;
      const end = document.documentElement.scrollHeight - innerHeight;
      const starts = sections.map(
        (section) => section.getBoundingClientRect().top + y,
      );
      geometry = {
        marker: innerHeight * 0.52,
        end,
        starts,
        anchors: new Map(
          sections.map((section, i) => {
            const margin =
              parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
            return [section.id, Math.max(0, Math.min(end, starts[i] - margin))];
          }),
        ),
      };
      queue();
    };
    const observer = new ResizeObserver(measure);
    const field = host.parentElement;
    const syncVisibility = () =>
      field?.toggleAttribute("data-starfield-paused", document.hidden);
    if (field) observer.observe(field);
    sections.forEach((section) => observer.observe(section));
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("hashchange", queue);
    window.addEventListener("resize", measure);
    motion.addEventListener("change", queue);
    document.addEventListener("visibilitychange", syncVisibility);
    syncVisibility();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("hashchange", queue);
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", queue);
      document.removeEventListener("visibilitychange", syncVisibility);
      field?.removeAttribute("data-starfield-paused");
    };
  }, [id]);

  return null;
}
