Evan changes

1: added api key to index.html 
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBA-HMQEmr9vMPbXjQBNlSuSITDRHlzTpQ&libraries=places"></script>

2: moved Marker-with-label to a local source in index.html
    <script src="lib/markerwithlabel.min.js"></script>

3: Replaced no longer available Instagram Pictures with ones from Google Places API.  They still need some formatting.

4: Fixed "BUY" neighborhood listing--the default max price was set wrong

5: Mostly fixed picture layout for new pictures.  Still have some inline styling that could be dealt with.

Todos:  Fix demography by using http://geodataservice.net/DemographicsAPI.aspx  Also, disable statistics until the demography comes back separately.
        Fix rental / purchase estimates (via Quandl)
        Prices from Quandl are not useful for rental size.  use small/medium/large estimates with their $/sqft, and throw in like 650/750/1000 to get usable numbers.