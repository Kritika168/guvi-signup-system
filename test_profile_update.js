// Test profile update endpoint
console.log('Testing Profile Update Endpoint...\n');

async function testProfileUpdate() {
    try {
        // Step 1: Create a test user
        console.log('Step 1: Creating test user...');
        const testUser = {
            username: 'updatetest' + Date.now(),
            email: `updatetest${Date.now()}@example.com`,
            password: 'Test123456'
        };
        
        let response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        let data = await response.json();
        console.log('Signup:', data.success ? '✓ Success' : '✗ Failed');
        
        if (!data.success) {
            console.error('Cannot proceed without signup');
            return;
        }

        // Step 2: Login
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
        console.log('Login:', data.success ? '✓ Success' : '✗ Failed');
        
        if (!data.success) {
            console.error('Cannot proceed without login');
            return;
        }

        const sessionToken = data.sessionToken;
        const userId = data.userId;
        console.log('Session Token:', sessionToken.substring(0, 20) + '...');
        console.log('User ID:', userId);

        // Step 3: Update profile
        console.log('\nStep 3: Updating profile...');
        const profileData = {
            sessionToken: sessionToken,
            userId: userId,
            fullName: 'Test User Full Name',
            dob: '1990-01-01',
            age: '34',
            contact: '1234567890',
            address: '123 Test Street',
            city: 'Test City',
            country: 'Test Country'
        };

        response = await fetch('http://localhost:3000/api/update_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        
        data = await response.json();
        console.log('Update Response:', data);
        
        if (data.success) {
            console.log('\n✓ Profile update successful!');
            
            // Step 4: Verify update by fetching profile
            console.log('\nStep 4: Verifying profile was saved...');
            response = await fetch('http://localhost:3000/api/get_profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionToken: sessionToken,
                    userId: userId
                })
            });
            
            data = await response.json();
            console.log('Profile Data:', data);
            
            if (data.success && data.profile) {
                console.log('\n✅ All tests passed! Profile update working correctly.');
                console.log('\nSaved Profile:');
                console.log('  Full Name:', data.profile.fullName);
                console.log('  DOB:', data.profile.dob);
                console.log('  Age:', data.profile.age);
                console.log('  Contact:', data.profile.contact);
                console.log('  Address:', data.profile.address);
                console.log('  City:', data.profile.city);
                console.log('  Country:', data.profile.country);
            } else {
                console.log('❌ Failed to verify profile');
            }
        } else {
            console.log('❌ Profile update failed:', data.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n⚠️  Make sure the server is running: node server.js');
    }
}

testProfileUpdate();
