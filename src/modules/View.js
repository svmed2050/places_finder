class View {

  showData(dataArray) {
    console.log('fetchCounter', view.fetchCounter);

    let table = document.querySelector('.info');
    table.insertAdjacentHTML('beforeend', `<th>Name</th><th>Distance</th>`);

    dataArray.map(el => {
      table.insertAdjacentHTML('beforeend', `<td>${el.name}</td><td>${el.distance}</td>`)
    });
  }

  loading() {
    view.rerenderTable();
    let divList = document.querySelector('#no-response')  
    divList.className = "spinner spinner-dotted";
  }

  rerenderTable() {
    let divList = document.querySelector('#no-response');  
    divList.innerHTML = '';
    divList.className = '';
    let table = document.querySelector('.info');
    table.innerHTML = '';
  }

  showNoPlacesFound() {
    let divList = document.querySelector('#no-response')
    divList.innerHTML = `There are no places here. <br> Try other coordinates.`
  }

}

export let view = new View();