/**
 * Let's Coding & Play - Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileMenu();
  initSmoothScroll();
  initFAQAccordion();
  initPixelArt();
  initScrollAnimations();
  initNavbarScroll();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });

    // Close menu when link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        menuBtn.classList.remove('active');
      });
    });
  }
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * FAQ Accordion
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function() {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

/**
 * Pixel Art Animation
 */
function initPixelArt() {
  const pixelGrid = document.querySelector('.pixel-grid');

  if (pixelGrid) {
    // Create 16x16 pixel grid
    const totalPixels = 256;
    const filledPercentage = 25; // 25% filled as shown in the design
    const filledCount = Math.floor(totalPixels * filledPercentage / 100);

    // Create pixel pattern (simple rocket shape)
    const rocketPattern = [
      0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,
      0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
      0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
      0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,
      0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,
      0,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,
      0,0,0,0,1,1,0,1,1,0,1,1,0,0,0,0,
      0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
      0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,
      0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,
      0,0,1,0,1,1,1,1,1,1,1,1,0,1,0,0,
      0,1,1,0,0,1,1,1,1,1,1,0,0,1,1,0,
      0,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0,
      0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,
      0,0,0,0,0,1,1,0,0,1,1,0,0,0,0,0,
      0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0
    ];

    // Count filled pixels in pattern
    let patternFilledCount = rocketPattern.filter(p => p === 1).length;
    let currentFilled = 0;

    for (let i = 0; i < totalPixels; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel');

      // Fill pixels based on pattern and percentage
      if (rocketPattern[i] === 1 && currentFilled < filledCount) {
        pixel.classList.add('filled');
        currentFilled++;
      }

      pixelGrid.appendChild(pixel);
    }
  }
}

/**
 * Scroll Animations (Fade In)
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // Add fade-in to cards with delay
  const cards = document.querySelectorAll('.feature-card, .pain-card, .pricing-card, .testimonial-card');
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    card.classList.add('fade-in');
    observer.observe(card);
  });
}

/**
 * Navbar Background on Scroll
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

/**
 * Dashboard Tab Switching (if needed in future)
 */
function initDashboardTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      tabBtns.forEach(b => b.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Get tab data
      const tab = this.getAttribute('data-tab');

      // Here you would switch content based on tab
      // For now, just visual feedback
      console.log('Switched to tab:', tab);
    });
  });
}

// Initialize dashboard tabs
document.addEventListener('DOMContentLoaded', initDashboardTabs);
