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
}]).factory('NationalHolidays', ['NationService', '$http', function(ns, $http){
  var key = "b09de4d7-921f-4841-9023-04c1c543a9a3";

  function getHolidaysByNation(nation){
    var url = "https://holidayapi.com/v1/holidays?country="+nation.countryCode+"&year=2016&month=09&key="+key;
    var holidays = localStorage.getItem(nation.countryCode+'_holidays');
    if(holidays){
      var def = $q.defer();
      def.resolve(JSON.parse(holidays));
      return def.promise;
    }
    return $http.get(url)
  }

  return{
    getHolidays: function(){
      var nation = localStorage.getItem('nation');
      if(nation){
        return getHolidaysByNation(JSON.parse(nation));
      }else{
        return ns.getNation().then(function(success){
            var nation = success.data
            localStorage.setItem('nation', JSON.stringify(nation));
            return getHolidaysByNation(nation);
        });
      }

    },

  }
}]).factory('NationService', ['$http', function($http){
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
        return "http://flagpedia.net/data/flags/normal/"+code+".png"
      }
    }
}])
