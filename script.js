// import data from './mockup.json' assert { type: 'json' };
import data from './mockup.json';

const visions = document.getElementById('visions');
console.log(typeof data, data);

// async function fetchData() {
//     try {
//         const response = await fetch('./mockup.json');
//         if (!response.ok) {
//             console.log('IF');
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         console.log('NOT IF');
//         console.log(typeof response, response);
//         return await response.json();
//     } catch (error) {
//         console.log('CATCH');
//         console.error('Error fetching data:', error);
//     }
// }

// Sets the CSS var --visions-total from the lenght of the data array 
async function fetchData() {
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


    // try {
    //     const response = await fetch('./mockup.json');
    //     if (!response.ok) {
    //         console.log('IF - NO RESPONSE');
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
        
    //     console.log('NOT IF - RESPONSE!!');
    //     console.log(typeof response, response);
        
    //     const data = await response.json();
    //     const visionsTotal = data.length;
    //     console.log(visionsTotal);
        
        
    //     document.documentElement.style.setProperty('--visions-total', visionsTotal);
    //     console.log(`CSS variable --visions-total set to: ${visionsTotal}`);

        
    // } catch (error) {
    //     console.log('CATCH');
    //     console.error('Error fetching data:', error);
    // }
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
async function postVision(event) {
    event.preventDefault(); // Prevents the form to be submited by default

    const formData= new FormData();
    formData.append('image', document.getElementById('file-upload').files[0]);
    formData.append('text', document.getElementById('text').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('year', document.getElementById('year').value);
    formData.append('password', document.getElementById('password').value);
    
    try {
        const response = await fetch('http://localhost:3000/api/posts', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Network response failure');
        
        const result = await response.json();
        alert(result.message);
        location.reload();
    } catch (error) {
        console.log('error:', error);
        alert('there was an error while uploading the vision');
    }

    
    
    // const formData = {
    //     iamge: document.getElementById('file-upload').files[0]?.name || "", // Gets the file name
    //     text: document.getElementById('text').value,
    //     location: document.getElementById('location').value,
    //     year: document.getElementById('year').value,
    //     id: Date.now() // Generates a unique ID based on the timestamp
    // };

    // try {
    //     const response = await fetch('https://365.hostinger.com/api.php', {
    //         method: 'POST', 
    //         headers: {'Content-Type': 'application/json',},
    //         body: JSON.stringify(formData),

    //     });

    //     if (!response.ok) {
    //         throw new Error('Network response failure');
    //     }

    //     const result = await response.json();
    //     console.log(result.message); 
    //     alert('New vision successfully added!');
    //     location.reload(); // Reloads the page to display the new post

    // } catch (error) {
    //     console.error('Error submiting form:', error);
    //     alert('Failed to add post. Please try again');

    // }
}



// Attaches the submitForm function to the forms submit event
form.addEventListener('submit', postVision)




fetchData();
displayVisions();