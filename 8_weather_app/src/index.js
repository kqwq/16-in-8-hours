// Use Globe.gl with webpack
import Globe from 'globe.gl';
import { spawnWeatherTooltip } from './weather';

// Import SASS
import './app.sass'

// Remove margins and padding
document.body.style.margin = 0;
document.body.style.padding = 0;

const globeImages = {
  day: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg',
  night: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/BlackMarble20161km.jpg/2200px-BlackMarble20161km.jpg',
  earth2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Blue_Marble_2002_bg21600.png/2560px-Blue_Marble_2002_bg21600.png',
  moon: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Solarsystemscope_texture_2k_moon.jpg',
  mars: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Solarsystemscope_texture_2k_mars.jpg',
  night2: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Solarsystemscope_texture_2k_earth_nightmap.jpg',
  outline: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Solarsystemscope_texture_2k_earth_specular_map.tif/lossy-page1-2048px-Solarsystemscope_texture_2k_earth_specular_map.tif.jpg',
  clouds: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Solarsystemscope_texture_2k_earth_clouds.jpg'
}

const myGlobe = Globe();
myGlobe(document.getElementById('app'))
  .globeImageUrl(globeImages.day)
  .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')

  .pointLabel(p => p.html)
  .pointColor(p => p.color)
  .pointRadius(p => p.size)
  .lineHoverPrecision(0)
  
// Onclick event
myGlobe.onGlobeClick(e => {
  spawnWeatherTooltip(e.lat, e.lng, myGlobe);
});

// On resize event
window.addEventListener('resize', (event) => {
  myGlobe.width([event.target.innerWidth])
  myGlobe.height([event.target.innerHeight])
});