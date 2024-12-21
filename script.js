import data from './mockup.json' assert { type: 'json' };

const content = document.getElementById('content');
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


function displayContent() {
    content.innerHTML = '';
    for (const item in data) {
        const li = document.createElement('li');

        const div = document.createElement('div');
        div.className = 'picture';

        const img = document.createElement('img');
        img.setAttribute('src', `${data[item].image}`);
        img.setAttribute('alt', 'some ALT text');

        const text = document.createElement('p');
        text.className = 'text';
        text.textContent = `${data[item].text}`
        
        const caption = document.createElement('p');
        caption.className = 'caption';
        caption.textContent = `${data[item].location}, ${data[item].year}`
        
        div.append(img, text)
        li.append(div, caption);
        content.appendChild(li);
    }
}



// fetchData();
displayContent();


// console.log(typeof data, data);
// console.log(typeof item, item);
// console.log(typeof data[item], data[item]);
// console.log(typeof data[item].text, data[item].text);

// console.log(typeof picture.innerHTML, picture.innerHTML);
// console.log(typeof text, text);

// const image = document.createElement('div');
// image.textContent = `${data[item].image}`;
// picture.innerHTML = image;
// // picture.appendChild(image);

// const p = document.createElement('p');
// p.textContent = `${data[item].text}`
// text.innerHTML = p;

// content.append(picture, text);


// caption.textContent = `${data[item].location}, ${data[item].year}` 