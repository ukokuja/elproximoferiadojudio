israel
.directive('generalHolidays', ['$timeout', function($timeout){
  return {
    restrict: 'E',
    templateUrl: "/assets/templates/holiday.html",
    link: function(scope, element, attrs){
      var banner = element[0].getElementsByTagName('section');
      scope.next = function(){
        $(banner).fadeOut("fast",function(){
          scope.$apply(function(){
            if(scope.nationalHoliday){
              scope.id++;
            } else {
              scope.id = scope.getNextJewishHoliday(scope.id);
            }
          })
          $(banner).fadeIn("fast");
        });
      }
      scope.previous = function(){
        $(banner).fadeOut("fast",function(){
          scope.$apply(function(){
            if(scope.nationalHoliday){
              scope.id--;
            } else {
              scope.id = $scope.getPrevJewishHoliday(scope.id);
            }
          })
          $(banner).fadeIn("fast");
        });
      }
    },
    controller: ['$scope', 'JewishHolidaysService', '$timeout','NationalHolidays', '$rootScope', function($scope, jhs, $timeout, nh, $rootScope){
      $scope.id = 0;
      $scope.holidays = {}
      $scope.nationalHoliday = true;
      $rootScope.$on('nationalHoliday', function(e, status){
          $scope.nationalHoliday = status;
          switchedJewishness();
      });
      function switchedJewishness(){
        if($scope.nationalHoliday){
          $scope.id = 0;
        }else{
          $scope.id = $scope.getNextJewishHoliday();
        }
      }
      $scope.getNextJewishHoliday = function(start){
        start = start || 0;
        for(var i = start+1 ; i<$scope.holidays.length; i++){
          if(!$scope.holidays[i].national)
          return i;
        }
        return 0;
      }
      $scope.getPrevJewishHoliday = function(start){
        if(start>0){
          for(var i = start-1 ; i>=0; i--){
            if(!$scope.holidays[i].national)
            return i;
          }
        }
        return 0;
      }
      function saveOriginRequest(){
        var country = JSON.parse(localStorage.getItem('nation'));
        firebase.database().ref('countries/' + country.countryCode).push(firebase.database.ServerValue.TIMESTAMP);
      }
      var date = jhs.getDate();
      jhs.getHolidays().then(function(success){
        var holidays = success.data.items;
        localStorage.setItem('jewish_holidays', JSON.stringify(success));
        nh.getHolidays().then(function(success){
          var nationals = success.data.holidays;
          var jewishHolidays = _.filter(holidays, function(item){
            var m = moment(item.date, "YYYY-MM-DD")
            item.daysLeft = Math.round((m-date) / 86400000);
            return item.daysLeft >=0 && item.yomtov === true;
          })
          var nationalHolidays = _.filter(nationals, function(item){
            var m = moment(item.observed, "YYYY-MM-DD")
            item.daysLeft = Math.round((m-date) / 86400000);
            item.national = true;
            item.title = item.name;
            return item.public;
          })
          $timeout(function(){
            $scope.holidays = _.sortBy(_.union(nationalHolidays, jewishHolidays), 'daysLeft');
          })
          saveOriginRequest();
        }, function(error){
          saveOriginRequest();
        })

      });
    }]
  }
}]).directive('nationalHolidays', ['$rootScope', 'NationService', '$timeout', function($rootScope, ns, $timeout){
  return {
    scope: {},
    templateUrl: "/assets/templates/national-holidays.html",
    link: function(scope, element, attr){

    },
    controller: ['$scope', function(scope){
      scope.nationalHoliday = true;
      scope.switch = function(){
        scope.nationalHoliday = !scope.nationalHoliday;
        $rootScope.$broadcast('nationalHoliday', scope.nationalHoliday);
      }
      scope.nation = {};
      ns.getNation().then(function(nation){
          scope.nation = nation;
          scope.nation.icon = ns.getFlagByCode(nation.countryCode);
      })

    }]
  }
}])
