import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://tkilbmlfaxwtsssahgys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRraWxibWxmYXh3dHNzc2FoZ3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMzU1NTgsImV4cCI6MjA1ODgxMTU1OH0.Ru5jAMuLBI605-9lTJS599njqIA7RzLmcrXnM38SDOI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Auth state management
let currentUser = null;

// Check if user is logged 
async function checkAuthState() {
    console.log('AUTH first step');
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        displayAdminUI();
    } else {
        displayLoginForm();
    }
}



// Display login form
function displayLoginForm() {
    const addPostBtn = document.querySelector('.addNewPost');
    const form = document.querySelector('.post-form');

    // Add login trigger to addNewPost button
    if (addPostBtn) {
        addPostBtn.removeEventListener('click', displayAddPost);
        addPostBtn.addEventListener('click', () => {
            
            // Transform the form into an auth form
            form.classList.remove('hidden');
            form.innerHTML = `
                <div class='auth-container'>
                    <h3>Admin Login</h3>
                    <input type='email' id='email' placeholder='email' required>
                    <input type='password' id='password' placeholder='password' required>
                    <div class='auth-buttons'>
                        <button class='login-btn'>Login</button>
                    </div>
                    <p class='auth-message'></p>
                </div>
            `;

            //FIXME: move the inline styles to the styleshet file
            const authContainer = document.querySelector('.authContainer');
            authContainer.style.width = '300px';
            authContainer.style.padding = '20px';
            authContainer.style.margin = '0 auto';
            authContainer.style.display = 'flex';
            authContainer.style.flexDirection = 'column';
            authContainer.style.gap = '15px';

            document.getElementById('login-btn').addEventListener('click', handleLogin);
        });
    }
}


// Handle login (email + password)
async function handleLogin() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const messageEl = document.getElementById('messageEl');

    if (!email || !password) {
        messageEl.textContent = 'Both, email & password are required to post your next vision';
        messageEl.style.color = 'crimson';//FIXME: change colour if error handling is needed
        return;//FIXME: check if jump statement is needed
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;
        
        currentUser = data.user;
        messageEl.textContent = "You're set to post a vision...";
        messageEl.style.color = 'green';//FIXME: change colour if error handling is needed
        
        setTimeout(()=> displayAdminForm(), 1000);
        setTimeout(()=> {displayAdminForm();}, 1000);
        setTimeout( displayAdminForm, 1000);
    
    } catch (error) {
        messageEl.textContent = error.message || 'Login failed. Please, try again.';
        messageEl.style.color = 'crimson';
    }
}


// Display admin UI after successuful login 
function displayAdminUI(){
    // Restore addNewPost link
    const addPostBtn = document.querySelector('.addNewPost');

    if (addPostBtn) {
        addPostBtn.removeEventListener('click', displayLoginForm);
        addPostBtn.addEventListener('click', displayAddPost);
    }
    
    
    // Add logout button
    if (!document.getElementById('logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.classList.add('btn');
        logoutBtn.style.position = 'fixed';
        logoutBtn.style.top = '10px';
        logoutBtn.style.right = '10px';
        logoutBtn.style.zIndex = '1000';
        logoutBtn.addEventListener('click', handleLogout);
        document.body.appendChild(logoutBtn);
    }
    
    
    // Show admin status indicator
    const adminIndicator = document.createElement('div');
    adminIndicator.id = 'admin-indicator';
    adminIndicator.textContent = 'Admin Mode';
    adminIndicator.style.position = 'fixed';
    adminIndicator.style.top = '10px';
    adminIndicator.style.left = '10px';
    adminIndicator.style.background = '#4CAF50';
    adminIndicator.style.color = 'white';
    adminIndicator.style.padding = '5px 10px';
    adminIndicator.style.borderRadius = '3px';
    adminIndicator.style.zIndex = '1000';
    document.body.appendChild(adminIndicator);
    
    // Restore original form structure
    setupPostForm();
    
    // Add delete functionality to existing posts FIXME: this feature may not be integrated in order to keep the site as a real diary
    addDeleteButtons();
}















// Initialise auth on page load
document.addEventListener('DOMContentLoaded', () =>{
    checkAuthState();
});

export { supabase, currentUser, checkAuthState, handleLogin, handleLogout };