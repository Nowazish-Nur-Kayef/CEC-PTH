document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        submitButton.classList.add('loading');

        // Prepare form data
        const templateParams = {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            }, function(error) {
                showMessage('Failed to send message. Please try again.', 'error');
            })
            .finally(function() {
                submitButton.classList.remove('loading');
            });
    });

    // Message display function
    function showMessage(text, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create and show new message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;

        contactForm.appendChild(message);

                // Remove message after 5 seconds
                setTimeout(() => {
                    message.remove();
                }, 5000);
            }
        
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
        
            // Form validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Add floating label effect
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
        
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
        
                // Real-time validation
                input.addEventListener('input', validateInput);
            });
        
            function validateInput(e) {
                const input = e.target;
                const value = input.value.trim();
        
                switch(input.id) {
                    case 'name':
                        validateName(input, value);
                        break;
                    case 'email':
                        validateEmail(input, value);
                        break;
                    case 'phone':
                        validatePhone(input, value);
                        break;
                    case 'subject':
                        validateSubject(input, value);
                        break;
                    case 'message':
                        validateMessage(input, value);
                        break;
                }
            }
        
            function validateName(input, value) {
                if (value.length < 2) {
                    setError(input, 'Name must be at least 2 characters long');
                } else if (!/^[a-zA-Z\s]*$/.test(value)) {
                    setError(input, 'Name should only contain letters and spaces');
                } else {
                    setSuccess(input);
                }
            }
        
            function validateEmail(input, value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    setError(input, 'Please enter a valid email address');
                } else {
                    setSuccess(input);
                }
            }
        
            function validatePhone(input, value) {
                const phoneRegex = /^[\d\s+-]+$/;
                if (!phoneRegex.test(value)) {
                    setError(input, 'Please enter a valid phone number');
                } else {
                    setSuccess(input);
                }
            }
        
            function validateSubject(input, value) {
                if (value.length < 3) {
                    setError(input, 'Subject must be at least 3 characters long');
                } else {
                    setSuccess(input);
                }
            }
        
            function validateMessage(input, value) {
                if (value.length < 10) {
                    setError(input, 'Message must be at least 10 characters long');
                } else {
                    setSuccess(input);
                }
            }
        
            function setError(input, message) {
                const formGroup = input.parentElement;
                const errorDisplay = formGroup.querySelector('.error-message') || 
                                   createErrorElement(formGroup);
                
                formGroup.classList.add('error');
                formGroup.classList.remove('success');
                errorDisplay.textContent = message;
            }
        
            function setSuccess(input) {
                const formGroup = input.parentElement;
                formGroup.classList.remove('error');
                formGroup.classList.add('success');
                
                const errorDisplay = formGroup.querySelector('.error-message');
                if (errorDisplay) {
                    errorDisplay.remove();
                }
            }
        
            function createErrorElement(formGroup) {
                const errorDisplay = document.createElement('small');
                errorDisplay.className = 'error-message';
                formGroup.appendChild(errorDisplay);
                return errorDisplay;
            }
        
            // Handle form reset
            contactForm.addEventListener('reset', () => {
                inputs.forEach(input => {
                    input.parentElement.classList.remove('focused', 'success', 'error');
                    const errorDisplay = input.parentElement.querySelector('.error-message');
                    if (errorDisplay) {
                        errorDisplay.remove();
                    }
                });
            });
        });
