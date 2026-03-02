$(document).ready(function() {
    // Check if user is already logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
        window.location.href = 'profile.html';
    }

    // Show message function
    function showMessage(message, type) {
        const messageBox = $('#login-message');
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

    // Login button click handler
    $('#login-btn').on('click', function() {
        const email = $('#email').val().trim();
        const password = $('#password').val();

        // Validation
        if (!email || !password) {
            showMessage('All fields are required!', 'danger');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address!', 'danger');
            return;
        }

        // Disable button and show loading
        const button = $(this);
        button.prop('disabled', true);
        button.html('<span class="spinner-border spinner-border-sm me-2"></span>Logging in...');

        // AJAX request to backend
        $.ajax({
            url: '/api/login',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                password: password
            }),
            success: function(response) {
                if (response.success) {
                    // Store session token in localStorage
                    localStorage.setItem('sessionToken', response.sessionToken);
                    localStorage.setItem('userId', response.userId);
                    localStorage.setItem('username', response.username);
                    localStorage.setItem('email', response.email);
                    
                    showMessage('Login successful! Redirecting...', 'success');
                    setTimeout(function() {
                        window.location.href = 'profile.html';
                    }, 1500);
                } else {
                    showMessage(response.message || 'Login failed!', 'danger');
                    button.prop('disabled', false);
                    button.html('Login');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                showMessage('An error occurred. Please try again later.', 'danger');
                button.prop('disabled', false);
                button.html('Login');
            }
        });
    });

    // Allow Enter key to submit
    $('#password').on('keypress', function(e) {
        if (e.which === 13) {
            $('#login-btn').click();
        }
    });
});
