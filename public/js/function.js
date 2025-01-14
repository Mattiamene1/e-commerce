async function getUserById(id) {
    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {       // Validate the MongoDB ObjectId format
            throw new Error('Invalid ID format');
        }

        const user = await User.findById(id)
        return user;
    } catch (error) {
        console.error('Error in getUserById:', error.message);
        throw new Error('Failed to fetch user');
    }
}

async function getUserByEmail(email) {
    try {
        const user = await User.findById(email)
        return user;
    } catch (error) {
        console.error('Error in getUserByEmail:', error.message);
        throw new Error('Failed to fetch user');
    }
}

/// Registration
async function initPage() {
    const email = await getUserEmail();
    if (email) {
        const emailInput = document.getElementById('email');
        emailInput.placeholder = email;
        emailInput.disabled = true;
        return email;
    }
}

/// Retrieve Gmail email
async function getUserEmail() {
    try {
        const response = await fetch('/User/Google');
        if (!response.ok) {
            throw new Error('Failed to fetch user email');
        }
        const googleUserEmail = await response.json();
        return googleUserEmail.email;
    } catch (error) {
        console.error('Error fetching profile information:', error);
        document.getElementById('profile-info').innerHTML = '<p>Error fetching profile information, try to Log In again</p>';
        setTimeout(() => { window.location.href = '../index.html'; }, 0);
        return null; // Return null in case of an error
    }
}

async function registerUser(profileInfo) {

    console.log(profileInfo);
    try {
        const response = await fetch('/User', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileInfo),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error registering user:', errorData);
            throw new Error(errorData.error || 'An error occurred while registering the user.');
        }

        const result = await response.json();
        console.log('User registered successfully:', result);
        return result; // Return the result for further use if needed
    } catch (error) {
        console.error('Failed to register user:', error.message);
        throw error;
    }
}


/// Profile
function getUserProfile(){
    
}