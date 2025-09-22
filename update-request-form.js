// Updated JavaScript for request-test.html form
// This replaces the existing form submission logic

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Remove existing event listeners by cloning the form
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add new enhanced event listener
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const submitBtn = newForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // Validate required fields
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const company = document.getElementById('company').value.trim();
        
        if (!firstName || !lastName || !email || !company) {
            alert('Please fill in all required fields (marked with *)');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Prepare form data
        const formData = new FormData(this);
        
        // Submit to new handler
        fetch('request-test-handler.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Check for redirect
                if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    alert('Request submitted successfully! We will contact you soon.');
                    newForm.reset();
                }
            } else {
                alert(data.message || 'Error submitting request. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
    });
    
    // Existing functionality for show/hide fields
    const otherCheckbox = document.getElementById('otherCheckbox');
    const otherInput = document.getElementById('otherInput');
    const specificSegment = document.getElementById('specificSegment');
    const segmentInput = document.getElementById('segmentInput');
    
    if (otherCheckbox && otherInput) {
        otherCheckbox.addEventListener('change', function() {
            otherInput.style.display = this.checked ? 'block' : 'none';
        });
    }
    
    if (specificSegment && segmentInput) {
        specificSegment.addEventListener('change', function() {
            segmentInput.style.display = this.checked ? 'block' : 'none';
        });
        
        // Hide segment input when other radio is selected
        document.querySelectorAll('input[name="consumerTarget"]').forEach(radio => {
            if (radio.id !== 'specificSegment') {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        segmentInput.style.display = 'none';
                    }
                });
            }
        });
    }
    
    // Show fields on page load if needed
    if (otherCheckbox && otherCheckbox.checked) {
        otherInput.style.display = 'block';
    }
    if (specificSegment && specificSegment.checked) {
        segmentInput.style.display = 'block';
    }
});

console.log('Request form enhanced with working email system');