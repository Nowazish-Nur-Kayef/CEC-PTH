document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Update DateTime in status bar
    function updateDateTime() {
        const now = new Date();
        const formatted = now.getUTCFullYear() + '-' + 
                         String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
                         String(now.getUTCDate()).padStart(2, '0') + ' ' +
                         String(now.getUTCHours()).padStart(2, '0') + ':' +
                         String(now.getUTCMinutes()).padStart(2, '0') + ':' +
                         String(now.getUTCSeconds()).padStart(2, '0');
        document.getElementById('current-datetime').textContent = formatted;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('.terms-nav a');
    const sections = document.querySelectorAll('.terms-main section');
    const navHeight = document.querySelector('.navbar').offsetHeight;

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - navHeight - 20,
                behavior: 'smooth'
            });
        });
    });

    // Highlight active section on scroll
    function highlightActiveSection() {
        const fromTop = window.scrollY + navHeight + 100;

        sections.forEach(section => {
            const link = document.querySelector(`.terms-nav a[href="#${section.id}"]`);
            
            if (
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', debounce(highlightActiveSection, 100));
    highlightActiveSection();

    // Debounce function to optimize scroll performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }


    // Table of contents mobile toggle
    const tocToggle = document.createElement('button');
    tocToggle.className = 'toc-toggle';
    tocToggle.innerHTML = '<i class="fas fa-list"></i> Table of Contents';
    
    const termsNav = document.querySelector('.terms-nav');
    
    if (window.innerWidth < 768) {
        termsNav.parentNode.insertBefore(tocToggle, termsNav);
        termsNav.style.display = 'none';
        
        tocToggle.addEventListener('click', function() {
            const isVisible = termsNav.style.display === 'block';
            termsNav.style.display = isVisible ? 'none' : 'block';
            this.classList.toggle('active');
        });
    }

    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth >= 768) {
            termsNav.style.display = 'block';
            if (tocToggle.parentNode) {
                tocToggle.parentNode.removeChild(tocToggle);
            }
        } else {
            if (!document.querySelector('.toc-toggle')) {
                termsNav.parentNode.insertBefore(tocToggle, termsNav);
                termsNav.style.display = 'none';
            }
        }
    }, 250));

    // Add copy button to code blocks if any
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        
        block.parentNode.style.position = 'relative';
        block.parentNode.appendChild(button);
        
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                button.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text:', err);
                button.innerHTML = '<i class="fas fa-times"></i>';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            }
        });
    });

    // Print functionality
    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Terms';
    document.querySelector('.terms-main').prepend(printButton);

    printButton.addEventListener('click', function() {
        window.print();
    });

    // Handle external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.hostname.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.innerHTML += ' <i class="fas fa-external-link-alt"></i>';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth < 768) {
            termsNav.style.display = 'none';
            tocToggle.classList.remove('active');
        }
    });

    // Add section anchors
    sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            const anchor = document.createElement('a');
            anchor.className = 'section-anchor';
            anchor.href = `#${section.id}`;
            anchor.innerHTML = '<i class="fas fa-link"></i>';
            heading.appendChild(anchor);
        }
    });

    // Progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', debounce(function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, 10));
});
