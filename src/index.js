import "./styles.css";

const startingApiQuery =
   'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
let loc;
let date;
const endingApiQuery =
   '?unitGroup=metric&key=JTJYM98KZK79DTE4DLMCXRZ8Y&contentType=json';
let completeApiQuery;

let successfulCheck = false;        // This will always be false when the page loads for the 1st time

let filteredWeatherData;

function getLocation() {
   const inputValue = document.querySelector('input').value;

   if (inputValue === '' && successfulCheck === false) {
      loc = '/Lashibi';
   } else {
      loc = `/${inputValue}`;
   }
   // completeApiQuery = startingApiQuery + loc + date + endingApiQuery;
}

function getCurrentDate() {
   const today = new Date();
   const formattedDate = today.toISOString().split('T')[0];
   date = `/${formattedDate}`;
   completeApiQuery = startingApiQuery + loc + date + endingApiQuery;
}

async function getWeatherData() {
   getLocation();
   getCurrentDate();

   try {
      const response = await fetch(completeApiQuery, { mode: 'cors' });
      const data = await response.json();
      filteredWeatherData = filterWeatherData(data);
   } catch (error) {
      console.error(error);
   }
}

function filterWeatherData(data) {
   return {
      location: data.resolvedAddress,
      temp: data.currentConditions.temp,
      humidity: data.currentConditions.humidity,
      windspeed: data.currentConditions.windspeed,
      condition: data.currentConditions.conditions,
   };
}

async function renderWeatherCondition() {
   await getWeatherData();

   const resCont = document.querySelector('.weather-condition-res');

   if (filteredWeatherData === undefined) {
      resCont.innerHTML = '';
      resCont.classList.add('error-msg');
      resCont.innerHTML = 'Invalid location<br />or<br />poor network!<br />Please try something else.';
   } else {
      resCont.innerHTML = '';
      resCont.classList.remove('error-msg');

      const pLocation = document.createElement('p');
      pLocation.className = 'location';
      pLocation.textContent = filteredWeatherData.location;

      const pTemp = document.createElement('p');
      pTemp.className = 'temp';
      pTemp.innerHTML = `${filteredWeatherData.temp}&deg;C`;

      const pHumidity = document.createElement('p');
      pHumidity.className = 'humidity';
      pHumidity.textContent = `Humidity: ${filteredWeatherData.humidity}%`;

      const pWind = document.createElement('p');
      pWind.className = 'windspeed';
      pWind.textContent = `Windspeed: ${filteredWeatherData.windspeed}km/h`;

      const pCondition = document.createElement('p');
      pCondition.className = 'condition';
      pCondition.textContent = filteredWeatherData.condition;

      resCont.appendChild(pLocation);
      resCont.appendChild(pTemp);
      resCont.appendChild(pHumidity);
      resCont.appendChild(pWind);
      resCont.appendChild(pCondition);

      filteredWeatherData = undefined;
   }

   successfulCheck = true;
}

function highlightBtn(event) {
   event.target.classList.add('highlight');
   setTimeout(() => {
      event.target.classList.remove('highlight');
   }, 200);
}

const checkWeatherBtn = document.querySelector('button');
checkWeatherBtn.addEventListener('click', highlightBtn);
checkWeatherBtn.addEventListener('click', renderWeatherCondition);

   // This is necessary because even though button type='button' is used, the keydown event, pressing Enter ignores the button type and still triggers an actual form submission
const form = document.querySelector('form');
form.addEventListener('submit', event => event.preventDefault());

document.addEventListener('keydown', (event) => {
   const key = event.key;
   if (key === 'Enter') {
      checkWeatherBtn.click();
   }
});

renderWeatherCondition();
