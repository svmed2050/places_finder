import './sass/main.css';

import {view} from './modules/View';
import {model} from './modules/Model';
import {config} from './modules/config';

// Валидация
import {isLatitude, isLongitude} from './modules/validate.js' 

// Импортируем Observer
import {showDataAll} from './modules/observer';


class Controller {
  constructor(model, view) {

    this.latitudeUser = document.querySelector('.input-latitude');
    this.longitudeUser = document.querySelector('.input-longitude');

    // Это для теста из файла config
    this.latitudeUser.value = config.latValue;
    this.longitudeUser.value = config.lonValue;

    this.model = model;
    this.view = view;

  }

    init() {
      const btn = document.querySelector('.search-button');
      btn.addEventListener('click', () => control.start(this.latitudeUser.value, this.longitudeUser.value));
    }

  
    async start(lat, lon) {

      if(!isLatitude(lat)) {
        return
      }
      // Валидация долготы
      if(!isLongitude(lon)) {
        return
      }

      view.loading();

      let resCache = model.getCacheData(lat, lon);

      if(resCache) {
        view.rerenderTable();
        view.showData(resCache)
      } else {
        
        let searchRes;
        await model.searchArray(lat, lon).then(res => searchRes = res);

        // вернуло false
        if(searchRes === false) { 
          view.rerenderTable();
          view.fetchCounter = model.fetchCounter;
          view.showNoPlacesFound();
        }
        
        // вернуло Array
        if(Array.isArray(searchRes)) { 

          // Выводим результат
          view.rerenderTable();
          view.fetchCounter = model.fetchCounter;
          showDataAll.fire(searchRes)

        }

        // вернуло Object
        if(!Array.isArray(searchRes)) {

          let {radiusLeft, radiusRight} = searchRes;
          let newArray;
          await model.binarySearch(radiusLeft, radiusRight, lat, lon)
          .then(res => newArray = res);

          // Выводим результат
          view.rerenderTable();
          view.fetchCounter = model.fetchCounter;
          showDataAll.fire(newArray)
   
        }
      }
    }
}

let control = new Controller(model, view);

control.init();

showDataAll.subscribe(model.prepareToShowData)
showDataAll.subscribe(model.assignToCache.bind(model))
showDataAll.subscribe(view.showData)









