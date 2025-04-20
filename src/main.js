console.log('Environment:', window.ENV);
import { createClient } from '@supabase/supabase-js';
import { supabase, currentUser, checkAuthState, handleLogin, handleLogout } from './auth.js';

const visions = document.getElementById('visions');

// Make function global so can be referenced from auth.js
window.displayAddPost = function() {
    const form = document.querySelector('.post-form');
    form.classList.toggle('hidden');
    console.log(form);
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
            document.documentElement.style.setProperty('--visions-total', data.length);
            console.log(data);   
            displayVisions(data);
        } else {
            const { data, error } = await supabase
                .from('posts')
                .select('*')

            if (error) {
                console.log('Error:', error);
            } else {
                document.documentElement.style.setProperty('--visions-total', data.length);
                displayVisions(data);
            }
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los posts');
    }
}


// Creates the HTML nodes and to display the posts content
function displayVisions(data) {
    visions.innerHTML = '';
    for (const item in data) {
        const li = document.createElement('li');
        li.classList.add('vision-element');

        // Store post ID as a data attribute for deletion
        if (item.id) {
            li.dataset.postId = item.id;
        }

        const pictureDiv = document.createElement('div');
        pictureDiv.className = 'picture';
        
        const img = document.createElement('img');
        img.setAttribute('src', `${data[item].image}`);
        img.setAttribute('alt', 'some ALT text');
        
        const contextDiv = document.createElement('div');
        contextDiv.className = 'context';


        const text = document.createElement('p');
        text.className = 'text';
        text.textContent = `${data[item].text}`
        
        const caption = document.createElement('p');
        caption.className = 'caption';
        caption.textContent = `${data[item].location}, ${data[item].year}`
        
        pictureDiv.appendChild(img);
        contextDiv.append(text, caption)
        li.append(pictureDiv, contextDiv);
        visions.appendChild(li);
    }

    // To be implemented only if deletion is implemented
    /*
    if (currentUser) {
        addDeleteButtons();
    }
    */
}


const addPost = document.querySelector('.addNewPost');
const form = document.querySelector('.post-form');

// Verificar si el elemento existe
// (addPost === null)? console.log('null') : console.log('!null');
if (!addPost) {
    console.error('Elemento .addNewPost no encontrado');
} else {
    addPost.addEventListener('click', displayAddPost);
}


addPost.addEventListener('click', displayAddPost);



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
        addPost.addEventListener('click', displayAddPost);
    }
});

//FIXME: Add authentication     
async function postVision(event) {
    event.preventDefault(); // Prevents default form submit
    

    // Check if user is authenticated
    if (!currentUser) {
        alert('You must be the author to share your vision');
        return;
    }

    const file = document.getElementById('file-upload').files[0];
    const text = document.getElementById('text').value;
    const location = document.getElementById('location').value;
    const year = document.getElementById('year').value;

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
                    user_id: currentUser.id //TODO: decide if needed
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