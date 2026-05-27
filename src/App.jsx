import React, { useState, useEffect, useRef } from 'react';

const projectData = [
  {
    id: 1,
    category: "branding",
    type: "Branding & Logo",
    title: "Vesper Branding Identity",
    image: "assets/branding.png",
    desc: "Vesper Labs required a complete visual overhaul that represented their clean, high-tech engineering background while retaining a warm, approachable human side. We designed a minimalist brand mark representing interconnected nodes, customized typography, a dual-gradient color system, and mockups for packaging and letterheads.",
    client: "Vesper Labs",
    date: "October 2025",
    tools: "Adobe Illustrator, Photoshop, InDesign"
  },
  {
    id: 2,
    category: "render-3d",
    type: "3D Illustration",
    title: "Cybernetic Dimensions",
    image: "assets/render_3d.png",
    desc: "A personal creative research project exploring the combination of refractive glass surfaces, neon emitters, and floating metallic forms. The render showcases high-end materials, custom chromatic aberrations, and ambient occlusion, designed to highlight visual aesthetics in futuristic marketing layouts.",
    client: "Personal Research",
    date: "January 2026",
    tools: "Blender, Octane Render, Photoshop"
  },
  {
    id: 3,
    category: "print",
    type: "Print & Layout",
    title: "Typographic Echoes Poster",
    image: "assets/poster_art.png",
    desc: "Designed for the Zurich Design Fest, this Swiss-style typographic poster represents the physical vibration of sound in printed typography. Using high-contrast geometry, bold grids, overlapping typography, and a textured grain layer, the poster bridges digital layout and physical screenprint processes.",
    client: "Zurich Design Fest",
    date: "August 2025",
    tools: "Adobe Illustrator, InDesign"
  },
  {
    id: 4,
    category: "ui-ux",
    type: "Mobile App UI/UX",
    title: "Zenith Crypto Dashboard",
    image: "assets/ui_ux.png",
    desc: "Zenith is a premium Web3 analytics and portfolio tracker. The project involved creating a high-fidelity mobile dashboard prototype focusing on accessibility and visual hierarchy. Features glassmorphic cards, custom charts, dark-first styling, and micro-interactions designed to make crypto trading feel premium and simple.",
    client: "Zenith Inc.",
    date: "March 2026",
    tools: "Figma, After Effects"
  },
  {
    id: 5,
    category: "branding",
    type: "Branding & Stationary",
    title: "Aero Logistics Brand Kit",
    image: "assets/branding.png",
    desc: "Aero is a drone-delivery shipping startup. The branding kit focuses on speed, security, and aerodynamics. We designed a customized slanted logo, modern bold icons, color palettes depicting high sky-blue and warning orange, and a full corporate stationery suite ready for production.",
    client: "Aero Flight Systems",
    date: "November 2025",
    tools: "Adobe Illustrator, Photoshop"
  },
  {
    id: 6,
    category: "render-3d",
    type: "3D Design",
    title: "Neon Geometry Stage Art",
    image: "assets/render_3d.png",
    desc: "Created as background visual content and stage projection graphics for a leading electro-music festival. Designed floating neon shapes, reactive light patterns, and animated loops that synched with bass frequencies, resulting in a mesmerizing live performance environment.",
    client: "ElectroMusic Festival",
    date: "December 2025",
    tools: "Blender, After Effects"
  }
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState('dark');
  
  // Sticky header and menu
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Active nav section
  const [activeSection, setActiveSection] = useState('home');
  
  // Portfolio filter
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Carousel slide index
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveredCarousel, setIsHoveredCarousel] = useState(false);
  
  // Custom cursor
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isCursorHovered, setIsCursorHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formProjectType, setFormProjectType] = useState('brand');
  const [formMessage, setFormMessage] = useState('');
  
  // Form errors & success
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState(false);
  const [formSending, setFormSending] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    
    setTheme(initialTheme);
    document.body.className = `${initialTheme}-theme`;
  }, []);

  // Handle theme toggling
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.body.className = `${nextTheme}-theme`;
  };

  // Sticky header detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor desktop state for cursor followers
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tracking mouse movements for Custom Cursor
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop]);

  // Track hover status on interactive links
  useEffect(() => {
    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, .portfolio-card, input, textarea, select, .carousel-dot')) {
        setIsCursorHovered(true);
      }
    };
    const handleMouseOut = (e) => {
      if (!e.target.closest('a, button, .portfolio-card, input, textarea, select, .carousel-dot')) {
        setIsCursorHovered(false);
      }
    };
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.remove('mouseover', handleMouseOver);
      document.remove('mouseout', handleMouseOut);
    };
  }, []);

  // Section Observer to highlight active link
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.getAttribute('id'));
        }
      });
    }, observerOptions);

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          if (entry.target.classList.contains('about-info-col')) {
            // Force animation of children skill bars
            const skillFills = entry.target.querySelectorAll('.skill-bar-fill');
            skillFills.forEach(fill => {
              const targetWidth = fill.getAttribute('data-width');
              fill.style.width = targetWidth;
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Testimonials autoplay
  useEffect(() => {
    if (isHoveredCarousel) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoveredCarousel]);

  // Handle form submissions
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!formName.trim()) {
      errors.name = true;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formEmail.trim() || !emailRegex.test(formEmail)) {
      errors.email = true;
    }
    
    if (!formMessage.trim()) {
      errors.message = true;
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setFormSending(true);

    setTimeout(() => {
      setFormSending(false);
      setFormSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormMessage('');
      setFormProjectType('brand');

      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
    }, 1000);
  };

  const clearFormError = (field) => {
    setFormErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return (
    <>
      {/* Custom Cursor Followers */}
      {isDesktop && (
        <>
          <div
            className={`custom-cursor ${isCursorHovered ? 'hovered' : ''}`}
            id="customCursor"
            style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
          />
          <div
            className="custom-cursor-dot"
            id="customCursorDot"
            style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }}
          />
        </>
      )}

      {/* Header Navigation */}
      <header id="mainHeader" className={isScrolled ? 'scrolled' : ''}>
        <div className="container nav-container">
          <a href="#home" className="logo" id="logoLink">
            ALEX<span>.</span>DESIGN
          </a>
          
          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`} id="navMenu">
            <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#portfolio" className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Work</a>
            <a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="#testimonials" className={`nav-link ${activeSection === 'testimonials' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Testimonials</a>
            <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>Contact</a>
          </nav>

          <div className="nav-actions">
            <button className="theme-toggle" id="themeToggleBtn" onClick={toggleTheme} aria-label="Toggle visual theme">
              <i className={theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
            </button>
            <a href="#contact" className="btn btn-primary btn-sm btn-hire">Hire Me</a>
            <button className="menu-toggle" id="menuToggleBtn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation menu">
              <i className={isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-tagline scroll-reveal">CREATIVE GRAPHIC & VISUAL DESIGNER</span>
            <h1 className="hero-title scroll-reveal">
              Shaping Ideas Into <br />
              <span className="text-gradient">Visual Realities</span>
            </h1>
            <p className="hero-desc scroll-reveal">
              Hi, I'm Alex. A multidisciplinary designer specializing in building premium brand identities, futuristic 3D renders, editorial layouts, and intuitive user experiences.
            </p>
            <div className="hero-cta scroll-reveal">
              <a href="#portfolio" className="btn btn-primary">View My Work <i className="fa-solid fa-arrow-right"></i></a>
              <a href="#contact" className="btn btn-outline">Let's Connect</a>
            </div>
          </div>
          
          <div className="hero-visual scroll-reveal">
            <div className="visual-wrapper">
              <div className="floating-card branding-card">
                <i className="fa-solid fa-signature"></i>
                <span>Branding</span>
              </div>
              <div className="floating-card render-card">
                <i className="fa-solid fa-cubes"></i>
                <span>3D Render</span>
              </div>
              <div className="floating-card ui-card">
                <i className="fa-solid fa-palette"></i>
                <span>UI/UX Design</span>
              </div>
              <div className="geometric-shape">
                <div className="inner-circle"></div>
              </div>
            </div>
          </div>
        </div>
        <a href="#about" className="scroll-down-indicator" aria-label="Scroll down to About section">
          <span>Scroll Down</span>
          <i class="fa-solid fa-chevron-down"></i>
        </a>
      </section>

      {/* About Section */}
      <section id="about" class="about-section section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Biography</span>
            <h2 className="section-title">Behind the Designs</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="about-grid">
            <div className="about-img-col scroll-reveal">
              <div className="about-img-frame">
                <img src="assets/designer_avatar.png" alt="Alex Morgan - Graphic Designer" className="about-img" />
                <div className="frame-backdrop"></div>
              </div>
            </div>
            
            <div className="about-info-col scroll-reveal">
              <h3 className="about-heading">I craft memorable visual stories for global brands.</h3>
              <p className="about-text">
                I believe design is not just about looking pretty; it’s a strategic language to communicate ideas, evoke emotion, and solve complex problems. With over 6 years of industry experience, I merge artistic vision with logical planning to create impactful artwork.
              </p>
              <p className="about-text">
                Whether it’s developing a cohesive brand logo, building complex abstract 3D illustrations, or designing slick modern digital prototypes, I focus on detail, hierarchy, and visual consistency.
              </p>
              
              {/* Skill Bars */}
              <div className="skills-container">
                <div className="skill-item">
                  <div className="skill-info">
                    <span>Brand Strategy & Identity</span>
                    <span>95%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" data-width="95%"></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>3D Modeling & Illustration</span>
                    <span>90%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" data-width="90%"></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>Print, Layout & Typography</span>
                    <span>85%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" data-width="85%"></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>UI/UX & Web Prototype Design</span>
                    <span>80%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <div className="skill-bar-fill" data-width="80%"></div>
                  </div>
                </div>
              </div>
              
              {/* Tech Stack Icons */}
              <div className="tech-stack">
                <h4 className="tech-title">Tools of the Trade:</h4>
                <div className="tech-icons">
                  <div className="tech-tag" title="Adobe Illustrator"><i className="fa-solid fa-bezier-curve"></i> Illustrator</div>
                  <div className="tech-tag" title="Adobe Photoshop"><i class="fa-solid fa-crop-simple"></i> Photoshop</div>
                  <div className="tech-tag" title="Figma"><i className="fa-brands fa-figma"></i> Figma</div>
                  <div className="tech-tag" title="Blender"><i className="fa-solid fa-cube"></i> Blender</div>
                  <div className="tech-tag" title="Adobe InDesign"><i class="fa-solid fa-columns-3"></i> InDesign</div>
                  <div className="tech-tag" title="Adobe After Effects"><i class="fa-solid fa-film"></i> After Effects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio-section section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Showcase</span>
            <h2 className="section-title">My Creative Portfolio</h2>
            <div className="header-line"></div>
            <p className="section-desc text-center">
              Explore a hand-picked collection of recent designs, spanning branding, futuristic 3D renders, Swiss layouts, and user interface concepts.
            </p>
          </div>
          
          {/* Filters */}
          <div className="portfolio-filters scroll-reveal">
            <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All Projects</button>
            <button className={`filter-btn ${activeFilter === 'branding' ? 'active' : ''}`} onClick={() => setActiveFilter('branding')}>Branding</button>
            <button className={`filter-btn ${activeFilter === 'render-3d' ? 'active' : ''}`} onClick={() => setActiveFilter('render-3d')}>3D Art</button>
            <button className={`filter-btn ${activeFilter === 'print' ? 'active' : ''}`} onClick={() => setActiveFilter('print')}>Print & Posters</button>
            <button className={`filter-btn ${activeFilter === 'ui-ux' ? 'active' : ''}`} onClick={() => setActiveFilter('ui-ux')}>UI/UX Design</button>
          </div>
          
          {/* Grid */}
          <div className="portfolio-grid scroll-reveal" id="portfolioGrid">
            {projectData.map((project) => {
              const isHidden = activeFilter !== 'all' && project.category !== activeFilter;
              return (
                <div 
                  key={project.id} 
                  className={`portfolio-card ${isHidden ? 'hide' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="card-img-wrapper">
                    <img src={project.image} alt={project.title} className="portfolio-img" />
                    <div className="card-overlay">
                      <span className="view-project-label">View Project <i className="fa-solid fa-plus"></i></span>
                    </div>
                  </div>
                  <div className="card-info">
                    <span className="project-category">{project.type}</span>
                    <h3 className="project-title">{project.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Services</span>
            <h2 className="section-title">What I Can Do For You</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="services-grid">
            <div className="service-card scroll-reveal">
              <div className="service-icon">
                <i className="fa-solid fa-bezier-curve"></i>
              </div>
              <h3 className="service-title">Brand Identity Design</h3>
              <p className="service-desc">
                Developing cohesive brand strategies including unique logo designs, complete visual identity systems, type scale definitions, and extensive corporate style guides.
              </p>
            </div>
            
            <div className="service-card scroll-reveal">
              <div className="service-icon">
                <i className="fa-solid fa-cube"></i>
              </div>
              <h3 className="service-title">3D Illustration & Modeling</h3>
              <p className="service-desc">
                Crafting eye-catching three-dimensional visuals, product models, abstract cosmic scenes, and styled graphics that enhance online presence and advertisements.
              </p>
            </div>
            
            <div className="service-card scroll-reveal">
              <div className="service-icon">
                <i class="fa-solid fa-file-invoice"></i>
              </div>
              <h3 className="service-title">Editorial & Print Production</h3>
              <p className="service-desc">
                Designing publication layouts, magazine structures, flyers, high-contrast posters, and custom box packagings ready for high-fidelity physical print production.
              </p>
            </div>
            
            <div className="service-card scroll-reveal">
              <div className="service-icon">
                <i class="fa-solid fa-display"></i>
              </div>
              <h3 className="service-title">UI/UX Prototype Design</h3>
              <p className="service-desc">
                Creating gorgeous interface designs, visual mobile dashboard layouts, interaction guides, and web screens in Figma with a key focus on user journey flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section section-padding">
        <div className="container">
          <div className="stats-row scroll-reveal">
            <div className="stat-item">
              <span className="stat-number">6+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Successful Projects</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Client Approval</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Creative Awards</span>
            </div>
          </div>
          
          <div className="section-header text-center" style={{ marginTop: '6rem' }}>
            <span className="section-subtitle">Feedback</span>
            <h2 className="section-title">What Clients Say</h2>
            <div className="header-line"></div>
          </div>
          
          <div 
            className="testimonials-carousel scroll-reveal"
            onMouseEnter={() => setIsHoveredCarousel(true)}
            onMouseLeave={() => setIsHoveredCarousel(false)}
          >
            <div 
              className="carousel-track" 
              id="carouselTrack" 
              style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
            >
              <div className="carousel-slide">
                <div className="testimonial-card">
                  <div className="rating">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <p className="testimonial-text">
                    "Alex transformed our brand from looking like a generic startup to an industry leader. The brand assets and guides provided are incredibly comprehensive, and the attention to detail was exceptional throughout."
                  </p>
                  <div className="client-info">
                    <span className="client-name">Sarah Jenkins</span>
                    <span className="client-role">CEO, Vesper Labs</span>
                  </div>
                </div>
              </div>
              
              <div className="carousel-slide">
                <div className="testimonial-card">
                  <div className="rating">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <p className="testimonial-text">
                    "Working with Alex on our 3D visual campaigns was an absolute breeze. We were blown away by the creative lighting directions, quick delivery, and the final photorealistic renders. Truly talented visual artist!"
                  </p>
                  <div className="client-info">
                    <span className="client-name">Marcus Thorne</span>
                    <span className="client-role">Creative Director, Nexus Media</span>
                  </div>
                </div>
              </div>
              
              <div className="carousel-slide">
                <div className="testimonial-card">
                  <div className="rating">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <p className="testimonial-text">
                    "The typographic poster designed for the annual design festival exceeded all expectations. It was clean, bold, instantly eye-catching, and beautifully aligned to Swiss graphic design standards."
                  </p>
                  <div className="client-info">
                    <span className="client-name">Hans Meier</span>
                    <span className="client-role">Organizer, Zurich Design Fest</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="carousel-nav" id="carouselNav">
              <span 
                className={`carousel-dot ${currentSlide === 0 ? 'active' : ''}`} 
                onClick={() => setCurrentSlide(0)}
              ></span>
              <span 
                className={`carousel-dot ${currentSlide === 1 ? 'active' : ''}`} 
                onClick={() => setCurrentSlide(1)}
              ></span>
              <span 
                className={`carousel-dot ${currentSlide === 2 ? 'active' : ''}`} 
                onClick={() => setCurrentSlide(2)}
              ></span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Collaboration</span>
            <h2 className="section-title">Let's Create Together</h2>
            <div className="header-line"></div>
            <p className="section-desc text-center">
              Have an upcoming design project or just want to say hi? Fill out the form, and let's bring your vision to life.
            </p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-info-col scroll-reveal">
              <h3 className="contact-subheading">Get in touch directly</h3>
              <p className="contact-desc-text">
                I am currently accepting select freelance designs, corporate branding commissions, and remote creative consulting roles.
              </p>
              
              <div className="contact-details">
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-envelope"></i></div>
                  <div>
                    <h4>Email Me</h4>
                    <a href="mailto:alex@morgan.design">alex@morgan.design</a>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><i className="fa-solid fa-location-dot"></i></div>
                  <div>
                    <h4>Studio Location</h4>
                    <span>San Francisco, California (Available globally)</span>
                  </div>
                </div>
              </div>
              
              <div className="social-networks">
                <h4>Follow My Work:</h4>
                <div className="social-icons">
                  <a href="#" aria-label="Alex's Dribbble profile"><i className="fa-brands fa-dribbble"></i></a>
                  <a href="#" aria-label="Alex's Behance profile"><i className="fa-brands fa-behance"></i></a>
                  <a href="#" aria-label="Alex's LinkedIn profile"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a href="#" aria-label="Alex's Instagram profile"><i className="fa-brands fa-instagram"></i></a>
                </div>
              </div>
            </div>
            
            <div className="contact-form-col scroll-reveal">
              <form id="contactForm" onSubmit={handleFormSubmit} noValidate>
                <div className="form-row">
                  <div className={`form-group ${formErrors.name ? 'invalid' : ''}`}>
                    <label htmlFor="name">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      placeholder="John Doe" 
                      value={formName} 
                      onChange={(e) => { setFormName(e.target.value); clearFormError('name'); }} 
                      required 
                    />
                    <span className="error-msg" id="nameError">Please enter your name</span>
                  </div>
                  <div className={`form-group ${formErrors.email ? 'invalid' : ''}`}>
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="john@example.com" 
                      value={formEmail} 
                      onChange={(e) => { setFormEmail(e.target.value); clearFormError('email'); }} 
                      required 
                    />
                    <span className="error-msg" id="emailError">Please enter a valid email address</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="projectType">Project Service Needed</label>
                  <div className="select-wrapper">
                    <select 
                      id="projectType" 
                      name="projectType"
                      value={formProjectType}
                      onChange={(e) => setFormProjectType(e.target.value)}
                    >
                      <option value="brand">Brand Strategy & Identity</option>
                      <option value="3d">3D Illustration / Model</option>
                      <option value="print">Editorial & Print Layout</option>
                      <option value="ui">UI/UX & Web Prototype</option>
                      <option value="other">Other Design Projects</option>
                    </select>
                  </div>
                </div>
                
                <div className={`form-group ${formErrors.message ? 'invalid' : ''}`}>
                  <label htmlFor="message">Project Outline / Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5" 
                    placeholder="Tell me a bit about your brand goals..." 
                    value={formMessage} 
                    onChange={(e) => { setFormMessage(e.target.value); clearFormError('message'); }} 
                    required 
                  />
                  <span className="error-msg" id="messageError">Please type your message</span>
                </div>
                
                <button type="submit" className="btn btn-primary btn-block" id="formSubmitBtn" disabled={formSending}>
                  <span>{formSending ? 'Sending...' : 'Send Message'}</span> <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
              
              {/* Form Success Modal Alert */}
              <div className="form-feedback success" id="formSuccessAlert" style={{ display: formSuccess ? 'flex' : 'none' }}>
                <i className="fa-solid fa-circle-check"></i>
                <div>
                  <h4>Message Sent!</h4>
                  <p>Thank you, Alex will respond within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-container">
          <div className="footer-top">
            <a href="#home" className="logo">
              ALEX<span>.</span>DESIGN
            </a>
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#portfolio">Work</a>
              <a href="#services">Services</a>
              <a href="#testimonials">Testimonials</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 ALEX.DESIGN. All rights reserved. Created with passion.</p>
            <a href="#home" className="back-to-top" id="backToTopBtn" aria-label="Scroll back to top">
              <span>Back to Top</span>
              <i className="fa-solid fa-arrow-up"></i>
            </a>
          </div>
        </div>
      </footer>

      {/* Dynamic Portfolio Details Lightbox Modal */}
      {selectedProject && (
        <div className="modal-overlay open" id="projectModal" onClick={(e) => { if (e.target.id === 'projectModal') setSelectedProject(null); }}>
          <div className="modal-card">
            <button className="modal-close" id="modalCloseBtn" onClick={() => setSelectedProject(null)} aria-label="Close project gallery">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="modal-body">
              <div className="modal-img-col">
                <img id="modalProjectImg" src={selectedProject.image} alt={selectedProject.title} />
              </div>
              <div className="modal-info-col">
                <span id="modalProjectCat" className="modal-category">{selectedProject.type}</span>
                <h3 id="modalProjectTitle" className="modal-title">{selectedProject.title}</h3>
                <p id="modalProjectDesc" className="modal-desc">{selectedProject.desc}</p>
                
                <div className="modal-meta-grid">
                  <div className="meta-item">
                    <span className="meta-label"><i className="fa-solid fa-user"></i> Client</span>
                    <span id="modalProjectClient" className="meta-value">{selectedProject.client}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label"><i className="fa-solid fa-calendar"></i> Delivered</span>
                    <span id="modalProjectDate" class="meta-value">{selectedProject.date}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label"><i className="fa-solid fa-screwdriver-wrench"></i> Tools</span>
                    <span id="modalProjectTools" className="meta-value">{selectedProject.tools}</span>
                  </div>
                </div>
                
                <a href="#contact" className="btn btn-primary modal-cta-btn" id="modalContactBtn" onClick={() => setSelectedProject(null)}>Start a Project Like This</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
