import data from './mockup.json' assert { type: 'json' };

const meta = document.getElementById('meta');
const location = document.querySelector('.location');


function dispplayContent() {
    console.log(location.innerHTML);
    data.forEach(item => {
        console.log(location);
        location = item.location
    })
}

dispplayContent()