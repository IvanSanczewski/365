// import data from './mockup.json' assert { type: 'json' };
import data from './mockup.json';

const visions = document.getElementById('visions');
console.log(typeof data, data);

// Sets the CSS var --visions-total from the lenght of the data array 
async function fetchData() {

    // window.ENV needs to be set in index.html
    if (window.ENV === 'development') {
        // in DEV environment uses mockup.json through Express
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();
        displayVisions(data);
    } else {
        // in PRODUCTION environment uses FIREBASE
        const snapshot = await firebase.database().ref('posts').once('value');
        const data = snapshot.val() || [];
        displayVisions(data);
    }

    try {
        const response = await fetch('http:localhost:3000/api/posts');
        const data = await response.json();
        const visionsTotal = data.length;

        document.documentElement.style.setProperty('--visions-total', visionsTotal);
        console.log(`CSS variable --visions-total set to: ${visionsTotal}`);

        displayVisions(data); // Sends data as params to the function to display them

    } catch (error) {
        console.error('error fetching data:', error);
    }
}




// Creates the HTML nodes and to display the posts content
function displayVisions(data) {
    visions.innerHTML = '';
    // data.forEach(item => {
        for (const item in data) {
            const li = document.createElement('li');
            li.classList.add('vision-element');

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
    // })
}


const addPost = document.querySelector('.addNewPost');
const form = document.querySelector('.post-form');
(addPost === null)? console.log('null') : console.log('!null');

// Toggles the visibility of the form
function displayAddPost(){
    form.classList.toggle('hidden');
    console.log(form);
}

addPost.addEventListener('click', displayAddPost);



// Displays the selected file name in the form  
document.addEventListener("DOMContentLoaded", () =>  {
    const fileInput = document.getElementById('file-upload');
    const fileNameContainer = document.querySelector('.selected-file');

    fileInput.addEventListener("change", event => {
        const fileName = event.target.files.length > 0 ? event.target.files[0].name : "No file selected"
        fileNameContainer.textContent = fileName;
    });
});



// Handles the form submision
// async function postVision(event) {
//     event.preventDefault(); // Prevents default form submit

//     const formData= new FormData();
//     formData.append('image', document.getElementById('file-upload').files[0]);
//     formData.append('text', document.getElementById('text').value);
//     formData.append('location', document.getElementById('location').value);
//     formData.append('year', document.getElementById('year').value);
//     formData.append('password', document.getElementById('password').value);

    
//     try {
//         const response = await fetch('http://localhost:3000/api/posts', {
//             method: 'POST',
//             body: formData
//         });

//         if (!response.ok) throw new Error('Network response failure');

//         const result = await response.json();
//         alert(result.message);
//         location.reload();
//     } catch (error) {
    //         console.log('error:', error);
    //         alert('there was an error while uploading the vision');
    //     }
// }
    
async function postVision(event) {
    event.preventDefault(); // Prevents default form submit
    
    const file = document.getElementById('file-upload').files[0];
    const text = document.getElementById('text').value;
    const location = document.getElementById('location').value;
    const year = document.getElementById('year').value;
    const password = document.getElementById('password').value;
    
    if (password !== 'kapuscinski') {
        alert('Contraseña incorrecta');
        return;
    }
    
    if (window.ENV === 'development') {
        // Uses EXPRESS for DEV
        const formData = new FormData();
        formData.append('image', file);
        formData.append('text', text);
        formData.append('location', location);
        formData.append('year', year);
        formData.append('password', password);
        
        const response = await fetch('http://localhost:3000/api/posts', {
            method: 'POST',
            body: formData
        });
        // Handles the response, showing a possible 4XX error
        if (!response.ok) {
            const errorText = await response.text()
;            throw new Error(`Error ${response.status}: ${errorText}`);
        }
    } else {
        // Uses FIREBASE for PROD
        const storageRef = firebase.storage().ref(`images/${Date.now()}_${file.name}`);
        await storageRef.put(file);
        const imageUrl = await storageRef.getDownloadURL();

        await firebase.database().ref('posts').push({
            id: Date.now(),
            image: imageUrl,
            text,
            location,
            year
        });
    }
}


// Attaches the submitForm function to the forms submit event
form.addEventListener('submit', postVision)




fetchData();
displayVisions();