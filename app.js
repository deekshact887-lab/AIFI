/**
 * Deeksha Ct | Portfolio Script Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ==========================================================================
     THEME TOGGLE SYSTEM
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve theme choice from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Re-initialize icons (sun/moon switch)
    setTimeout(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 50);
  });

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  function toggleMobileMenu() {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    
    // Change menu icon to X icon and vice-versa
    const openIcon = mobileToggle.querySelector('.menu-icon-open');
    const closeIcon = mobileToggle.querySelector('.menu-icon-close');
    
    if (isOpen) {
      openIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    } else {
      openIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  }

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when nav links are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  /* ==========================================================================
     TYPING TEXT ANIMATION
     ========================================================================== */
  const typingTextSpan = document.getElementById('typing-text');
  const roles = [
    'Student at REVA University.',
    'Front-End Web Developer.',
    'Computer Science Student.',
    'Technology Enthusiast.'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingSpeed = 50; // Deleting speed is faster
      typingTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingSpeed = 100; // Normal typing speed
      typingTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at the end of typing
      typingSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next role
    }

    setTimeout(type, typingSpeed);
  }

  // Start typing loop
  if (typingTextSpan) {
    setTimeout(type, 1000);
  }

  /* ==========================================================================
     SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Unobserve once revealed
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     SKILLS TAB PANEL SWITCHING & ANIMATION
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Helper to trigger skill bar progress animation
  function animateSkillBars(pane) {
    const progressFills = pane.querySelectorAll('.progress-bar-fill');
    progressFills.forEach(fill => {
      // Reset width first to trigger the transition
      fill.style.width = '0%';
      // Trigger reflow
      fill.offsetHeight;
      
      const widthVal = fill.parentElement.previousElementSibling.querySelector('.skill-percent').textContent;
      fill.style.width = widthVal;
    });
  }

  // Setup tab switcher click listeners
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from other buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-tab');
      
      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
          animateSkillBars(pane);
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // Observe skills section to trigger bars animation on first viewport entrance
  const skillsSection = document.getElementById('skills');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activePane = document.querySelector('.tab-pane.active');
        if (activePane) {
          animateSkillBars(activePane);
        }
      }
    });
  }, { threshold: 0.15 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  /* ==========================================================================
     PROJECTS FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Custom animated scaling transition for projects hide/show
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     ACTIVE NAVIGATION ON SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetNavLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  /* ==========================================================================
     CONTACT FORM & SUCCESS SCREEN INTERACTION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successBox = document.getElementById('contact-success-box');
  const submitBtn = document.getElementById('form-submit-btn');
  const successBackBtn = document.getElementById('success-back-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show submitting indicator status on button
      const submitTextSpan = submitBtn.querySelector('span');
      const originalText = submitTextSpan.textContent;
      
      submitTextSpan.textContent = 'Sending Message...';
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.style.opacity = '0.8';

      // Simulate network request duration
      setTimeout(() => {
        // Clear inputs
        contactForm.reset();
        
        // Flip views
        contactForm.classList.add('hidden');
        successBox.classList.remove('hidden');
        
        // Restore button state
        submitTextSpan.textContent = originalText;
        submitBtn.removeAttribute('disabled');
        submitBtn.style.opacity = '1';
      }, 1500);
    });
  }

  if (successBackBtn) {
    successBackBtn.addEventListener('click', () => {
      successBox.classList.add('hidden');
      contactForm.classList.remove('hidden');
    });
  }

  /* ==========================================================================
     BACK-TO-TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
      backToTopBtn.style.transform = 'translateY(0)';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
      backToTopBtn.style.transform = 'translateY(10px)';
    }
  });

  if (backToTopBtn) {
    // Initial hidden layout styles
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.pointerEvents = 'none';
    backToTopBtn.style.transition = 'all var(--transition-normal)';
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
