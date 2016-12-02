Evan's changes

1: added api key to index.html 
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBA-HMQEmr9vMPbXjQBNlSuSITDRHlzTpQ&libraries=places"></script>

2: moved Marker-with-label to a local source in index.html.  The CDN had stopped serving it.
    <script src="lib/markerwithlabel.min.js"></script>

3: Replaced no longer available Instagram Pictures with ones from Google Places API.  They still need some formatting.

4: Fixed "BUY" neighborhood listing--the default max price was set wrong

5: Mostly fixed picture layout for new pictures.  Still have some inline styling that could be dealt with.

6: Fixed price data replacing zilpy & zillow for Quandl.  implemented estimated apartment sizes to let us use $/sqft data instead of apartment prices specific for each size.

7: Fixed demography slowing down everything else by moving this api call to a separate server ajax call.  Needs some sort of warning on the statistics tab that information is coming if the user clicks it before that API call comes back--or some way of delaying+informing the user not to click it yet.

Todos:  
        See #7 above.
        Add default picture for when google pics doesn't find/return anything.
        Fix ugly result when user reloads page ( http://stackoverflow.com/questions/29273022/disable-refresh-browser-in-only-one-page-using-angularjs-or-javascript ) maybe?
        socket.io server reqs so the second api call can start sooner (after neighborhoods are found, when the other non-google calls happen)?
        Disable pan on map when screen size is very small so ipad users can scroll down?
        Fix map centering / scrolling issue on non-huge screens.
