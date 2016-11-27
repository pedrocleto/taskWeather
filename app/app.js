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
          this.createTable(this.processResult(result),result);
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

  processResult(result){
    let listValues = result.list;
    let values = {};
    listValues.forEach((obj) => {
      let date = new Date(obj.dt_txt);
      if(!values[date.toDateString()]){
        values[date.toDateString()]=[obj];
      }else{
        values[date.toDateString()].push(obj);
      }
    });
    return values;
  }
   createTable(values, mainObject){    
    this.clearList();

    console.log("creating...");

    if(values!==null){
      let template = [];
      for (let key in values){
          let objects = values[key];

          let strElDay ="<div class=\"weatherContentDay\" >";
          strElDay += "<div>"+key+" </div>";

          objects.forEach((obj)=>{
            let date = new Date(obj.dt_txt);
            let strEl ="<div class=\"weatherContent\" >";
            let main = obj.main;
            let weather = obj.weather[0];
            let wind =  obj.wind;
            let city = mainObject.city;
            strElDay+=strEl;
            strElDay += "<div>"+date.toLocaleTimeString()+" </div>";
            strElDay += "<div>Min:  "+main.temp_min+"ºC </div>";
            strElDay += "<div>Max:  "+main.temp_max+"ºC </div>";
            strElDay += "<div>"+weather.description+" </div>";
            strElDay += "<div>Humidity:  "+main.humidity+" %</div>";
            strElDay += "<div>Wind Speed:  "+wind.speed+" </div>";
            strElDay += "</div>";
          });
          strElDay += "</div>"

          template.push(strElDay);
      }
      
      this.list.insertAdjacentHTML('afterbegin',template.join("\n"));

      this.list.classList.remove("loading");

   }
  }

}

export default App;
