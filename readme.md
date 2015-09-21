# Turf
[![Dependency Status](https://david-dm.org/Capstone-Makersquare/New-Neighbors/dev.svg)](https://david-dm.org/Capstone-Makersquare/New-Neighbors/dev)
[![devDependency Status](https://david-dm.org/Capstone-Makersquare/New-Neighbors/dev/dev-status.svg)](https://david-dm.org/Capstone-Makersquare/New-Neighbors/dev#info=devDependencies)<br>

#### A web application that helps you move into any new area by showing you information about nearby neighborhoods so you can see how well they suit your style.

##User information

#####Getting Started and Searching
- Type in a specific address or a general region that you would like to be close to
- Select if you would like to Rent or Buy
- Enter the number of bedrooms and bathrooms you desire

This displays a list of nearby neighborhoods.  Each neighborhood is shown with the price ranges to live there, as well as the commute distance and time to the address provided.

######Ordering the Search Results
You can prioritize the results by using the Order drop down

######Filtering the Search Results
By clicking on the Filter Options button, you can filter the search results by the following criteria:
- Price
- Commute distance
- Commute driving time

#####Exploring a Neighborhood's Details
To get details on a neighborhood click on its name to open the details view
- In the details view you can see a stream of nearby Instagram photos

######Amenities and Attractions
Click on the buttons to see the types of Amenities and Attractions close by
+ Amenities will display nearby: libraries, stores, restaurants, schools...
+ Attractions will display nearby: museums, night clubs, staduims...

######Statistics
From the details view click on the Statictics button to see
+ The Median Household Income, Size and Construction Year
+ The pie chart with the Resident Age Distribution
+ The bar chart showing how the neighborhood compares with the nation for percentage of:
    + homes with kids
    + property owners vs. renters
    + single residents



## Developer Information

### Strategy
Our goals were threefold: 
- To make the user feel comfortable browsing our app, the way they would in a suitable neighborhood
- To deliver a multitude of data, returned quickly from several APIs
- To give the user the feeling of a neighborhood--not just its raw facts

We created a crisp clear design style, with colors you might find on a cozy couch.  We used AngularJS with UI Router so we could load subviews instantly without needing to wait for other parts of the page to reload.  On the back end Node, Express, and Q provided fast, reliable timing on several parallel asynchronous API calls.  We delivered nearby Instagram photos to convey the personality and culture of the area.  

###Front End

####Client Application Information
We loosely modeled the directory structure from the best practices demonstrated in the following article:
https://scotch.io/tutorials/angularjs-best-practices-directory-structure

```
app
├── app.js
├── mainCtrl.js
├── services.js
├── attractions
│   └── attractionsTemplate.html
├── charts
│   ├── chartsController.js
│   ├── chartsDirective.js
│   └── chartsTemplate.html
├── details
│   ├── detailsController.js
│   ├── detailsService.js
│   └── detailsTemplate.html
├── filter
│   ├── filterController.js
│   ├── filterDirective.js
│   └── filterTemplate.html
├── landing
│   └── landing.html
├── main
│   └── main.html
├── map
│   ├── mapController.js
│   ├── mapDirective.js
│   ├── mapService.js
│   └── mapTemplate.html
├── results
│   └── resultsTemplate.html
├── searchForm
│   ├── searchFormController.js
│   ├── searchFormDirective.js
│   └── searchFormTemplate.html
├── services
│   └── servicesTemplate.html
└── thumbnails
    ├── thumbnailsController.js
    ├── thumbnailsDirective.js
    └── thumbnailsTemplate.html
```
###Back End

####Server Information
The server makes asynchronous calls to various API endpoints so that the data can be passed to the user quickly. The promise library Q was used to simplify the callback complexities with Node. There is no database for this application because APIs used did not allow persistant data.

```
server
  ├── config
  │   ├── keys.js
  │   └── middleware.js
  ├── helpers
  │   ├── geoCode.js
  │   ├── getDistances.js
  │   ├── getInstagram.js
  │   ├── getRequest.js
  │   ├── getXmlRequest.js
  │   ├── queryAmenitiesAndAttractions.js
  │   ├── reverseGeocode.js
  │   ├── trulia.js
  │   ├── zillow.js
  │   └── zilpy.js
  └── server.js
```

###Requirements

####Software

[Git](http://git-scm.com/downloads): Use the installer for your OS.
[Node.js](https://nodejs.org/en/): Use the installer for your OS. 
[Bower](http://bower.io/) Run npm install -g bower

From within the root directory:

```sh
npm install
bower install
```

####API's
- [Google APIs](https://developers.google.com/maps/?hl=en) is used for the map, commute information, nearby neighborhoods, attractions, and amenities
- [Zilpy API](http://www.zilpy.com/api) is used for rental price information
- [Instagram API](https://instagram.com/developer/) is used to display photos from the area
- [Zillow API](http://www.zillow.com/howto/api/APIOverview.htm) is used for home sale values and demographic statistics

#### API keys

Create a file located at server/config/keys.js with your API key information:

```
module.exports = {
  zwsId : 'your zillow API key',
  instagramAccessToken : 'your instagram API key',
  googleAPIKey : 'your google API key',
};
```

#####Instagram
Go [here](https://instagram.com/developer/authentication/) to sign up for an access token.

#####Zillow
Go [here](http://www.zillow.com/howto/api/APIOverview.htm) to sign up for an API key.

#####Google
Go [here](https://console.developers.google.com) to request an API key.

Once you have a google API key make sure you enable the following APIs:
- Google Maps Directions API
- Google Maps Distance Matrix API
- Google Maps Embed API
- Google Maps Geocoding API
- Google Maps JavaScript API
- Google Places API Web Service
- Google Street View Image API

#### The Tech Stack

- [Angular](https://angularjs.org/) v1.4.5
- [Angular Animate](https://docs.angularjs.org/api/ngAnimate) v1.4.5
- [Angular UI Bootstrap](https://angular-ui.github.io/bootstrap/) v0.13.4
- [UI Router](https://angular-ui.github.io/ui-router/site/#/api/ui.router) v0.2.15
- [Node](https://nodejs.org/en/) v0.12.7
- [Express](https://expressjs.com/) v4.13.3
- [Q](https://github.com/kriskowal/q) v1.4.1
- [Bootstrap](http://getbootstrap.com/) v3.3.5
- [Slick Carousel](http://kenwheeler.github.io/slick/) v1.5.8
- [Highcharts](http://www.highcharts.com/) v4.1.8

### Running the application

Once you have your API keys and dependencies installed, start the server from the root directory using

```
nodemon index.js
```

Then just go to localhost:8000 in your browser to see this app in action!
