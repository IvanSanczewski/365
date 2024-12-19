import data from './mockup.json' assert { type: 'json' };

const meta = document.getElementById('meta');
const location = document.querySelector('.location');


function dispplayContent() {
    data.forEach(item => {
        location = item.location
    })
}

dispplayContent()