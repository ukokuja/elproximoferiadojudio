israel.directive('jewishHolidays', ['$timeout', function($timeout){
  return {
    restrict: 'E',
    templateUrl: "/assets/templates/jewish-holiday.html",
    link: function(scope, element, attrs){
      var banner = element[0].getElementsByTagName('section');
      scope.next = function(){
        $(banner).fadeOut("fast",function(){
          scope.$apply(function(){
            scope.id++;
          })
          $(banner).fadeIn("fast");
        });
      }
      scope.previous = function(){
        $(banner).fadeOut("fast",function(){
          scope.$apply(function(){
            scope.id--;
          })
          $(banner).fadeIn("fast");
        });
      }
    },
    controller: ['$scope', 'JewishHolidaysService', '$timeout','NationalHolidays', function($scope, jhs, $timeout, nh){
      $scope.id = 0;
      $scope.holidays = {}
      function saveOriginRequest(){
        var country = JSON.parse(localStorage.getItem('nation'));
        firebase.database().ref('countries/' + country.countryCode).push(firebase.database.ServerValue.TIMESTAMP);
      }
      var date = jhs.getDate();
      jhs.getHolidays().then(function(success){
        var holidays = success.data.items;
        localStorage.setItem('jewish_holidays', JSON.stringify(success));
        $scope.holidays = _.filter(holidays, function(item){
          m = moment(item.date, "YYYY-MM-DD")
          item.daysLeft = Math.round((m-date) / 86400000);
          return item.daysLeft >=0 && item.yomtov === true;
        })
      });
      nh.getHolidays().then(function(success){
        console.log(success);
        saveOriginRequest();
      }, function(error){
        saveOriginRequest();

      })
    }]
  }
}])
