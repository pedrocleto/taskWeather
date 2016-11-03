import $ from "jquery";
import 'rxjs/add/observable/fromPromise';

class App  {

  constructor(){
    this.button = document.querySelector(".buttonSearch");
    this.button.addEventListener("click",this.search.bind(this));
    this.textfield = document.querySelector(".textSearch");
    this.textfield.addEventListener("keyup",this.searchKeyUp.bind(this));
    this.list = document.querySelector('.weatherContainer');
  }

 hide(element){ document.querySelectorAll(element)[0].style.display = 'none'};
 show(element){ document.querySelectorAll(element)[0].style.display = 'block'};
  
 clearList(){
    if(this.list){
      while (this.list.hasChildNodes()) {
          this.list.removeChild(this.list.lastChild);
      }
    }
  }

  searchKeyUp(event){
    if (event.keyCode == 13 && this.search) {
        this.search(event);
    }
  }
  search(event){
    let cityCountry=this.textfield.value;
    this.clearList();
    if(cityCountry){
      this.get5day(cityCountry).then(function(result){
          this.createTable(result);
      }.bind(this),function(error){
        this.list.insertAdjacentHTML('afterbegin', "<div>City not Found</div>");
        this.list.classList.remove("loading");
      }.bind(this));
    }
      
  }

 get5day(cityCountry){    
      this.list.classList.add("loading");
      let options = {
            url: 'http://api.openweathermap.org/data/2.5/forecast/city?q='+cityCountry+'&mode=json&units=metric&APPID=3f5e939b388989abcfd34a322025f786',
            type: 'GET',
            dataType: 'jsonp'};
      return new Promise(function (resolve, reject) {
        $.ajax(options).done(resolve).fail(reject);
      });
  }

   createTable(values){    
    this.clearList();

    console.log("creating...");

    if(values!==null){
      let template = [];
      let listValues = values.list;
      listValues.forEach((obj) => {
        let strEl ="<div class=\"weatherContent\" >";
          let main = obj.main;
          let weather = obj.weather[0];
          let wind =  obj.wind;
          let city = values.city;
          strEl += "<div>City:  "+city.name+","+city.country+"</div>";
          strEl += "<div>Date:  "+obj.dt_txt+" </div>";
          strEl += "<div>Min:  "+main.temp_min+"ºC </div>";
          strEl += "<div>Max:  "+main.temp_max+"ºC </div>";
          strEl += "<div>Weather:  "+weather.description+" </div>";
          strEl += "<div>Humidity:  "+main.humidity+" %</div>";
          strEl += "<div>Wind Speed:  "+wind.speed+" </div>";
          strEl += "</div>";
          template.push(strEl);
      });
      this.list.insertAdjacentHTML('afterbegin',template.join("\n"));

      this.list.classList.remove("loading");

   }
  }

}

export default App;
