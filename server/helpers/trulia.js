//-----------------------------------------------------------------------------------
//GET price of houses sold list, given a particular zip code
//example request: http://api.trulia.com/webservices.php?library=TruliaStats&function=getZipCodeStats&zipCode=90404&startDate=2014-01-01&endDate=2015-08-01&statType=listings&apikey=<INSERT API KEY HERE>
/*Prerequisites:
  zip code
  Website: Trulia

  TODO:
    change to real dates.
    parse the XML
*/
var trulia = function (zip) {
  var deferred = Q.defer();
  var truliaUrl_address = 'http://api.trulia.com/webservices.php?library=TruliaStats&function=getZipCodeStats&zipCode='
  var truliaUrl_start_date = '&startDate=2014-01-01'
  var truliaUrl_end_date = '&endDate=2015-08-01&statType=listings&apikey=';

  var truliaUrl = truliaUrl_address + zip + truliaUrl_start_date + truliaUrl_end_date + TruliaAPIKey;
  console.log('Sample URL for Trulia:', truliaUrl);

  http.get( truliaUrl, function (response) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        //console.log('Trulia data - BODY: ' + body);
        deferred.resolve(body);
      });
  }); //end of http.get

  return deferred.promise;
}