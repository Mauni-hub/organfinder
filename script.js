// You can add JavaScript for interactivity here.
// For the given screenshots, most of the content is static.
// Here are a couple of basic examples:

// Example 1: Smooth scrolling for anchor links (if you were to add them)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Example 2: Simple alert when a button is clicked (you'd replace this with actual functionality)
document.addEventListener('DOMContentLoaded', () => {
    const findHospitalsButtons = document.querySelectorAll('.btn-primary, .btn-primary-large');
    findHospitalsButtons.forEach(button => {
        button.addEventListener('click', () => {
            // In a real application, this would navigate to a search page or open a modal.
            // For now, a simple alert:
            // alert('Initiating search for hospitals...');
            console.log('Search for hospitals triggered!');
        });
    });

    const learnToRegisterButton = document.querySelector('.join-movement-card .btn-secondary');
    if (learnToRegisterButton) {
        learnToRegisterButton.addEventListener('click', () => {
            // alert('Redirecting to registration information...');
            console.log('Learn to Register button clicked!');
        });
    }

    const sendFeedbackButton = document.querySelector('.footer .btn-secondary');
    if (sendFeedbackButton) {
        sendFeedbackButton.addEventListener('click', () => {
            // alert('Opening feedback form...');
            console.log('Send Feedback button clicked!');
        });
    }
});