function setWeather() {
    const weather = JSON.parse(this.responseText);
    // Comment the above and uncomment below to make ui adjustments
    // const weather = [
    //     {
    //         current: {
    //             temperature: 86,
    //             feelslike: 91,
    //             skytext: "Sunny",
    //             humidity: "52",
    //             winddisplay: "4 mph Southwest",
    //             observationpoint: "Dayton, OH"
    //         }
    //     }
    // ]
    let temp = document.getElementById('temp');
    let feelslike = document.getElementById('feelslike');
    let skytext = document.getElementById('skytext');
    let humidity = document.getElementById('humidity');
    let wind = document.getElementById('wind');
    let place = document.getElementById('place');
    let image = document.getElementById('weather-img').attributes.src;

    var w = weather[0].current;
    temp.textContent = w.temperature  + "℉";
    feelslike.textContent = "(" + w.feelslike + "℉)";
    skytext.textContent = w.skytext;
    humidity.textContent = w.humidity + "%";
    wind.textContent = w.winddisplay;
    place.textContent = w.observationpoint;
    image = w.imageUrl;
}

function getWeather() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener('load', setWeather);
    xhttp.open("GET", "/weather", true);
    xhttp.send();
}

function getTime() {
    let date = document.getElementById('date');
    let time = document.getElementById('time');

    let d = new Date();
    let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    date.textContent = d.toLocaleDateString(undefined, options);

    time.textContent = d.toTimeString().split(' ')[0].split(":").slice(0, 2).join(":");
}

window.onload = function() {
    // TODO: Sensible timeout handling... 900000 = 15min
    getWeather();
    getTime();
    setInterval( () => {
        getWeather();
    }, 900000);
    setInterval( () => {
        getTime();
    }, 500); 
}