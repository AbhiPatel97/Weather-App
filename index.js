const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// Initially variable needed 

let currentTab = userTab;
let API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab")
//ek kaam ar pending hai ??
getfromSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab != currentTab)
    {
        //color htao
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active"))
    {
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("actice");
        searchForm.classList.add("active");  
    }

    //phle search wale tab pr tha ab weather tab visible krna hai
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        //ab ypur weather tab me aa gya hu, to weathr bhi display krna pdega, so let's check local storage first
        // for coordinates, if we have them there.
        getfromSessionStorage();
    }
}

userTab.addEventListener("click", () => 
{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => 
{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage()
{
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        // agr local coordinates nii mile
        grantAccessContainer.classList.add("active");
    }

    else
    {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo (coordinates)
{
    const{lat, lon} = coordinates;

    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API Call
    try
    {
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
         const  data = await response.json();

         //data aa gya hai to loading screen ko htao
         loadingScreen.classList.remove("active");

         //user weather wala page visible krvao
         userInfoContainer.classList.add("active");
         renderWeatherInfo(data);
    }

    catch(err)
    {
        loadingScreen.classList.remove("active");
        //HW
    }
}

function renderWeatherInfo(weatherInfo)
{
    // let fetch the elements
    const cityName =  document.querySelector("[data-cityName]");
    const  countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from json object and put in UI element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getLocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        //Hw - show an alert for no geolocation support avaible
    }
}

function showPosition (position) 
{
    const userCoordinates =
    { 
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAcccesButton = document.querySelector("[data-grantAccess]");
grantAcccesButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) =>
    {
        e.preventDefault();
        let cityName = searchInput.value;
        if(cityName === "")
        {
            return; 
        }
        else
            fetchSearchWeatherInfo(cityName);
    }
)

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");


    try 
    {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }

    catch(err)
    {
        //hw
    }
    
}

