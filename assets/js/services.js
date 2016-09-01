myApp.factory('JewishHolidaysService', ['$http', function($http) {
  return {
    getHolidays: function(){
      $http.get('http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&year=now&month=x&ss=off&mf=off&c=off&geonameid=3435910&m=50&s=off&lg=sh')
      .then(function(success){

      })
    },
    getDate: function(){
      
    }
  }
}]);
