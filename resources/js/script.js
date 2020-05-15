// This function builds the url to research the weather
const buildURL = function() {
    
    let url = 'https://api.openweathermap.org/data/2.5/weather?';
    /*
    The keys in params variable is exactly the parameters to be 
    passed to the api call. Feel free to add mode options.
    */
    const params = {
        appid: 'fe1c679f235fc9a5bc4410ce1e339090',
        units: 'metric',
        q: document.getElementById('city-name').value
    };    
    let urlParams = [];

    for (let [key, value] of Object.entries(params)) {
        urlParams.push(key + '=' + value);
    }

    url += urlParams.join('&');

    console.log(url);

    return url;
};

/* 
This function will set the background image according to the
description of the weather for the researched city by the user.
Here, I'm using unsplash service to get the image.
*/
const setBackgroundImage = function(keywords) {

    const target = document.getElementById('body');
    let endpoint = 'https://source.unsplash.com/1980x1080/?weather,' + keywords.split(' ').join('%20');    
    target.style.backgroundImage = 'url(' + endpoint + ')';
    target.style.backgroundSize = 'cover';
    target.style.backgroundRepeat = 'no-repeat';    
};

// This function will render the response based on the status code
const renderResponse = function(res) {
    
    const output = document.getElementById('weather-info');

    if (res.status === 0) {
        output.innerHTML = '<p class="bg-2">It was not possible to complete your request</p>'
    } else if (res.status != 200) {
        output.innerHTML = `<p class="bg-2">${res.response.message}</p>`
    } else {        
        setBackgroundImage(res.response.weather[0].description);        
        console.log(res);
        listWeatherInfo(res.response);
    }    
};

// This function converts degree into direction
const windRose = function(degree) {
        
    const windRoseDir = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'];
    const index = Math.round(((windRoseDir.length-1) * degree) / 360);
    return windRoseDir[index];
};

// This function will create the elements to show the weather information
const listWeatherInfo = function(response) {
    
    const output = document.getElementById('weather-info');
    const weatherIcon = document.createElement('img');
    const title = document.createElement('h3');
    const clr = document.createElement('div');
    const ul = document.createElement('ul');    

    weatherIcon.src = 'http://openweathermap.org/img/wn/' + response.weather[0].icon + '.png';
    weatherIcon.className = 'icon';

    title.textContent = response.name + ' - ' + response.sys.country;

    clr.className = 'clr';

    if (response.main.temp) {
        let li = document.createElement('li');
        li.textContent = 'Temperature: ' + Math.round(response.main.temp) + ' °C';
        ul.appendChild(li);
    }    

    if (response.main.feels_like) {
        li = document.createElement('li');
        li.textContent = 'Feels Like: ' + Math.round(response.main.feels_like) + ' °C';
        ul.appendChild(li);
    } 

    if (response.main.humidity) {
        li = document.createElement('li');
        li.textContent = 'Humidity: ' + Math.round(response.main.humidity) + ' %';
        ul.appendChild(li);
    }    

    if (response.main.pressure) {
        li = document.createElement('li');
        li.textContent = 'Pressure: ' + Math.round(response.main.pressure) + ' hPa';
        ul.appendChild(li);
    }    
    
    if (response.clouds.all) {
        li = document.createElement('li');
        li.textContent = 'Clouds: ' + Math.round(response.clouds.all) + ' %';
        ul.appendChild(li);
    }

    if (response.rain) {
        li = document.createElement('li');
        li.textContent = 'Rain (1h): ' + response.rain['1h'] + ' mm';
        ul.appendChild(li);
    }

    if (response.wind) {
        li = document.createElement('li');
        li.textContent = 'Wind: ' + Math.round(3.6*response.wind.speed) + ' Km/h (' + windRose(response.wind.deg) + ')';
        ul.appendChild(li);
    }

    if (response.sys) {
        li = document.createElement('li');
        let time = new Date(response.sys.sunrise * 1000);
        li.textContent = 'Sunrise: ' + time.toString();
        ul.appendChild(li);
        li = document.createElement('li');
        time = new Date(response.sys.sunset * 1000);
        li.textContent = 'Sunset: ' + time.toString();
        ul.appendChild(li);
    }

    if (response.dt) {
        li = document.createElement('li');
        let time = new Date(response.dt * 1000);
        li.textContent = 'Last Update: ' + time.toString();
        ul.appendChild(li);
    }

    output.appendChild(weatherIcon);
    output.appendChild(title);    
    output.appendChild(clr);
    output.appendChild(ul);

    console.log(output);
};

/*
This function will make the request using the passed url.
Once the response ready, it will call the function 'renderResponse'
to deal with the response according to the status code.
*/
const makeRequest = function(url) {    
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {            
            renderResponse({
                status: xhr.status,
                response: xhr.response
            });
        }
    };
    xhr.open('GET', url);
    xhr.send();           
};

// This is the trigger function
const getWeatherInfo = function() {
    
    document.getElementById('weather-info').innerHTML = '';    
    const url = buildURL();    
    let response = makeRequest(url);    
}