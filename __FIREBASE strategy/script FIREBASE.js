console.log('Environment:', window.ENV);

const visions = document.getElementById('visions');

async function fetchData() {
    try {
        if ( window.ENV === 'development') {
            console.log('IF STATEMENT');
            const response = await fetch('http://localhost:3000/api/posts');
            const data = await response.json();
            document.documentElement.style.setProperty('--visions-total', data.length);
            console.log(data);   
            displayVisions(data);
        } else {
            console.log('ELSE STATEMENT');
            const db = firebase.firestore();
            const querySnapshot = await db.collection('posts').get();
            const data = querySnapshot.docs.map(doc => doc.data());
            // document.documentElement.style.setProperty('--visions-total', data.length); // wil that work? It needs to calculate the total amount of posts and asign this value to the CSS var --visions-total 
            console.log(data);   
            displayVisions(data);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los posts');
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

// Verificar si el elemento existe
// (addPost === null)? console.log('null') : console.log('!null');
if (!addPost) {
    console.error('Elemento .addNewPost no encontrado');
} else {
    addPost.addEventListener('click', displayAddPost);
}

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
    
    try {
        if (window.ENV === 'development') {
            // Uses EXPRESS for DEVELOPMENT
            const formData = new FormData();
            formData.append('image', file);
            formData.append('text', text);
            formData.append('location', location);
            formData.append('year', year);
            // formData.append('password', password);
            
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                body: formData
            });
            alert('New vision added (development)');
            displayVisions();
            
            // Handles the response, showing a possible 4XX error
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: ${errorText}`);
            }
        } else {
            // Uses FIREBASE for PRODUCTION
            const storageRef = firebase.storage().ref(`images/${Date.now()}_${file.name}`);
            await storageRef.put(file);
            const imageUrl = await storageRef.getDownloadURL();
            
            // await firebase.database().ref('posts').push({
            await firebase.firestore().collection("posts").add({
                id: Date.now(),
                image: imageUrl,
                text,
                location,
                year
            });
            alert('New vision added (production)');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Attaches the submitForm function to the forms submit event
form.addEventListener('submit', postVision)




fetchData();
displayVisions();