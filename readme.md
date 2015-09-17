# Turf

### A web application to help you move into any new locality in the United States, by showing you information about nearby neighborhoods and allowing you to compare them.

##User information

#####Searching for Neighborhoods
To get started:
- Type in an address or city that you would like to be close to
- Select if you would like to Rent or Buy
- Enter the number of bedrooms and bathrooms you are looking for

This will display a list of nearby neighborhoods as well as the price ranges to rent/buy homes there, as well as the commute distance and time to the address you provided.

#####Ordering the Search Results
You may also order the results by the search factors using the Order drop down

#####Filtering the Search Results
You can filter the search results by the following criteria:
- Maximum commute distance
- Maximum commute driving time

Expand the filter section by clicking on the Filter Options button to do this.


## Developer Information

### Getting Started

###Requirements

####Software

[Node.js](https://nodejs.org/en/): Use the installer for your OS.
[Git](http://git-scm.com/downloads): Use the installer for your OS.
  Windows users can also try [Git for Windows](http://git-for-windows.github.io/).
[Bower](http://bower.io/) Run npm install -g bower

From within the root directory:

```sh
npm install
bower install
```

####API's
- [Google Maps API](https://developers.google.com/maps/?hl=en) is used for the map, commute information and nearby places
- [Zilpy API](http://www.zilpy.com/api) is used for renting price information
- [Instagram API](https://instagram.com/developer/) is used to display photos from the area in the details view
- [Zillow API](http://www.zillow.com/howto/api/APIOverview.htm) is used for home purchase prices and Statistical data for the bar and pie charts


#### API keys

Create a file located at server/config/keys.js with your API key information:

```
module.exports = {
  zwsId : 'your zillow API key',
  instagramAccessToken : 'your instagram API key',
  googleAPIKey : 'your google API key',
};
```

Once you have a google API key make sure you enable the following APIs:
BigQuery API
Cloud Debugger API
Debuglet Controller API
Google Cloud SQL
Google Cloud Storage
Google Cloud Storage JSON API
Google Maps Directions API
Google Maps Distance Matrix API
Google Maps Embed API
Google Maps Geocoding API
Google Maps Geolocation API
Google Maps JavaScript API
Google Places API Web Service
Google Static Maps API
Google Street View Image API

#### The Tech Stack

- [Angular](https://angularjs.org/)
- [Node.js](https://nodejs.org/en/)
- [Bootstrap](http://getbootstrap.com/)
- [Slick Carousel](http://kenwheeler.github.io/slick/)

### Running the application

Once you have your API keys from the root directory, start the server using

```
nodemon index.js
```

Then just go to localhost:8000 in your browser to see this app in action!
