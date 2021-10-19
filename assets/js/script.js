var cities = [];
var lookupCityInput=document.querySelector("#lookupCity");
var weatherContainer=document.querySelector("#currentWeather");
var citySearchInput = document.querySelector("#cityHistory");
var forecastTitle = document.querySelector("#forecast");
var forecastContainer= document.querySelector("#fivedayForecast");
var pastSearchButton = document.querySelector("#searchHistory");

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
   temperature.textContent = "Temperature: " + weather.main.temp + " °C";
   temperature.classList = "weatherInformation"
  
   var humidity = document.createElement("span");
   humidity.textContent = "Humidity: " + weather.main.humidity + " %";
   humidity.classList = "weatherInformation"

   var windSpeed = document.createElement("span");
   windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " m/s";
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
            uvIndexColour(data)
        });
    });
    //console.log(lat);
    //console.log(lon);
}
 
var uvIndexColour = function(index){
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
    else if(index.value >8){
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
    forecastTitle.textContent = "Five Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card FiveDayCardForecast";


       var forecastDate = document.createElement("h3")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);


       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       forecastEl.appendChild(weatherIcon);
       
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °C";

        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

       forecastEl.appendChild(forecastHumEl);
       forecastContainer.appendChild(forecastEl);
    }

}

var pastSearch = function(pastSearch){
     
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "pastSearchButton";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");



    pastSearchButton.prepend(pastSearchEl);
}


var pastSearchHistory = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

cityFormEl.addEventListener("submit", formSumbitHandler);
pastSearchButton.addEventListener("click", pastSearchHistory);