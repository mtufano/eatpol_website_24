// Fixed JavaScript for request-test.html
// This replaces the complex form submission with simple, working email integration

document.addEventListener('DOMContentLoaded', function() {
    // Replace the existing form submission handler
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Remove existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add simple, working form submission
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get basic required fields
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const company = document.getElementById('company').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country').value.trim();
        const comments = document.getElementById('comments').value.trim();
        
        // Basic validation
        if (!firstName || !lastName || !email || !company || !city || !country || !comments) {
            alert('Please fill in all required fields (marked with *)');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Prepare FormData (same format as working handler expects)
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('company', company);
        formData.append('city', city);
        formData.append('country', country);
        formData.append('comments', comments);
        
        // Collect product types
        document.querySelectorAll('input[name="Product_Type"]:checked').forEach(checkbox => {
            formData.append('productType[]', checkbox.value);
        });
        
        // Collect test focus
        document.querySelectorAll('input[name="Test_Focus"]:checked').forEach(checkbox => {
            formData.append('testFocus[]', checkbox.value);
        });
        
        // Add other field
        const otherInput = document.getElementById('otherInput');
        if (otherInput) formData.append('productTypeOther', otherInput.value.trim());
        
        // Add radio button selections
        const participantsRadio = document.querySelector('input[name="Number_of_Participants"]:checked');
        if (participantsRadio) formData.append('participants', participantsRadio.value);
        
        const consumerTargetRadio = document.querySelector('input[name="Consumer_Target"]:checked');
        if (consumerTargetRadio) formData.append('consumerTarget', consumerTargetRadio.value);
        
        const segmentInput = document.getElementById('segmentInput');
        if (segmentInput) formData.append('consumerTargetSpecific', segmentInput.value.trim());
        
        const launchDateRadio = document.querySelector('input[name="Launch_Date"]:checked');
        if (launchDateRadio) formData.append('launchDate', launchDateRadio.value);
        
        // Submit to working handler
        fetch('request-test-handler.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to thank you page
                if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    window.location.href = 'thank-you.html';
                }
            } else {
                alert(data.message || 'Error submitting request. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    });
    
    // Keep the show/hide functionality for other fields
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
        document.querySelectorAll('input[name="Consumer_Target"]').forEach(radio => {
            if (radio.id !== 'specificSegment') {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        segmentInput.style.display = 'none';
                    }
                });
            }
        });
    }
});

console.log('Request form updated with working email system - no more Outlook popups!');