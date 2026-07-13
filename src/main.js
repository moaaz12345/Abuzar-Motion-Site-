import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Scrollbar from "smooth-scrollbar";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     1. AE LOADING SCREEN -- first visit only (sessionStorage)
     ============================================================ */
  const loader       = document.getElementById("ae-loader");
  const loaderBar    = document.getElementById("ae-loader-bar");
  const loaderStatus = document.getElementById("ae-loader-status");
  const loaderFrame  = document.getElementById("ae-loader-frame");
  const hasVisited   = sessionStorage.getItem("am-visited");

  if (loader && loaderBar && !hasVisited) {
    sessionStorage.setItem("am-visited", "1");
    const messages = [
      "Initializing composition...",
      "Loading assets...",
      "Building timeline...",
      "Rendering frame 1 of 1...",
      "Ready."
    ];
    let progress = 0;
    let msgIdx = 0;
    const totalFrames = 60;

    const interval = setInterval(() => {
      progress += Math.random() * 4 + 2;
      if (progress > 100) progress = 100;
      loaderBar.style.width = progress + "%";
      const frame = Math.round((progress / 100) * totalFrames);
      if (loaderFrame) loaderFrame.textContent = `Frame ${frame} / ${totalFrames}`;
      const newMsgIdx = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
      if (newMsgIdx !== msgIdx) {
        msgIdx = newMsgIdx;
        if (loaderStatus) loaderStatus.textContent = messages[msgIdx];
      }
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add("is-wiping");
          setTimeout(() => { loader.classList.add("done"); animateHeroEntrance(); }, 600);
        }, 300);
      }
    }, 60);
  } else {
    if (loader) loader.classList.add("done");
    animateHeroEntrance();
  }


  /* ============================================================
     2. SCROLL SETUP (smooth-scrollbar desktop only)
     ============================================================ */
  const scroller = document.querySelector("#scroller");
  const isMobile = window.innerWidth <= 900;
  let bodyScrollBar;

  if (!isMobile) {
    bodyScrollBar = Scrollbar.init(scroller, {
      damping: 0.05,
      delegateTo: document,
    });
  } else {
    if (scroller) {
      scroller.style.height = "auto";
      scroller.style.overflow = "visible";
    }
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  }

  // Anchor scroll links
  document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        if (!isMobile && bodyScrollBar) {
          const offset = targetEl.getBoundingClientRect().top + bodyScrollBar.scrollTop - 100;
          bodyScrollBar.scrollTo(0, offset, 1000);
        } else {
          const offset = targetEl.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }
    });
  });

  // ScrollTrigger proxy for smooth-scrollbar
  if (!isMobile && bodyScrollBar) {
    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length) bodyScrollBar.scrollTop = value;
        return bodyScrollBar.scrollTop;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: scroller.style.transform ? "transform" : "fixed"
    });
    bodyScrollBar.addListener(ScrollTrigger.update);
    ScrollTrigger.defaults({ scroller: scroller });
  }

  /* ============================================================
     3. HERO ENTRANCE ANIMATION
     ============================================================ */
  function animateHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".hero-new__eyebrow", { opacity: 1, y: 0, duration: 0.7, delay: 0.1 }, "start")
      .fromTo(".hero-line--outline",
        { opacity: 0, y: 80, skewY: 5 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.9 }, "start+=0.2")
      .fromTo(".hero-line--filled",
        { opacity: 0, y: 80, skewY: 5 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.9 }, "start+=0.45")
      .to(".hero-new__sub", { opacity: 1, y: 0, duration: 0.6 }, "start+=0.8")
      .to(".hero-new__ctas", { opacity: 1, y: 0, duration: 0.6 }, "start+=1.0");

    // Floating tags stagger in
    const tags = document.querySelectorAll(".hero-tag");
    tags.forEach((tag, i) => {
      gsap.fromTo(tag,
        { opacity: 0, y: 18, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 0.65, delay: 1.1 + i * 0.12, ease: "back.out(1.5)" }
      );
    });

    // Subtle float loop
    tags.forEach((tag, i) => {
      gsap.to(tag, {
        y: "random(-7, 7)",
        duration: "random(2.5, 4)",
        repeat: -1, yoyo: true, ease: "sine.inOut",
        delay: 1.8 + i * 0.25
      });
    });
  }

  /* ============================================================
     4. CUSTOM CURSOR -- clean dot + expanding ring
     ============================================================ */
  if (!isMobile) {
    const blade = document.getElementById("cursor-blade");
    const cursorGlow = document.querySelector(".cursor-glow");
    let prevX = window.innerWidth / 2;

    window.addEventListener("mousemove", (e) => {
      gsap.to(blade, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power2.out" });
      // Ring follows with slight lag for trailing effect
      gsap.to(".cursor-blade__dot", { x: e.clientX, y: e.clientY, duration: 0.25, ease: "power2.out" });
      gsap.to(cursorGlow, { x: e.clientX, y: e.clientY, duration: 0.8, ease: "power2.out" });
      const tilt = Math.max(-12, Math.min(12, (e.clientX - prevX) * 0.5));
      gsap.to(blade, { rotation: tilt, duration: 0.4, ease: "power2.out" });
      prevX = e.clientX;
    });

    document.querySelectorAll("a, button, .skill-card, .testimonial-card, .video-card, .video-item").forEach(el => {
      el.addEventListener("mouseenter", () => blade.classList.add("is-hovering"));
      el.addEventListener("mouseleave", () => blade.classList.remove("is-hovering"));
    });

    window.addEventListener("mousedown", () => blade.classList.add("is-clicking"));
    window.addEventListener("mouseup",   () => blade.classList.remove("is-clicking"));
  }


  /* ============================================================
     5. THEME TOGGLE
     ============================================================ */
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon   = document.getElementById("theme-icon");
  const htmlEl      = document.documentElement;

  // Persist theme
  const savedTheme = localStorage.getItem("am-theme") || "dark";
  htmlEl.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    htmlEl.setAttribute("data-theme", next);
    localStorage.setItem("am-theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === "dark" ? "ph-fill ph-moon" : "ph-fill ph-sun";
  }

  /* ============================================================
     6. SCROLL-TRIGGERED SECTION ANIMATIONS
     ============================================================ */
  // About section
  if (document.querySelector(".about-section")) {
    gsap.from(".about-text", {
      y: 80, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".about-section", start: "top 80%" }
    });
    gsap.from(".about-image-wrapper", {
      y: 120, opacity: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: ".about-section", start: "top 75%" }
    });
  }

  // Skills
  if (document.querySelector(".experience-section")) {
    gsap.from(".experience-section .section-title", {
      y: 40, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".experience-section", start: "top 80%" }
    });
    gsap.from(".skill-card", {
      y: 80, opacity: 0, duration: 0.9, stagger: 0.18, ease: "power3.out",
      scrollTrigger: { trigger: ".skills-grid", start: "top 85%" }
    });
  }

  // Preview CTA
  if (document.querySelector(".preview-cta-section")) {
    gsap.from(".preview-cta-section", {
      opacity: 0, y: 50, duration: 1.5, ease: "power4.out",
      scrollTrigger: { trigger: ".preview-cta-section", start: "top 80%" }
    });
  }

  // Contact
  if (document.querySelector(".contact-section")) {
    gsap.from(".contact-section", {
      scale: 0.95, opacity: 0, duration: 1.5, ease: "power4.out",
      scrollTrigger: { trigger: ".contact-section", start: "top 80%" }
    });
  }

  /* ============================================================
     7. WORKS PAGE ANIMATIONS
     ============================================================ */
  if (document.querySelector(".works-page-header")) {
    gsap.from(".works-page-header", { y: 50, opacity: 0, duration: 1.2, ease: "power4.out" });
  }

  const videoCards = document.querySelectorAll(".video-card");
  videoCards.forEach((card) => {
    gsap.from(card, {
      y: 100, scale: 0.9, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 85%" }
    });
  });

  /* ============================================================
     8. VIDEO CONTROLS
     ============================================================ */
  videoCards.forEach(card => {
    const video   = card.querySelector("video");
    const playBtn = card.querySelector(".play-pause");
    const muteBtn = card.querySelector(".mute-unmute");
    const fsBtn   = card.querySelector(".fullscreen");
    if (!video) return;

    playBtn?.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playBtn.innerHTML = "<i class=\"ph-fill ph-pause\"></i>";
      } else {
        video.pause();
        playBtn.innerHTML = "<i class=\"ph-fill ph-play\"></i>";
      }
    });

    muteBtn?.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted
        ? "<i class=\"ph-fill ph-speaker-slash\"></i>"
        : "<i class=\"ph-fill ph-speaker-high\"></i>";
    });

    fsBtn?.addEventListener("click", () => {
      (video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen)?.call(video);
    });
  });

  /* ============================================================
     9. VOICE REVIEWS
     ============================================================ */
  const setupVoiceCard = (btnId, audioId) => {
    const btn   = document.getElementById(btnId);
    const audio = document.getElementById(audioId);
    if (!btn || !audio) return;
    const card = btn.closest(".voice-card");
    const icon = btn.querySelector("i");

    btn.addEventListener("click", () => {
      if (audio.paused) {
        document.querySelectorAll("audio").forEach(a => {
          if (!a.paused && a !== audio) {
            a.pause();
            a.closest(".voice-card")?.classList.remove("is-playing");
            a.closest(".voice-card")?.querySelector(".audio-play-btn i")
              && (a.closest(".voice-card").querySelector(".audio-play-btn i").className = "ph-fill ph-play");
          }
        });
        audio.play();
        icon.className = "ph-fill ph-pause";
        card?.classList.add("is-playing");
      } else {
        audio.pause();
        icon.className = "ph-fill ph-play";
        card?.classList.remove("is-playing");
      }
    });

    audio.addEventListener("ended", () => {
      icon.className = "ph-fill ph-play";
      card?.classList.remove("is-playing");
    });
  };

  setupVoiceCard("giovaani-play",     "giovaani-audio");
  setupVoiceCard("giovaani-play-dup", "giovaani-audio-dup");

  /* ============================================================
     10. LAZY LOADING VIDEOS
     ============================================================ */
  const lazyVideos = document.querySelectorAll(".lazy-video");
  if (lazyVideos.length > 0) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          video.src = video.dataset.src;
          video.addEventListener("loadeddata", () => {
            const loader = video.parentElement.querySelector(".video-loader");
            if (loader) { loader.style.opacity = "0"; setTimeout(() => loader.remove(), 300); }
            video.style.opacity = "1";
          });
          observer.unobserve(video);
        }
      });
    }, { rootMargin: "0px 0px 800px 0px" });

    lazyVideos.forEach(video => {
      video.style.opacity = "0";
      video.style.transition = "opacity 0.5s ease";
      videoObserver.observe(video);
    });
  }

});
