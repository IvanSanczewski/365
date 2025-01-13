// import data from './mockup.json' assert { type: 'json' };
import data from './mockup.json';

const visions = document.getElementById('visions');
console.log(typeof data, data);

async function fetchData() {
    try {
        const response = await fetch('./mockup.json');
        if (!response.ok) {
            console.log('IF');
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('NOT IF');
        console.log(typeof response, response);
        return await response.json();
    } catch (error) {
        console.log('CATCH');
        console.error('Error fetching data:', error);
    }
}


const createNodeItem = item => {
    const div = document.createElement('div');
}


function displayVisions() {
    visions.innerHTML = '';
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
}

// fetchData();
displayVisions();


const addPost = document.querySelector('.addNewPost');
const form = document.querySelector('.post-form');

function displayAddPost(){
    form.classList.toggle('hidden');
    console.log(form);
}

addPost.addEventListener('click', displayAddPost);