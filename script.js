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

/* 4. Interactive Counter Stats */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (counters.length === 0) return;

  const animateCount = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const suffix = counter.getAttribute('data-suffix') || '';
    let count = 0;
    const speed = 2000 / target; // complete in 2 seconds

    const update = () => {
      count++;
      counter.innerText = count + suffix;
      if (count < target) {
        setTimeout(update, speed);
      } else {
        counter.innerText = target + suffix;
      }
    };
    update();
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

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

/* 6. Recruiter Contact Form & Validation Interactivity */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const statusDiv = document.getElementById('contact-form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      showStatus('Please fill in all fields before sending.', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Set button loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Message...';

    // Simulate sending API request
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      
      // Visual Success State
      showStatus('Thank you! Your message has been sent successfully. I will reach out shortly!', 'success');
      form.reset();
    }, 1500);
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showStatus(msg, type) {
    statusDiv.className = 'form-status ' + type;
    statusDiv.innerText = msg;
    
    // Auto-clear error after 4 seconds
    if (type === 'error') {
      setTimeout(() => {
        statusDiv.className = 'form-status';
      }, 4000);
    }
  }
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
