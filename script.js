/* 
  Ragavarshini Alagarsamy — Personal Brand Portfolio JavaScript
  Interactive UI Components, Canvas Particle Field, API Showcase
*/

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbar();
  initCanvasParticles();
  initScrollReveals();
  initCounters();
  initGitHubShowcase();
  initContactForm();
  initRoleRotation();
  initMagneticButtons();
});

/* 1. Navbar Scroll Effect & Mobile Hamburger Menu */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Highlight Active Link based on section scroll
    let currentSection = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Hamburger Toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('open');
    });
  }

  // Close nav menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      if (hamburger) hamburger.classList.remove('open');
    });
  });
}

/* 2. Interactive Canvas Particles (Background) */
function initCanvasParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let particlesArray = [];
  const numberOfParticles = 75;
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  // Adjust canvas size
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse movements
  window.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Blueprint
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 10;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = 'rgba(59, 130, 246, ' + this.opacity + ')'; // electric blue shades
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // Coordinate movement based on mouse closeness (magnetic repulsion/attraction)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            let dxBase = this.x - this.baseX;
            this.x -= dxBase / 10;
          }
          if (this.y !== this.baseY) {
            let dyBase = this.y - this.baseY;
            this.y -= dyBase / 10;
          }
        }
      } else {
        if (this.x !== this.baseX) {
          let dxBase = this.x - this.baseX;
          this.x -= dxBase / 20;
        }
        if (this.y !== this.baseY) {
          let dyBase = this.y - this.baseY;
          this.y -= dyBase / 20;
        }
      }
    }
  }

  // Populate list
  function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grids first
    drawGrid();

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].draw();
      particlesArray[i].update();
    }
    
    // Connect particles if they are close
    connectParticles();

    animationFrameId = requestAnimationFrame(animate);
  }

  function drawGrid() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.strokeStyle = isLight ? 'rgba(15, 23, 42, 0.025)' : 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function connectParticles() {
    let maxDist = 120;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          let opac = (1 - (dist / maxDist)) * 0.15;
          ctx.strokeStyle = isLight ? 'rgba(37, 99, 235, ' + opac + ')' : 'rgba(6, 182, 212, ' + opac + ')'; // blue vs cyan
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  init();
  animate();
}

/* 3. Intersection Observer Scroll Reveal */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* 4. Interactive Counter Stats — Scroll-triggered animated count up */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length === 0) return;

  const animateCount = (counter) => {
    const target  = parseInt(counter.getAttribute('data-target'));
    const suffix  = counter.getAttribute('data-suffix') || '';
    const duration = 2200; // ms total animation time
    const startVal = 1;
    let startTime  = null;

    // Ease-out cubic: fast at start, slows near target
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOut(progress);
      const current  = Math.round(startVal + (target - startVal) * eased);

      counter.innerText = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.innerText = target + suffix;
      }
    };

    // Start from 1 visually
    counter.innerText = startVal + suffix;
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

/* 5. GitHub API & Repo Showcase Integration */
function initGitHubShowcase() {
  const container = document.getElementById('github-repos-container');
  if (!container) return;

  // We fetch repositories for the user. If rate limited, we fallback to pre-rendered top projects.
  const username = 'ragavarshini3';
  const apiURL = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

  fetch(apiURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('API Rate Limit or Network Error');
      }
      return response.json();
    })
    .then(data => {
      container.innerHTML = ''; // Clear loading placeholder
      
      // Let's filter or sort to find meaningful repositories
      // Remove forks and select top 4
      const filteredRepos = data
        .filter(repo => !repo.fork)
        .slice(0, 4);

      if (filteredRepos.length === 0) {
        useFallbackRepos();
        return;
      }

      filteredRepos.forEach(repo => {
        const desc = repo.description || 'No description provided. Click below to view code.';
        const stars = repo.stargazers_count;
        const lang = repo.language || 'Python';
        
        const card = document.createElement('div');
        card.className = 'repo-card';
        card.innerHTML = `
          <h4 class="repo-name">${repo.name}</h4>
          <p class="repo-desc">${desc}</p>
          <div class="repo-stats">
            <span>● ${lang}</span>
            <span>★ ${stars}</span>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-text-primary); margin-left: auto; font-size: 0.8rem; font-weight: 600;">View Code →</a>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.warn('Using GitHub fallback data due to api request issue:', error.message);
      useFallbackRepos();
    });

  function useFallbackRepos() {
    container.innerHTML = `
      <div class="repo-card">
        <h4 class="repo-name">AI-Powered-Math-Solver</h4>
        <p class="repo-desc">Web application using Flask, SymPy, and OCR to process handwriting and solve equations with step-by-step PDF outputs.</p>
        <div class="repo-stats">
          <span>● Python</span>
          <span>★ 5</span>
          <a href="https://github.com/ragavarshini3/Ai_Powered_MathSolver" target="_blank" rel="noopener noreferrer" style="color: var(--color-text-primary); margin-left: auto; font-size: 0.8rem; font-weight: 600;">View Code →</a>
        </div>
      </div>
      <div class="repo-card">
        <h4 class="repo-name">autonomous-driving-swarm</h4>
        <p class="repo-desc">Cooperative robotics driving simulator utilizing ROS2 topics/services, Gazebo simulation and CARLA V2V communication layer.</p>
        <div class="repo-stats">
          <span>● ROS2 / Python</span>
          <span>★ 4</span>
          <a href="https://github.com/ragavarshini3/Swarm-Intelligence-Driving" target="_blank" rel="noopener noreferrer" style="color: var(--color-text-primary); margin-left: auto; font-size: 0.8rem; font-weight: 600;">View Code →</a>
        </div>
      </div>
      <div class="repo-card">
        <h4 class="repo-name">ai-negotiation-dialogue</h4>
        <p class="repo-desc">NLP agent simulating negotiation dialog scenarios built using Hugging Face Transformers models and state engines.</p>
        <div class="repo-stats">
          <span>● Python</span>
          <span>★ 3</span>
          <a href="https://github.com/ragavarshini3/AI-NEGOTIATION-AGENT" target="_blank" rel="noopener noreferrer" style="color: var(--color-text-primary); margin-left: auto; font-size: 0.8rem; font-weight: 600;">View Code →</a>
        </div>
      </div>
      <div class="repo-card">
        <h4 class="repo-name">medical-analytics-dashboard</h4>
        <p class="repo-desc">Healthcare analytical pipelines and reporting automation dashboards simulating MedTech key performance indicator monitoring.</p>
        <div class="repo-stats">
          <span>● Jupyter Notebook</span>
          <span>★ 2</span>
          <a href="https://github.com/ragavarshini3" target="_blank" rel="noopener noreferrer" style="color: var(--color-text-primary); margin-left: auto; font-size: 0.8rem; font-weight: 600;">View Code →</a>
        </div>
      </div>
    `;
  }
}

/* ============================================================
   6. Contact Form — FormSubmit Direct POST
   Delivers form submissions directly to alagarsamyvarshini@gmail.com
   Unlimited & free — validates then lets HTML form POST naturally
   ============================================================ */

function initContactForm() {
  const form      = document.getElementById('portfolio-contact-form');
  const statusDiv = document.getElementById('contact-form-status');
  if (!form) return;

  const submitBtn    = document.getElementById('contact-submit-btn');
  const nameField    = document.getElementById('contact-name');
  const emailField   = document.getElementById('contact-email');
  const messageField = document.getElementById('contact-message');

  // Validate only — do NOT call e.preventDefault() so FormSubmit POST works
  form.addEventListener('submit', (e) => {
    const name    = nameField.value.trim();
    const email   = emailField.value.trim();
    const message = messageField.value.trim();

    // ── Validation ──────────────────────────────────────────
    if (!name) {
      e.preventDefault();
      showStatus('⚠️ Please enter your name.', 'error');
      nameField.focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      showStatus('⚠️ Please enter a valid email address.', 'error');
      emailField.focus();
      return;
    }
    if (!message) {
      e.preventDefault();
      showStatus('⚠️ Please enter your message.', 'error');
      messageField.focus();
      return;
    }

    // ── All valid — show loading, allow form to POST to FormSubmit ──
    if (submitBtn) {
      submitBtn.disabled   = true;
      submitBtn.innerHTML  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" style="animation:spin 1s linear infinite;vertical-align:middle;margin-right:8px;">
         <circle cx="12" cy="12" r="10" stroke-opacity=".3"/>
         <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
       </svg>Sending…`;
    }
    console.log('[FormSubmit] Posting to FormSubmit → alagarsamyvarshini@gmail.com');
    // Form will now POST naturally to https://formsubmit.co/alagarsamyvarshini@gmail.com
  });

  // ── Helpers ──────────────────────────────────────────────
  function showStatus(msg, type) {
    statusDiv.className     = `form-status ${type}`;
    statusDiv.innerHTML     = msg;
    statusDiv.style.display = 'block';
    if (type === 'error') setTimeout(() => {
      statusDiv.style.display = 'none';
      statusDiv.innerHTML     = '';
    }, 8000);
  }
}

/* Spinner keyframe (inline — no CSS file edit needed) */
if (!document.getElementById('ejs-spin-style')) {
  const s = document.createElement('style');
  s.id = 'ejs-spin-style';
  s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
}



/* 7. Typewriter Role Rotation Animation */
function initRoleRotation() {
  const roles = [
    "AI Engineering",
    "Machine Learning",
    "Robotics & Autonomous Systems",
    "Full Stack AI Development",
    "Python Engineering",
    "Intelligent Automation",
    "Data Analytics",
    "Healthcare AI Solutions",
    "ROS2 Robotics",
    "Software Engineering",
    "LLM Applications",
    "AI Powered Products"
  ];
  
  const roleEl = document.getElementById('animated-role');
  if (!roleEl) return;
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      charIndex--;
      typingSpeed = 50;
    } else {
      charIndex++;
      typingSpeed = 100;
    }
    
    roleEl.textContent = currentRole.substring(0, charIndex);
    
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at the end of word
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next
    }
    
    setTimeout(type, typingSpeed);
  }
  
  // Start the typing loop
  setTimeout(type, 1000);
}

/* 8. Magnetic Button Hover Effect */
function initMagneticButtons() {
  const elements = document.querySelectorAll('.magnetic');
  elements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Disable CSS transitions during tracking for absolute responsiveness
      el.style.transition = 'none';
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      // Re-enable smooth transition to snap back
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* 9. Light/Dark Theme Switching Logic */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Sync theme status on load
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}
