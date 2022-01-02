
let apiKey = '147283db80fa8ad10af2072f2858a689'
let points = []
let language
let units

function changeLanguage(_language) { 
  language = _language
}
function changeUnits(_units) {
  units = _units
}

function temperatureToColor(temperature, maxHue = 190, minHue = 0) {
  let minTemperature = 40
  let maxTemperature = -40
  let percentage = (temperature - minTemperature) / (maxTemperature - minTemperature)
  const hue = percentage * (maxHue - minHue) + minHue;
  return `hsl(${hue}, 100%, 50%)`;
}

async function spawnWeatherTooltip(lat, lng, globe) {
  let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`)
  let json = await res.json()
  console.log(json)
  let celsius = parseInt(json.main.temp - 273.15)

  const flagUrl = `https://flagcdn.com/h20/${json.sys.country.toLowerCase()}.png`
  const countryName = new Intl.DisplayNames(['en'], {type: 'region'}).of(json.sys.country)

  let html = `<div class="weather-tooltip">
    <div class="weather-tooltip-header">
      <img src="${flagUrl}" alt="${countryName}">
      <span class="title">${json.name}</span><nobr>
      <i>${countryName}</i>
    </div>
    <p>${json.weather[0].description}</p>
    <p>Temperature: <b>${celsius}°C</b></p>
    <p>Humidity: <b>${json.main.humidity}%</b></p>
    <p>Pressure: <b>${json.main.pressure}hPa</b></p>
    <p>Wind: <b>${json.wind.speed}m/s</b></p>   
    <button>Download weather data</button> 
  </div>`
  console.log(html)
  points.push({
    lat: lat,
    lng: lng,
    color: temperatureToColor(celsius),
    size: 0.3,
    html: html
  })
  globe.pointsData(points)
}



export { spawnWeatherTooltip }