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
  return{
    getHolidays: function(){
      var url = "https://holidayapi.com/v1/holidays?country="+nationCode+"&year=2016&month=09&key="+key;
      var holidays = localStorage.getItem(nationCode+'_holidays');
      if(holidays){
        var def = $q.defer();
        def.resolve(JSON.parse(holidays));
        return def.promise;
      }
      return $http.get(url)
    }
  }
}]).factory('NationService', ['$http', function($http){
    return {
      getNationCode: function(){
        var nationCode = localStorage.getItem('nationCode');
        if(nationCode){
          var def = $q.defer();
          def.resolve(nationCode);
          return def.promise;
        }
        return $http.get('http://ip-api.com/json');
      }
    }
}])
