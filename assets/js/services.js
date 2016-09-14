israel.factory('JewishHolidaysService', ['$http', '$q', function($http, $q) {
  var hebcal = "http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&year=now&month=x&ss=off&mf=off&c=off&geonameid=3435910&m=50&s=off&lg=sh"
  return {
    getHolidays: function(){
      var jewishHolidays = localStorage.getItem('jewish_holidays');
      if(jewishHolidays){
        var def = $q.defer();
        def.resolve(JSON.parse(jewishHolidays));
        return def.promise;
      }
      return $http.get(hebcal)
    },
    getDate: function(){
      var today = moment().startOf('day');
      return today._d;
    }
  }
}]).factory('NationalHolidays', ['NationService', '$http', '$q', function(ns, $http, $q){
  var key = "b09de4d7-921f-4841-9023-04c1c543a9a3";

  function getHolidaysByNation(nation){
    var supported = checkSupportedCountries(nation.data.countryCode)
    if(!supported){
      var data = {
        data:{
          "holidays": []
        }
      }
      var def = $q.defer();
      def.resolve(data);
      return def.promise
    }
    if(supported == 1){
        var url = "https://holidayapi.com/v1/holidays?country="+nation.data.countryCode+"&year=2016&month=09&key="+key;
    }else{
      var url = "https://thenextholiday-1c49d.firebaseio.com/holidays/"+nation.data.countryCode+".json"
    }
    var holidays = localStorage.getItem(nation.data.countryCode+'_holidays');
    if(holidays){
      var def = $q.defer();
      def.resolve(JSON.parse(holidays));
      return def.promise;
    }
    return $http.get(url)
  }

  function checkSupportedCountries(countryCode){
    if(supportedCountries.indexOf(countryCode)>=0)
      return 1
    return firebaseCountries.indexOf(countryCode)>=0 ? 2 : false;
  }
  return{
    getHolidays: function(){
      var nation = localStorage.getItem('nation');
      if(nation){
        return getHolidaysByNation(JSON.parse(nation));
      }else{
        return ns.getNation().then(function(success){
            var nation = success
            localStorage.setItem('nation', JSON.stringify(nation));
            return getHolidaysByNation(nation);
        }, function(error){
          var data = {
            data:{
              "holidays": []
            }
          }
          var def = $q.defer();
          def.resolve(data);
          return def.promise
        });
      }

    },

  }
}]).factory('NationService', ['$http', '$q', function($http, $q){
    return {
      getNation: function(){
        var nation = localStorage.getItem('nation');
        if(nation){
          var def = $q.defer();
          def.resolve(JSON.parse(nation));
          return def.promise;
        }
        return $http.get('http://ip-api.com/json');
      },
      getFlagByCode: function(code){
        return "http://flagpedia.net/data/flags/normal/"+code.toLowerCase()+".png"
      }
    }
}])
