"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import styles from "./anniversary.module.css";

export default function AnniversaryMotion({ id }: { id: string }) {
  useEffect(() => {
    const canvas = document.getElementById(id)?.querySelector<HTMLCanvasElement>("#intro canvas");
    if (!canvas) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.unobserve(canvas);
      void import("./sky").then(({ mountSky }) => {
        if (!cancelled) dispose = mountSky(canvas);
      });
    });
    observer.observe(canvas);
    return () => {
      cancelled = true;
      observer.disconnect();
      dispose?.();
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
        scroll = new Lenis({
          eventsTarget: surface,
          smoothWheel: true,
          duration: 0.34,
          easing: (progress) => 1 - (1 - progress) ** 3,
        });
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
    const touch = matchMedia("(pointer: coarse)");
    const field = host.parentElement;
    const layers = Array.from(
      field?.querySelectorAll<HTMLElement>("[data-star-period][data-star-speed]") ?? [],
      (node) => ({ node, speed: Number(node.dataset.starSpeed), period: Number(node.dataset.starPeriod) }),
    );
    const sections = Array.from(
      host.querySelectorAll<HTMLElement>("[data-station]"),
    );
    const stations = new Map(sections.map((section) => [section.id, section]));
    const rail = host.querySelector(`.${styles.rail}`);
    const buttons = new Map(Array.from(
      rail?.querySelectorAll<HTMLButtonElement>("[data-station-target]") ?? [],
      (button) => [button.dataset.stationTarget, button],
    ));
    let geometry = {
      marker: 0,
      end: 0,
      starts: [] as number[],
      anchors: new Map<string, number>(),
    };
    let selected = "intro";
    let requestedStation = "";
    let starScroll: number | undefined;
    let lastStarFrame: number | undefined;
    let frame = 0;
    const update = (now: number) => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      let id = "intro";
      for (let i = 0; i < sections.length; i++) {
        if (geometry.starts[i] > y + geometry.marker) break;
        id = sections[i].id;
      }
      const anchorY = geometry.anchors.get(requestedStation);
      if (anchorY !== undefined && Math.abs(y - anchorY) <= 2) id = requestedStation;
      else if (y >= geometry.end - 2) id = sections[sections.length - 1].id;
      if (id !== selected) {
        buttons.get(selected)?.removeAttribute("aria-current");
        buttons.get(id)?.setAttribute("aria-current", "location");
        selected = id;
      }
      const target = motion.matches ? 0 : y;
      let next = target;
      if (touch.matches && !motion.matches && starScroll !== undefined && Math.abs(target - starScroll) > 0.12) {
        // Blend between native touch scroll samples with the same timing at any refresh rate.
        const elapsed = lastStarFrame === undefined ? 1000 / 60 : now - lastStarFrame;
        next = target + (starScroll - target) * Math.exp(-elapsed / 34);
        lastStarFrame = now;
        frame = requestAnimationFrame(update);
      } else {
        lastStarFrame = undefined;
      }
      if (starScroll !== next) {
        starScroll = next;
        for (const { node, speed, period } of layers) {
          // Wrap by a full tile so the next copy is already visible at the seam.
          node.style.transform = `translate3d(0, ${-((next * speed) % period)}px, 0)`;
        }
      }
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onRailClick = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>("[data-station-target]");
      const station = button?.dataset.stationTarget;
      if (!station) return;
      requestedStation = station;
      stations.get(station)?.scrollIntoView();
      queue();
    };
    const followLegacyFragment = () => {
      const id = window.location.hash.slice(1);
      const station = stations.get(id);
      if (!station) return;
      requestedStation = id;
      const { pathname, search } = window.location;
      window.history.replaceState(window.history.state, "", pathname + search);
      station.scrollIntoView({ behavior: "instant" });
      queue();
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
    const syncVisibility = () =>
      field?.toggleAttribute("data-starfield-paused", document.hidden);
    if (field) observer.observe(field);
    sections.forEach((section) => observer.observe(section));
    measure();
    followLegacyFragment();
    rail?.addEventListener("click", onRailClick);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("hashchange", followLegacyFragment);
    window.addEventListener("resize", measure);
    motion.addEventListener("change", queue);
    document.addEventListener("visibilitychange", syncVisibility);
    syncVisibility();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      rail?.removeEventListener("click", onRailClick);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("hashchange", followLegacyFragment);
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", queue);
      document.removeEventListener("visibilitychange", syncVisibility);
      field?.removeAttribute("data-starfield-paused");
    };
  }, [id]);

  useEffect(() => {
    const archive = document.getElementById(id)?.querySelector(`.${styles.archive}`);
    if (!archive || typeof IntersectionObserver === "undefined") return;

    const pending = Array.from(archive.children).filter((element) => {
      const { top, bottom } = element.getBoundingClientRect();
      return bottom <= 0 || top >= window.innerHeight;
    });
    // Give each item room to appear inside the viewport, even at autoplay's slow pace.
    const observer = new IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.setAttribute("data-reveal", "entered");
        observer.unobserve(target);
      }
    }, { rootMargin: "0px 0px -104px" });

    for (const element of pending) {
      element.setAttribute("data-reveal", "pending");
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
      for (const element of pending) element.removeAttribute("data-reveal");
    };
  }, [id]);

  return null;
}
