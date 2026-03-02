$(document).ready(function() {
    // Check if user is already logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
        window.location.href = 'profile.html';
    }

    // Show message function
    function showMessage(message, type) {
        const messageBox = $('#signup-message');
        messageBox.removeClass('d-none alert-success alert-danger alert-warning');
        messageBox.addClass('alert-' + type);
        messageBox.text(message);
        
        // Auto hide after 5 seconds
        setTimeout(function() {
            messageBox.addClass('d-none');
        }, 5000);
    }

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    function isValidPassword(password) {
        return password.length >= 6;
    }

    // Sign up button click handler
    $('#signup-btn').on('click', function() {
        const username = $('#username').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            showMessage('All fields are required!', 'danger');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address!', 'danger');
            return;
        }

        if (!isValidPassword(password)) {
            showMessage('Password must be at least 6 characters long!', 'danger');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'danger');
            return;
        }

        // Disable button and show loading
        const button = $(this);
        button.prop('disabled', true);
        button.html('<span class="spinner-border spinner-border-sm me-2"></span>Signing up...');

        // AJAX request to backend
        $.ajax({
            url: 'php/signup.php',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                email: email,
                password: password
            }),
            success: function(response) {
                if (response.success) {
                    showMessage('Registration successful! Redirecting to login...', 'success');
                    setTimeout(function() {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage(response.message || 'Registration failed!', 'danger');
                    button.prop('disabled', false);
                    button.html('Sign Up');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                showMessage('An error occurred. Please try again later.', 'danger');
                button.prop('disabled', false);
                button.html('Sign Up');
            }
        });
    });

    // Allow Enter key to submit
    $('#confirm-password').on('keypress', function(e) {
        if (e.which === 13) {
            $('#signup-btn').click();
        }
    });
});
