console.log('Environment:', window.ENV);
import { GoTrueAdminApi } from '@supabase/supabase-js';
//import { createClient } from '@supabase/supabase-js';
import { supabase, currentUser, checkAuthState, handleLogin, handleLogout } from './auth.js';

const visions = document.getElementById('visions');

// Make function global so can be referenced from auth.js
window.displayAddPost = function() {
    const form = document.querySelector('.post-form');
    form.classList.toggle('hidden');
    console.log('FORM: ', form);
}

// Toggles the visibility of the form - kept for backward compatibility
function displayAddPost(){
    form.classList.toggle('hidden');
    console.log(form);
}

async function fetchData() {
    try {
        if ( window.ENV === 'development') {

            const PORT = 3000;
            const response = await fetch(`http://localhost:${PORT}/api/posts`);
            const data = await response.json();
            if (data) displayVisions(data);//FIXME: validation to be deleted
            document.documentElement.style.setProperty('--visions-total', data.length);
            console.log(data);   
            displayVisions(data);
        } else {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: true }); //TODO: Decide whether last vision is shown first or last

            if (!error && data) {
                document.documentElement.style.setProperty('--visions-total', data.length);
                displayVisions(data);
            } else {
                console.log('Error:', error);
            }


            // if (error) {
            //     console.log('Error:', error);
            // } else {
            //     document.documentElement.style.setProperty('--visions-total', data.length);
            //     displayVisions(data);
            // }
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los posts');
    }
}


// Creates the HTML nodes and to display the posts content
function displayVisions(data) {
    visions.innerHTML = '';
    data.forEach(item => {
    // for (const item in data) {
        if (!item) return; // Skips function if there are invalid items

        const li = document.createElement('li');
        li.classList.add('vision-element');

        // Store post ID as a data attribute for deletion
        if (item.id) {
            li.dataset.postId = item.id;
        }

        // Creates media container
        const pictureDiv = document.createElement('div');
        pictureDiv.className = 'picture';

        // Checks if media exist and creates type class to diferentiate picture vs cideo
        if (item.image) {
            //FIXME: FLAG: either flag as isVideo || !isVideo or as isVideo || isPhoto
            const isVideo = item.image.match && item.image.match(/\.(mp4|mov|webm)$/i);
            const isPhoto = item.image.match && item.image.match(/\.(jpg|png|jpeg)$/i);

            if (isVideo) {
                const video = document.createElement('video');
                video.src = item.image;
                video.controls = true;
                video.loop = true;
                video.muted = true;
                pictureDiv.append(video);
            } else {
                const img = document.createElement('img');
                img.src = item.image;
                img.alt = 'one vision';
                pictureDiv.append(img);
            }
        }
        
        // CREATES TEXT CONTEXT
        const contextDiv = document.createElement('div');
        contextDiv.className = 'context';

        const text = document.createElement('p');
        text.className = 'text';
        text.textContent = item.text || ''; //Will create an empty space and follow on in the event of an emtpy text
        // text.textContent = `${data[item].text}`
        
        const caption = document.createElement('p');
        caption.className = 'caption';
        caption.textContent = `${item.location || ''}, ${item.year || ''}`; //Will create an empty space and follow on in the event of emtpy location/year
        
        contextDiv.append(text, caption)
        li.append(pictureDiv, contextDiv);
        visions.appendChild(li);

    });

    // TODO:To be implemented only if deletion is implemented
    /*
    if (currentUser) {
        addDeleteButtons();
    }
    */
}


// KEYBOARD NAVIGATION
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){
        e.preventDefault();
    }

    const visions = document.getElementById('visions');
    const currentScroll = visions.scrollLeft;
    const visionElements = document.querySelectorAll('.visions-element');

    if (visionElements.length === 0) return; //TODO: check if (!visionsElements) works

    //This gets the width of the 1st vision li element, gap included
    const visionWidth = visionElements[0].offsetWidth + parseInt(window.getComputedStyle(visions).gap);
    
    if (e.key === 'ArrowLeft') {
        // Scroll left to previous image
        visions.scrollTo({
            left: Math.max(0, currentScroll - visionWidth),
            behavior: 'smooth'
        });
    } else if (e.key === 'ArrowRight') {
        // Scroll right to next image
        visions.scrollTo({
            left: Math.min(
                visions.scrollWidth - visions.clientWidth,
                currentScroll + visionWidth),
            behavior: 'smooth'
        });
    }
});


const addPost = document.querySelector('.addNewPost');
const form = document.querySelector('.post-form');


// Displays the selected file name in the form  
document.addEventListener("DOMContentLoaded", () =>  {
    const fileInput = document.getElementById('file-upload');
    const fileNameContainer = document.querySelector('.selected-file');

    if (fileInput && fileNameContainer){ //TODO: check if condition is necessary
        fileInput.addEventListener("change", event => {
            const fileName = event.target.files.length > 0 ? event.target.files[0].name : "No file selected"
            fileNameContainer.textContent = fileName;
        });
    }

    // Initialise AUTHENTICATION
    checkAuthState();
 
    // Set up addNewPost event listener TODO: check condition
    const addPost = document.querySelector('.addNewPost');
    if (addPost) {
        addPost.addEventListener('click', displayAddPost); // 3
    }
});

//FIXME: Add authentication     
async function postVision(event) {
    event.preventDefault(); // Prevents default form submit

    const file = document.getElementById('file-upload').files[0];
    const text = document.getElementById('text').value;
    const location = document.getElementById('location').value;
    const year = parseInt(document.getElementById('year').value);
    console.log(year, typeof year);

    //TODO: check if condition is necessary
    if (!file) {
        alert('Please upload an image');
        return;
    }
    
    
    try {
        // Uses EXPRESS for DEVELOPMENT
        if (window.ENV === 'development') { 
            const formData = new FormData();
            formData.append('image', file);
            formData.append('text', text);
            formData.append('location', location);
            formData.append('year', year);
            
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                body: formData
            });
            alert('New vision added (development)');
            //FIXME: substitutes displayVisions() by fetchData() in develpment env
            // displayVisions();
            fetchData();


            
            // Handles the response, showing a possible 4XX error
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }

        // Uses SUPABASE for PRODUCTION
        } else {
            const fileName = `${Date.now()}_${file.name}`;

            // Uploads images to the Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('visions')
                .upload (fileName, file)

            if (uploadError) {
                alert('Error al subir la imagen: ' + uploadError.message);
                return;
            }

            // Get the public URL
            const { data: urlData } = supabase.storage
                .from('visions')
                .getPublicUrl(fileName);

            // Insert post in the table
            const { error: insertError } = await supabase
                .from('posts')
                .insert([{
                    image: urlData.publicUrl,
                    text, 
                    location,
                    year,
                    // user_id: currentUser.id //TODO: decide if needed
                }]);

            if (insertError) {
                alert('Error al guardar el post: ' + insertError.message);
            } else {
                alert('Nuevo post publicado');
                fetchData(); // loads the images once again
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
}


// Make functions available globally TODO: check global functions with window object
window.fetchData = fetchData;
window.displayVisions = displayVisions;
window.postVision = postVision;


// Attaches the submitForm function to the forms submit event
if (form) {
    form.addEventListener('submit', postVision)
}


fetchData();
displayVisions();