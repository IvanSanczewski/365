import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://tkilbmlfaxwtsssahgys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRraWxibWxmYXh3dHNzc2FoZ3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMzU1NTgsImV4cCI6MjA1ODgxMTU1OH0.Ru5jAMuLBI605-9lTJS599njqIA7RzLmcrXnM38SDOI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Auth state management
let currentUser = null;

// Check if user is logged 
async function checkAuthState() {
    console.log('AUTH first step');
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Session error: ', error);
        displayLoginForm();
        return;
    }

    console.log('Session check result: ', session);

    if (session && session.user) {
        currentUser = session.user;
        console.log(`User ${currentUser.email} is logged in`);
        displayAdminUI();
    } else {
        console.log('No active session, displaying login form');
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
            
            // Updates the form into an auth form
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
            
            document.querySelector('.login-btn').addEventListener('click', handleLogin);

            //FIXME: move the inline styles to the styleshet file
            const authContainer = document.querySelector('.auth-c ontainer');
            if (authContainer) {
                authContainer.style.width = '300px';
                authContainer.style.padding = '20px';
                authContainer.style.margin = '0 auto';
                authContainer.style.display = 'flex';
                authContainer.style.flexDirection = 'column';
                authContainer.style.gap = '15px';
            }
        });
    }
}


// Handle login (email + password)
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageEl = document.querySelector('.auth-message');

    if (!email || !password) {
        messageEl.textContent = 'Both, email & password are required to post your next vision';
        messageEl.style.color = 'crimson'; //FIXME: change colour if error handling is needed
        return; //FIXME: check if jump statement is needed
    }
    
    try {
        console.log('Attempting login with: ', email);
        
        // Email & password sign in
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;
        
        // Check if a user is returned from the backend
        if (data && data.user) {
            currentUser = data.user;
            console.log('Login successful: ', currentUser);
    
            messageEl.textContent = "You're set to post a vision...";
            messageEl.style.color = 'green';//FIXME: change colour if error handling is needed
            setTimeout(()=> displayAdminUI(), 1000);
        
        } else {
            messageEl.textContent = 'Login failed - no user data returned';
            messageEl.style.color = 'crimson';
        }

    } catch (error) {
        console.error('Login error: ', error);
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


// Inject HTML with original post form
function setupPostForm(){
    const form = document.querySelector('.post-form');

    // Reset form
    form.innerHTML= `
        <div class="vision-form">
            <div class="file-upload-container">
                <label for="file-upload" class="btn file-btn">pick up a vision</label>
                <span class="selected-file">...your selected vision</span>
            </div>
            <input type="file" name="image" id="file-upload">
            <textarea name="text" id="text" cols="75" rows="5" placeholder="insert text..."></textarea>
        </div>
        
        <div class="caption-form">
            <textarea name="location" id="location" cols="20" rows="1" placeholder="location"></textarea>
            <textarea name="year" id="year" cols="20" rows="1" placeholder="year"></textarea>
        </div>

        <div class="password-form">
            <button class="btn">publish</button>
        </div>
    `;

    // Reassign event listener to read the file 
    const fileInput = document.getElementById('file-upload');
    const fileNameContainer = document.querySelector('.selected-file');

    fileInput.addEventListener('change', event => {
        const fileName = event.target.files.length > 0 ? event.target.files[0].name : 'No file has been selected...';
        fileNameContainer.textContent = fileName;
    });

    // Reassign submit
    form.addEventListener('submit', postVision);
}




// Add delete feature for individual posts 
function addDeleteButtons() {
    // wait until posts are uploaded
    setTimeout(() => {
        const visionElements = document.querySelectorAll('.vision-element');

        visionElements.forEach(element => { // FIXME: to be implemented in HTML and CSS files if delete buttons will be passed as part of the application
            if(!element.querySelector('.delete-btn')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add('btn', 'delete-btn');
                deleteBtn.style.position = 'absolute';
                deleteBtn.style.top = '10px';
                deleteBtn.style.right = '10px';
                deleteBtn.style.backgroundColor = '#ff4444';
                deleteBtn.style.color = 'white';
                
                element.style.position = 'relative';
                element.appendChild(deleteBtn);


                // Add delete functionality
                deleteBtn.addEventListener('click', async () => {
                    // Select post ID from image src
                    const img = element.querySelector('img');
                    const imgSrc = img ? img.getAttribute('src') : null;

                    if (!imgSrc) {
                        alert('The vision to delete does not exist.');
                        
                        if (confirm('Are you certain?')) {
                            try {
                                // Query the vision using the image path
                                const { data: posts, error: queryError } = await supabase
                                    .from('posts')
                                    .select('id')
                                    .eq('image', imgSrc);

                                if (queryError) throw queryError;

                                if (posts && posts.length > 0) {
                                    const postId = posts[0].id;

                                    // Delete vision from Supabase
                                    const { error: deleteError } = await supabase
                                        .from('posts')
                                        .delete()
                                        .eq('id', postId);
                                    
                                    if (deleteError) throw deleteError;

                                    // Delete vision from the interface
                                    element.remove();
                                    alert('Vision deleted.');
                                } else {
                                    alert('Vision not found in the database.');
                                }

                            } catch (error) {
                                alert('Vision culd not be deleted: ' + error.message);
                            }
                        }
                    }
                })
            }
        })

    }, 1000); // TODO: check whether it is better to use an async function
}




// Handle logout
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        currentUser = null;

        // Remove admin interface
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.remove();        

        const adminIndicator = document.getElementById('admin-indicator');
        if (adminIndicator) adminIndicator.remove();        

        // Remove delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        if (deleteButtons) deleteButtons.remove();        

        // Reset button to post new vision
        displayLoginForm();

        // Hide form if visible
        const form = document.querySelector('.post-form');
        form.classList.add('hidden');

        alert("Do not forget tomorrow's vision");

    } catch (error) {
        alert('Error logging out: ' + error.message);
    }
}


// Initialise auth on page load
document.addEventListener('DOMContentLoaded', () =>{
    checkAuthState();
});

export { supabase, currentUser, checkAuthState, handleLogin, handleLogout };