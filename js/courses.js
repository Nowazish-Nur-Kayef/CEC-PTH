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

    // Course Filtering System
    const filterSelects = document.querySelectorAll('.filter-select');
    const courseCards = document.querySelectorAll('.course-card');
    const grid = document.querySelector('.grid');

    let currentFilters = {
        level: 'all',
        duration: 'all',
        type: 'all'
    };

    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            currentFilters[this.id] = this.value;
            filterCourses();
        });
    });

    function filterCourses() {
        let hasVisibleCourses = false;

        courseCards.forEach(card => {
            const matchesLevel = currentFilters.level === 'all' || card.dataset.level === currentFilters.level;
            const matchesDuration = currentFilters.duration === 'all' || card.dataset.duration === currentFilters.duration;
            const matchesType = currentFilters.type === 'all' || card.dataset.type === currentFilters.type;

            if (matchesLevel && matchesDuration && matchesType) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease both';
                hasVisibleCourses = true;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide empty state
        const emptyState = document.querySelector('.empty-grid') || createEmptyState();
        if (!hasVisibleCourses) {
            if (!document.querySelector('.empty-grid')) {
                grid.appendChild(emptyState);
            }
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }

    function createEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-grid';
        emptyDiv.innerHTML = `
            <i class="fas fa-search"></i>
            <p>No courses match your selected filters.</p>
            <button class="btn btn-primary reset-filters">Reset Filters</button>
        `;

        emptyDiv.querySelector('.reset-filters').addEventListener('click', resetFilters);
        return emptyDiv;
    }

    function resetFilters() {
        filterSelects.forEach(select => {
            select.datacategory = 'all';
        });
        
        currentFilters = {
            level: 'all',
            duration: 'all',
            type: 'all'
        };
        
        filterCourses();
    }

    // Course Card Hover Effects
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.course-image img').style.transform = 'scale(1.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.querySelector('.course-image img').style.transform = 'scale(1)';
        });
    });

    // Lazy Loading Images
    const courseImages = document.querySelectorAll('.course-image img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    courseImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });

    // Smooth Scroll to Courses Section
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // // Mobile Menu Toggle
    // const navToggle = document.querySelector('.nav-toggle');
    // const navMenu = document.querySelector('.nav-menu');
    
    // if (navToggle && navMenu) {
    //     navToggle.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //         this.classList.toggle('active');
    //     });
    // }

    // Enrollment Button Click Handler
    const enrollButtons = document.querySelectorAll('.btn-primary');
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const courseName = this.closest('.course-card').querySelector('h3').textContent;
            showEnrollmentModal(courseName);
        });
    });

    function showEnrollmentModal(courseName) {
        const modal = document.createElement('div');
        modal.className = 'enrollment-modal';
        modal.innerHTML = `
            <div class="modal-content">
            <button type="button" class="modal-close" style="cursor: pointer; padding: 10px; border-radius: 50%; position: fixed; height: 40px; width: 40px; top: 5px; right: 5px;"><i class="fas fa-multiply"></i></button>
            <div class="modal-body">
                <h2>Pre-book a consultation in ${courseName}</h2>
                <p>Please fill out the form below to prebook a consultation in this course.</p>
                <form action="https://formsubmit.co/a90fa79701692f8d56da61caf0deb06a" method="POST" enctype="multipart/form-data" id="enrollment-form">
                    <div class="form-group" style="display: none;">
                        <label for="text">Enrolling Course<span style="color: red">*</span></label>
                        <input name="Course Booking for" type="text" id="phone" required placeholder="Course Name" value="${courseName}">
                    </div>
                    <div class="form-group">
                        <label for="name">Student's Name<span style="color: red">*</span></label>
                        <input name="student's Name" type="text" id="name" required placeholder="Enter the student's name">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address<span style="color: red">*</span></label>
                        <input name="Email Address" type="email" id="email" required placeholder="Enter email address">
                    </div>
                    <div class="form-group">
                        <label for="text">Father's Name<span style="color: red">*</span></label>
                        <input name="Father's Name" type="text" id="phone" required placeholder="Enter the student's father's name">
                    </div>
                    <div class="form-group">
                        <label for="text">Mother's Name<span style="color: red">*</span></label>
                        <input name="Mother's Name" type="text" id="phone" required placeholder="Enter the student's mother's name">
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number<span style="color: red">*</span></label>
                        <input name="Phone Number" type="tel" id="phone" required placeholder="Enter your phone number">
                    </div>
                    <div style="display: flex; align-items: left; color: #000">
                        <input name="Acceptance of TC" type="checkbox" id="checkbox" required style="align-content: left; justify-content: left;">
                        <label for="checkbox" style="margin-left: 10px;">I agree to the Terms and Conditions<span style="color: red">*</span></label>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <input type="hidden" name="_template" value="box">
                    <input type="hidden" name="_captcha" value="false">
                    <input type="hidden" name="_next" value="https://cec2010.vercel.app/courses.html">
                    <input type="hidden" name="_subject" value="New Pre-booking Request">
                    <input type="hidden" name="_blacklist" value="spammy pattern, banned term, phrase">
                    <input type="hidden" name="_cc" value="chotonsenglishcare5@gmail.com">
                </form>
            </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());

        modal.addEventListener('click', e => {
            if (e.target === modal) modal.remove();
        });
    }

    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

});
