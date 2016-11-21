Evan changes

1: added api key to index.html 
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBA-HMQEmr9vMPbXjQBNlSuSITDRHlzTpQ&libraries=places"></script>

2: moved Marker-with-label to a local source in index.html
    <script src="lib/markerwithlabel.min.js"></script>

3: Replaced no longer available Instagram Pictures with ones from Google Places API.  They still need some formatting.

4: Fixed "BUY" neighborhood listing--the default max price was set wrong

5: Mostly fixed picture layout for new pictures.  Still have some inline styling that could be dealt with.

6: Fixed price data replacing zilpy & zillow for Quandl.  implemented estimated apartment sizes to let us use $/sqft data instead of apartment prices specific for each size.

Todos:  Fix demography slowing down everything else by moving this api call to a separate server ajax call.
        Add default picture for when google pics doesn't find/return anything.
