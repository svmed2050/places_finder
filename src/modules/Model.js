// Конфигурационный файл
import {config} from './config.js';
// Считаем расстояние двух точек через ширину и долготу
import {getDistanceFromLatLonInKm} from './getDistance.js'

let cache = {};

class Model {

  constructor() {
    this.latInt1 = ''
    this.latFrac1 = ''
    this.lonInt1 = ''
    this.lonFrac1 = ''
    this.lat = 0;
    this.lon = 0;
    this.fetchCounter = 0;
  }
// Сделали без внутринних вызовов
  getCacheData(lat, lon) {
 
    this.lat = lat;
    this.lon = lon

    if(lat.indexOf('.') !== -1) {
      let latIndex = lat.indexOf('.')
      this.latInt1 = lat.slice(0, latIndex);
      this.latFrac1 = '0.' + lat.slice(latIndex + 1); // 0.XXXXX
    } else {
      this.latInt1 = lat;
      this.latFrac1 = 0;
    }
  
    // console.log(  'this.latInt1',   this.latInt1);
  
    if(lon.indexOf('.') !== -1) { 
      let lonIndex = lon.indexOf('.')
      this.lonInt1 = lon.slice(0, lonIndex);
      this.lonFrac1 = '0.' + lon.slice(lonIndex + 1);
    } else {
      this.lonInt1 = lon;
      this.lonFrac1 = 0;
    }


    if(this.latInt1 in cache) {
      
      for(let latFrac in cache[this.latInt1]) {
  
        if(Math.abs(this.latFrac1 - latFrac) <= 0.0002) {
  
          if(this.lonInt1 in cache[this.latInt1][latFrac]) {
  
            for(let lonFrac in cache[this.latInt1][latFrac][this.lonInt1]) {
  
               if(Math.abs(this.lonFrac1 - lonFrac) <= 0.0002) {
                console.log('Достаем из кеша');
                let newArray = cache[this.latInt1][latFrac][this.lonInt1][lonFrac]
                // control.newDataFromCache(newArray);
                return newArray;
               }
            }
          }
        }
      }
  }
  
    // console.log('Запускаем searchArray()');
    // this.searchArray()
    return false // Это будет значить, что нужно запустить searchArray()
  }

  searchArray = async function(lat, lon) { 
  
    let radiusLeft = 	config.radiusLeft; 
    let radiusRight = config.radiusRight;
    let left, right
    let data;
 
    // Узначем значение в left
    await this.placeSearch(radiusLeft, lat, lon).then(value => {
      data = value;
      left = value?.results?.length || 0});

     // Делаем проверки для left
     if (left === 1) {
      console.log('мы здесь');
      // showDataAll.fire(data.results);
      return data.results;
     }
  
     if (left > 1) {

      // showDataAll.fire(data.results);
      return data.results;
     } 
    

    // Узначем значение в right
    await this.placeSearch(radiusRight, lat, lon).then(value => {
      data = value;
      right = value?.results?.length || 0});
  
    // Делаем проверки для right
    if(right === 1) {
      // showDataAll.fire(data.results);
      return data.results;
    }
  
    if(right > 1 && right < 10) {
      // showDataAll.fire(data.results);
      return data.results;
    }

      while(right === 0) {
        
        radiusRight += 10000;
  
        if(radiusRight >= 100000) {
          radiusRight = 100000;
        }
  
        await this.placeSearch(radiusRight, lat, lon).then(value => {
          data = value;
          right = value?.results?.length || 0});
  
          if(right === 1) {
            // showDataAll.fire(data.results);
            return data.results;
          }
  
          if(right > 1 && right < 10) {
            // showDataAll.fire(data.results);
            return data.results;
          }
  
          if(right === 10) {
            /* Подвинем левый край, поскольку 
            предыдущее значение right = 0 */
            radiusLeft = radiusRight - 10000;
            break;
          }
  
          if(radiusRight === 100000) {
            // control.noPlacesFound();
            return false;
          }
      }

      // Начинаем бинарный поиск при left = 0 и right = 10
      // this.binarySearch(radiusLeft, radiusRight);

      return {radiusLeft, radiusRight}
  }

  binarySearch = async function(radiusLeft, radiusRight, lat, lon) {

    let data;
    let radiusMid, mid = 0;

    while(mid !== 1) {

    let prevRadiusMid = radiusMid;

    // Нашли точку в середине
    radiusMid = Math.round((radiusRight - radiusLeft) / 2) + radiusLeft;

    /* Вот здесь делаем проверку окольного расстояния 
    и обрабатываем граничные случаи */
    if(Math.abs(prevRadiusMid - radiusMid) < 20) {
      if(mid === 10) {
        // showDataAll.fire(data.results);
        return data.results;
      }
      if(mid === 0) {
        await this.placeSearch(radiusRight, lat, lon).then(value => {
          data = value;
          mid = value?.results?.length || 0});

          // showDataAll.fire(data.results);
          return data.results;
      }

    }

    // Посчитали значение mid в этой точке
    await this.placeSearch(radiusMid, lat, lon).then(value => {
      data = value;
      mid = value?.results?.length || 0});

     if(mid === 1) {
      // showDataAll.fire(data.results);
      return data.results;
     } 

     if(mid > 1 && mid < 10) {
      // showDataAll.fire(data.results);
      return data.results;
     }

     if(mid === 10) {
      radiusRight = radiusMid - 10
     }

     if(mid === 0) {
      radiusLeft = radiusMid + 10
     }    
}

  }

  placeSearch = async function(radius, lat, lon) {

    this.fetchCounter++;

  const optionsInFetch = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      // Authorization: 'fsq3p4FP65cE0UfDf+NDLb+XenjPZ9v8emRBfdCyqdYy2eY=',
      Authorization: 'fsq3TeMJgpL5/+RHkaF1heZMd597KYyIU1B6AePJmB1Pzpo=',
    }
  };
  
  const searchParams = new URLSearchParams({
    ll: `${lat},${lon}`, 
    open_now: 'true',
    radius: radius,
  });
  
  const urlFetch = `https://api.foursquare.com/v3/places/search?${searchParams}`;
  
    try {
        const results = await fetch(urlFetch, optionsInFetch);
        const data = await results.json();
        console.log(data);
        return data
    } catch (err) {
        console.error(err);
    }
  }

  prepareToShowData(dataArray) {

    dataArray = model.countDistanceInData(dataArray);
  
    // Если в массиве больше 1 значения, то сортируем
    if(dataArray.length > 1) {
      dataArray = model.sortDataByDistance(dataArray);
    }

  }
  
  assignToCache(newArr) {

    let newObj =  {
            [this.latInt1]: {
              [this.latFrac1]: {
                [this.lonInt1]: {
                  [this.lonFrac1]: newArr
                }
              }
            } 
          }
  
    cache = _.merge(cache, newObj);
    console.log("cache", cache);
  }

  countDistanceInData(resultsArray) {

    resultsArray.map(el => {
      const dist2points = getDistanceFromLatLonInKm(this.lat, this.lon, el?.geocodes?.main?.latitude, el?.geocodes?.main?.longitude);
      el.distance = dist2points;
    })
    return resultsArray;
  } 
  
  sortDataByDistance(resultsArray) {
  
    resultsArray = resultsArray.sort((el1, el2) => el1.distance - el2.distance);
  
    let minValue = resultsArray[0].distance;
    for (let i = 1; i < resultsArray.length; i++) {
      if (Math.abs(resultsArray[i].distance - minValue) > 5) {
        resultsArray.splice(i, 1); 
        i--;
      }
    }
  }

}

let model = new Model();

export {model}