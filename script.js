import data from './mockup.json' assert { type: 'json' };

const meta = document.getElementById('meta');
const location = document.querySelector('.location');
const year = document.querySelector('.year');


function dispplayContent() {
    data.forEach(item => {
        console.log(location, year);
        // meta.createNodeElement('div')
        // location.textContent = item.location
        // location.textContent = item.year
    })
}

dispplayContent()