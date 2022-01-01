


let apiKey = '147283db80fa8ad10af2072f2858a689'
let points = []

function changeLanguage(_language) { 
  language = _language
}
function changeUnits(_units) {
  units = _units
}


async function spawnWeatherTooltip(lat, lng, globe) {
  let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`)
  let json = await res.json()
  console.log(json)
  let celsius = parseInt(json.main.temp - 273.15)
  let html = `<div class="weather-tooltip">
    <h2>${json.name}</h2>
    <p>${json.weather[0].description}</p>
    <p>Temperature: ${celsius}°C</p>
    <p>Humidity: ${json.main.humidity}%</p>
    <p>Pressure: ${json.main.pressure}hPa</p>
    <p>Wind: ${json.wind.speed}m/s</p>   
    <button>Download weather data</button> 
  </div>`
  points.push({
    lat: lat,
    lng: lng,
    color: '#ff0000',
    size: 10,
    html: html
  })
  globe.pointsData(points)
}



export { spawnWeatherTooltip }