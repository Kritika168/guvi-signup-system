$(document).ready(function() {
    // Check if user is logged in
    const sessionToken = localStorage.getItem('sessionToken');
    const userId = localStorage.getItem('userId');
    
    if (!sessionToken || !userId) {
        window.location.href = 'login.html';
        return;
    }

    // Show message function
    function showMessage(message, type) {
        const messageBox = $('#profile-message');
        messageBox.removeClass('d-none alert-success alert-danger alert-warning');
        messageBox.addClass('alert-' + type);
        messageBox.text(message);
        
        // Auto hide after 5 seconds
        setTimeout(function() {
            messageBox.addClass('d-none');
        }, 5000);
    }

    // Load profile data
    function loadProfile() {
        // Set basic info from localStorage
        $('#username').val(localStorage.getItem('username') || '');
        $('#email').val(localStorage.getItem('email') || '');

        // Fetch additional profile data from MongoDB
        $.ajax({
            url: '/api/get_profile',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                sessionToken: sessionToken,
                userId: parseInt(userId) // Ensure userId is a number
            }),
            success: function(response) {
                console.log('Profile load response:', response); // Debug log
                if (response.success && response.profile) {
                    const profile = response.profile;
                    $('#full-name').val(profile.fullName || '');
                    $('#dob').val(profile.dob || '');
                    $('#age').val(profile.age || '');
                    $('#contact').val(profile.contact || '');
                    $('#address').val(profile.address || '');
                    $('#city').val(profile.city || '');
                    $('#country').val(profile.country || '');
                } else if (!response.success) {
                    console.error('Failed to load profile:', response.message);
                    showMessage(response.message || 'Failed to load profile data', 'warning');
                }
            },
            error: function(xhr, status, error) {
                console.error('Profile load error:', error);
                console.error('Response:', xhr.responseText);
                showMessage('Failed to load profile data', 'warning');
            }
        });
            },
            error: function(xhr, status, error) {
                console.error('Error loading profile:', error);
            }
        });
    }

    // Load profile on page load
    loadProfile();

    // Update profile button click handler
    $('#update-profile-btn').on('click', function() {
        const fullName = $('#full-name').val().trim();
        const dob = $('#dob').val();
        const age = $('#age').val();
        const contact = $('#contact').val().trim();
        const address = $('#address').val().trim();
        const city = $('#city').val().trim();
        const country = $('#country').val().trim();

        // Validation
        if (age && (age < 1 || age > 150)) {
            showMessage('Please enter a valid age!', 'danger');
            return;
        }

        if (contact && contact.length < 10) {
            showMessage('Please enter a valid contact number!', 'danger');
            return;
        }

        // Disable button and show loading
        const button = $(this);
        button.prop('disabled', true);
        button.html('<span class="spinner-border spinner-border-sm me-2"></span>Updating...');

        // AJAX request to update profile
        $.ajax({
            url: '/api/update_profile',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                sessionToken: sessionToken,
                userId: parseInt(userId), // Ensure userId is a number
                fullName: fullName,
                dob: dob,
                age: age,
                contact: contact,
                address: address,
                city: city,
                country: country
            }),
            success: function(response) {
                console.log('Update response:', response); // Debug log
                if (response.success) {
                    showMessage('Profile updated successfully!', 'success');
                } else {
                    showMessage(response.message || 'Update failed!', 'danger');
                    console.error('Update failed:', response.message);
                }
                button.prop('disabled', false);
                button.html('Update Profile');
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                console.error('Status:', status);
                console.error('Response:', xhr.responseText);
                
                // Try to parse error response
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    showMessage(errorData.message || 'An error occurred. Please try again later.', 'danger');
                } catch (e) {
                    showMessage('An error occurred. Please try again later.', 'danger');
                }
                
                button.prop('disabled', false);
                button.html('Update Profile');
            }
        });
    });

    // Logout button click handler
    $('#logout-btn').on('click', function() {
        // Send logout request to backend
        $.ajax({
            url: '/api/logout',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                sessionToken: sessionToken,
                userId: userId
            }),
            complete: function() {
                // Clear localStorage
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                
                // Redirect to login
                window.location.href = 'login.html';
            }
        });
    });

    // Auto-calculate age from DOB
    $('#dob').on('change', function() {
        const dob = new Date($(this).val());
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        if (age >= 0 && age <= 150) {
            $('#age').val(age);
        }
    });
});
