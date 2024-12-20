import data from './mockup.json' assert { type: 'json' };

const meta = document.getElementById('meta').innerHTML;
const caption = document.querySelector('.caption');

console.log(meta);
console.log(caption);


function displayContent() {
    for (const item in data) {
        meta.createNodeElement('p');
        caption.textContent = `${data[item].location}, ${data[item].year}` 
    }
}

displayContent();