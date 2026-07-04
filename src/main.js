import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Scrollbar from 'smooth-scrollbar';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  
  // Setup Smooth Scrollbar
  const scroller = document.querySelector('#scroller');
  const bodyScrollBar = Scrollbar.init(scroller, {
    damping: 0.05,
    delegateTo: document,
  });

  // Intercept anchor links for smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        // Adjust for floating header
        const offset = targetEl.getBoundingClientRect().top + bodyScrollBar.scrollTop - 100;
        bodyScrollBar.scrollTo(0, offset, 1000);
      }
    });
  });

  // GSAP ScrollTrigger Proxy for Smooth Scrollbar
  ScrollTrigger.scrollerProxy(scroller, {
    scrollTop(value) {
      if (arguments.length) {
        bodyScrollBar.scrollTop = value;
      }
      return bodyScrollBar.scrollTop;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    pinType: scroller.style.transform ? "transform" : "fixed"
  });

  // Tell ScrollTrigger to update on smooth scrollbar update
  bodyScrollBar.addListener(ScrollTrigger.update);
  ScrollTrigger.defaults({ scroller: scroller });

  // 1. Hero Showcase Animations (index.html)
  if (document.querySelector('.hero-showcase')) {
    gsap.to('.playhead-line', {
      left: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-showcase',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });

    gsap.to('.timeline-bg', {
      yPercent: 20,
      scale: 1,
      opacity: 0.1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-showcase',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.hero-content', {
      y: -50,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero-showcase',
        start: 'top top',
        end: 'center top',
        scrub: true
      }
    });
  }

  // 2. About Section Reveal (index.html)
  if (document.querySelector('.about-section')) {
    gsap.from('.about-text', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%'
      }
    });

    gsap.from('.about-image-wrapper', {
      y: 150,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 75%'
      }
    });
  }

  // 3. Experience Section Reveal (index.html)
  if (document.querySelector('.experience-section')) {
    gsap.from('.experience-section .section-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.experience-section',
        start: 'top 80%'
      }
    });
    
    gsap.from('.skill-card', {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 85%'
      }
    });
  }

  // 4. Preview CTA Reveal (index.html)
  if (document.querySelector('.preview-cta-section')) {
    gsap.from('.preview-cta-section', {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.preview-cta-section',
        start: 'top 80%'
      }
    });
  }

  // 5. Contact CTA Reveal (index.html)
  if (document.querySelector('.contact-section')) {
    gsap.from('.contact-section', {
      scale: 0.95,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%'
      }
    });
  }

  // 6. Works Page Reveal (works.html)
  if (document.querySelector('.works-page-header')) {
    gsap.from('.works-page-header', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    });
  }

  const videoCards = document.querySelectorAll('.video-card');
  if (videoCards.length > 0) {
    videoCards.forEach((card) => {
      gsap.from(card, {
        y: 100,
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
        }
      });
    });
  }

  // 7. Interactive Background (Shared)
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursorGlow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }

  // 8. Video Controls Logic (Shared)
  videoCards.forEach(card => {
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.play-pause');
    const muteBtn = card.querySelector('.mute-unmute');
    const fsBtn = card.querySelector('.fullscreen');
    
    if(!video) return;

    // Play/Pause
    playBtn?.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
      } else {
        video.pause();
        playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
      }
    });

    // Mute/Unmute
    muteBtn?.addEventListener('click', () => {
      video.muted = !video.muted;
      if (video.muted) {
        muteBtn.innerHTML = '<i class="ph-fill ph-speaker-slash"></i>';
      } else {
        muteBtn.innerHTML = '<i class="ph-fill ph-speaker-high"></i>';
      }
    });

    // Fullscreen
    fsBtn?.addEventListener('click', () => {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) { /* Safari */
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { /* IE11 */
        video.msRequestFullscreen();
      }
    });
  });

  // 6. Testimonial Voice Reviews
  const setupVoiceCard = (btnId, audioId) => {
    const btn = document.getElementById(btnId);
    const audio = document.getElementById(audioId);
    if (!btn || !audio) return;
    
    const card = btn.closest('.voice-card');
    const icon = btn.querySelector('i');
    
    btn.addEventListener('click', () => {
      if (audio.paused) {
        // Pause all other audios first
        document.querySelectorAll('audio').forEach(a => {
          if (!a.paused && a !== audio) {
            a.pause();
            const otherBtn = document.querySelector(`[aria-controls="${a.id}"]`) || a.closest('.voice-card')?.querySelector('.audio-play-btn');
            if (otherBtn) otherBtn.querySelector('i').className = 'ph-fill ph-play';
            a.closest('.voice-card')?.classList.remove('is-playing');
          }
        });
        
        audio.play();
        icon.className = 'ph-fill ph-pause';
        card.classList.add('is-playing');
      } else {
        audio.pause();
        icon.className = 'ph-fill ph-play';
        card.classList.remove('is-playing');
      }
    });

    audio.addEventListener('ended', () => {
      icon.className = 'ph-fill ph-play';
      card.classList.remove('is-playing');
    });
  };

  setupVoiceCard('giovaani-play', 'giovaani-audio');
  setupVoiceCard('giovaani-play-dup', 'giovaani-audio-dup');

});
