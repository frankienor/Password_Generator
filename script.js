// Wait for the DOM to finish loading before running the script
document.addEventListener('DOMContentLoaded', function () {
    // Get references to all the elements we'll be working with
    const generateButton = document.getElementById('generate');
    const showHideButton = document.getElementById('toggle-password');
    const passwordDisplay = document.getElementById('password-display');
    const strengthInput = document.getElementById('strength');
    const strengthIndicator = document.getElementById('strength-label');
    const copyButton = document.getElementById('copy-password');
    const statusIcon = document.getElementById('status-icon');
    const copyNotification = document.getElementById('copy-notification');

    // Initialize some variables to keep track of the password state
    let passwordVisible = false;
    let originalPassword = '';

    // Function to generate a new password
    function generatePassword() {
        // Define the character set to use for generating the password
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]:;<>,.?';
        let password = '';
        // Generate a password of the desired length
        for (let i = 0; i < strengthInput.value; i++) {
            password += characters.charAt(window.crypto.getRandomValues(new Uint32Array(1))[0] % characters.length);
        }
        // Store the original password and display a obscured version
        originalPassword = password;
        passwordDisplay.textContent = password.replace(/./g, '*');
        // Update the strength indicator
        strengthIndicator.textContent = getStrengthDescription(strengthInput.value);
        // Show the copy button and update the show/hide button text
        copyButton.style.visibility = 'visible';
        showHideButton.textContent = 'Show';
        passwordVisible = false;
        // Hide the status icon and copy notification
        statusIcon.style.display = 'none';
        copyNotification.style.display = 'none';
    }

    // Function to toggle password visibility
    function togglePasswordVisibility() {
        // Toggle the password visibility flag
        passwordVisible = !passwordVisible;
        // Update the password display accordingly
        passwordDisplay.textContent = passwordVisible ? originalPassword : originalPassword.replace(/./g, '*');
        // Update the show/hide button text
        showHideButton.textContent = passwordVisible ? 'Hide' : 'Show';
    }

    // Add an event listener to the copy button
    copyButton.addEventListener('click', function () {
        // Use the navigator.clipboard API to copy the password to the clipboard
        navigator.clipboard.writeText(originalPassword).then(() => {
            // Update the status icon and notification text
            statusIcon.className = 'copy-icon';
            statusIcon.innerHTML = '&#10004;'; // green checkmark
            statusIcon.style.display = 'inline';
            copyNotification.style.display = 'inline'; // Show the notification text
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    });

    // Function to get a strength description based on the password length
    function getStrengthDescription(strength) {
        if (strength < 15) return 'Weak';
        if (strength < 25) return 'Moderate';
        return 'Strong';
    }

    // Add event listeners to the generate and show/hide buttons
    generateButton.addEventListener('click', generatePassword);
    showHideButton.addEventListener('click', togglePasswordVisibility);
    // Update the strength indicator when the strength input changes
    strengthInput.addEventListener('input', () => strengthIndicator.textContent = getStrengthDescription(strengthInput.value));
});