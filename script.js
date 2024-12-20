import data from './mockup.json' assert { type: 'json' };

const meta = document.getElementById('meta').innerHTML;
const caption = document.querySelector('.caption');


function displayContent() {
    for (const item in data) {  
        caption.textContent = `${data[item].location}, ${data[item].year}` 
    }
}

displayContent();