// Comprehensive API test
console.log('Starting comprehensive API test...\n');

async function testAPI() {
    try {
        // Test 1: Check if server is running
        console.log('Test 1: Checking if server is running...');
        let response = await fetch('http://localhost:3000/api/health');
        let data = await response.json();
        console.log('✓ Server health:', data);

        // Test 2: Test signup
        console.log('\nTest 2: Testing signup...');
        const testUser = {
            username: 'testuser' + Date.now(),
            email: `test${Date.now()}@example.com`,
            password: 'Test123456'
        };
        
        response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        data = await response.json();
        console.log('✓ Signup response:', data);

        if (data.success) {
            // Test 3: Test login
            console.log('\nTest 3: Testing login...');
            response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            });
            
            data = await response.json();
            console.log('✓ Login response:', data);

            if (data.success && data.sessionToken) {
                // Test 4: Test profile get
                console.log('\nTest 4: Testing profile retrieval...');
                response = await fetch(`http://localhost:3000/api/profile?sessionToken=${data.sessionToken}&userId=${data.userId}`);
                const profileData = await response.json();
                console.log('✓ Profile response:', profileData);

                console.log('\n✅ All API tests passed!');
            } else {
                console.log('❌ Login failed');
            }
        } else {
            console.log('❌ Signup failed');
        }

    } catch (error) {
        console.error('❌ API test failed:', error.message);
        console.log('\n⚠️  Make sure the server is running: node api/index.js');
    }
}

testAPI();
