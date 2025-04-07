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
        displayAdminForm();
    } else {
        displayLoginForm();
    }
}



// Display login form
function displayAdminForm() {
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









// Initialise auth on page load
document.addEventListener('DOMContentLoaded', () =>{
    checkAuthState();
});

export { supabase, currentUser, checkAuthState, handleLogin, handleLogout };