// Debug profile update - simulating browser behavior
console.log('Starting browser simulation debug...\n');

async function debugProfile() {
    try {
        // Use an existing user - let's create one first
        console.log('Step 1: Creating a user account...');
        const testUser = {
            username: 'debuguser' + Date.now(),
            email: `debuguser${Date.now()}@example.com`,
            password: 'Test123456'
        };
        
        let response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        let data = await response.json();
        console.log('Signup response:', data);

        // Login to get session
        console.log('\nStep 2: Logging in...');
        response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        data = await response.json();
        console.log('Login response:', data);

        if (!data.success) {
            console.error('❌ Login failed, cannot proceed');
            return;
        }

        const sessionToken = data.sessionToken;
        const userId = data.userId;
        console.log('\n✓ Session Token:', sessionToken);
        console.log('✓ User ID:', userId);

        // Now try to load profile first (this is what the page does)
        console.log('\n\nStep 3: Loading existing profile (GET)...');
        response = await fetch('http://localhost:3000/api/get_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionToken: sessionToken,
                userId: userId
            })
        });
        data = await response.json();
        console.log('Get profile response:', data);

        // Now try update with minimal data
        console.log('\n\nStep 4: Updating profile with minimal data...');
        const updateData = {
            sessionToken: sessionToken,
            userId: userId,
            fullName: 'Test Name',
            dob: '',
            age: '',
            contact: '',
            address: '',
            city: '',
            country: ''
        };
        
        console.log('Sending update request with data:', updateData);
        
        response = await fetch('http://localhost:3000/api/update_profile', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        
        try {
            data = JSON.parse(responseText);
            console.log('Parsed response:', data);
            
            if (data.success) {
                console.log('\n✅ Update successful!');
            } else {
                console.log('\n❌ Update failed:', data.message);
            }
        } catch (e) {
            console.log('❌ Failed to parse response as JSON:', e.message);
        }

        // Verify the update
        console.log('\n\nStep 5: Verifying update...');
        response = await fetch('http://localhost:3000/api/get_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionToken: sessionToken,
                userId: userId
            })
        });
        data = await response.json();
        console.log('Verification response:', data);

    } catch (error) {
        console.error('❌ Error occurred:', error);
        console.error('Error stack:', error.stack);
    }
}

debugProfile();
