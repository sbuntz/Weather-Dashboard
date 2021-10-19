
var fivedayForecastTitle = document.querySelector("#forecast");


var cityForm=document.querySelector("#citySearch");
var lookupCityInput=document.querySelector("#lookupCity");
var weatherContainer=document.querySelector("#currentWeather");
var citySearchInput = document.querySelector("#cityHistory");

var forecastContainer = document.querySelector("#fivedayForecast");
var pastSearchButton = document.querySelector("#searchHistory");

var cities = [];

var formSumbitHandler = function(event){
    event.preventDefault();
    var lookupCity = lookupCityInput.value.trim();
    if(lookupCity){
        getCityWeather(lookupCity);
        get5Day(lookupCity);
        cities.unshift({lookupCity});
        lookupCityInput.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(lookupCity);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(lookupCity){
    var apiKey = "9d93230f3ad2bc78a7973c5234d7ba2e"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${lookupCity}&units=metric&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, lookupCity);
        });
    });
};

var displayWeather = function(weather, searchCity){
  
   weatherContainer.textContent= "";  
   citySearchInput.textContent=  searchCity.charAt(0).toUpperCase() + searchCity.slice(1);

   var currentDate = document.createElement("h4")
   currentDate.textContent= " " + moment(weather.dt.value).format("MMM D, YYYY") ;
   citySearchInput.appendChild(currentDate);

   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInput.appendChild(weatherIcon);

   var temperature = document.createElement("span");
   temperature.textContent = "Temperature: " + weather.main.temp.toFixed(0) + " °C";
   temperature.classList = "weatherInformation"
  
   var humidity = document.createElement("span");
   humidity.textContent = "Humidity: " + weather.main.humidity + " %";
   humidity.classList = "weatherInformation"

   var windSpeed = document.createElement("span");
   windSpeed.textContent = "Wind Speed: " + weather.wind.speed.toFixed(1) + " m/s";
   windSpeed.classList = "weatherInformation"

   //append to container
   weatherContainer.appendChild(temperature);
   weatherContainer.appendChild(humidity);
   weatherContainer.appendChild(windSpeed);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   getUvIndex(lat,lon)
}

var getUvIndex = function(lat,lon){
    var apiKey = "9d93230f3ad2bc78a7973c5234d7ba2e"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
    //console.log(lat);
    //console.log(lon);
}
 
var displayUvIndex = function(index){
    var uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "weatherInformation"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "green"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "yellow"
    }
    else {
        uvIndexValue.classList = "red"
    };

    uvIndex.appendChild(uvIndexValue);


    weatherContainer.appendChild(uvIndex);
}

var get5Day = function(city){
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    forecastContainer.textContent = ""
    fivedayForecastTitle.textContent = "Five Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var fivedayForcast=document.createElement("div");
       fivedayForcast.classList = "card FiveDayCardForecast";


       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D");
       forecastDate.classList = "card-header text-center"
       fivedayForcast.appendChild(forecastDate);


       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       fivedayForcast.appendChild(weatherIcon);
       
       var forecastTemp=document.createElement("div");
       forecastTemp.classList = "card-body text-center";
       forecastTemp.textContent = dailyForecast.main.temp.toFixed(0) + " °C";

        fivedayForcast.appendChild(forecastTemp);

       var forecastHum=document.createElement("div");
       forecastHum.classList = "card-body text-center";
       forecastHum.textContent = dailyForecast.main.humidity + "  %";

       fivedayForcast.appendChild(forecastHum);
       forecastContainer.appendChild(fivedayForcast);
    }

}

var pastSearch = function(pastSearch){
     
    pastSearch = document.createElement("button");
    pastSearch.textContent = pastSearch;
    pastSearch.classList = "pastSearchButton";
    pastSearch.setAttribute("cities",pastSearch)
    pastSearch.setAttribute("type", "submit");



    pastSearchButton.prepend(pastSearch);
}


var pastSearchHistory = function(event){
    var city = event.target.getAttribute("cities")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}


cityForm.addEventListener("submit", formSumbitHandler);
pastSearchButton.addEventListener("click", pastSearchHistory);