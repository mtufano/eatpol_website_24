// This script will be added to testers.html to handle redirects properly

// Find the success handling code and replace it
document.addEventListener('DOMContentLoaded', function() {
    // Override the form submission to handle redirect
    const testerForm = document.getElementById('testerForm');
    if (testerForm) {
        // Remove existing event listeners by cloning the node
        const newForm = testerForm.cloneNode(true);
        testerForm.parentNode.replaceChild(newForm, testerForm);
        
        // Add new event listener with redirect handling
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const spinner = document.getElementById('loadingSpinner');
            
            // Show loading state
            submitBtn.disabled = true;
            spinner.style.display = 'block';
            
            // Prepare form data
            const formData = new FormData(this);
            
            // Submit form
            fetch('registration-handler.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                spinner.style.display = 'none';
                
                if (data.success) {
                    // Check if redirect URL is provided
                    if (data.redirect) {
                        // Redirect immediately to thank you page
                        window.location.href = data.redirect;
                    } else {
                        // Fallback to success message
                        document.getElementById('successMessage').style.display = 'block';
                        this.reset();
                        window.scrollTo(0, 0);
                        
                        // Redirect after 3 seconds
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 3000);
                    }
                } else {
                    alert(data.message || 'Registration failed. Please try again.');
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                spinner.style.display = 'none';
                submitBtn.disabled = false;
                alert('An error occurred. Please try again later.');
            });
        });
    }
});