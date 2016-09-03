israel
.directive('generalHolidays', ['$timeout', 'NationService', function($timeout, ns){
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
              scope.id = scope.getPrevJewishHoliday(scope.id);
            }
          })
          $(banner).fadeIn("fast");
        });
      }

    },
    controller: ['$scope', 'JewishHolidaysService', '$timeout','NationalHolidays'
    , 'NationService', '$rootScope',function($scope, jhs, $timeout, nh, ns, $rootScope){
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
        start = start || $scope.id;
        for(var i = start ; i<$scope.holidays.length; i++){
          if(!$scope.holidays[i].national)
          return i;
        }
        return 0;
      }
      $scope.getPrevJewishHoliday = function(start){
        if(start>0){
          for(var i = start ; i>=0; i--){
            if(!$scope.holidays[i].national)
            return i;
          }
        }
        start = 0;
        return 0;
      }
      function saveOriginRequest(){
        $timeout(function(){
          var country = JSON.parse(localStorage.getItem('nation'));
          firebase.database().ref('countries/' + country.countryCode).push(firebase.database.ServerValue.TIMESTAMP);
        }, 10000);
      }
      function addHolidays(success, holidays){
        var nationals = success.data.holidays;
        var jewishHolidays = _.filter(holidays, function(item){
          var m = moment(item.date, "YYYY-MM-DD")
          item.daysLeft = Math.round((m-date) / 86400000);
          item.style = {
            'background': 'url("'+ns.getFlagByCode("IL")+'") 50% 50%',
            '-webkit-background-clip': 'text',
             '-webkit-text-fill-color': 'transparent'
          };
          return item.daysLeft >=0 && item.yomtov === true;
        })
        var nationalHolidays = _.filter(nationals, function(item){
          var m = moment(item.observed, "YYYY-MM-DD")
          item.daysLeft = Math.round((m-date) / 86400000);
          item.national = true;
          item.title = item.name;
          var nation = JSON.parse(localStorage.getItem('nation'));
          item.style = {
            'background': 'url("'+ns.getFlagByCode(nation.data.countryCode)+'") 50% 50%',
            '-webkit-background-clip': 'text',
             '-webkit-text-fill-color': 'transparent'
          };
          return item.public;
        });
        var holid = _.sortBy(_.union(nationalHolidays, jewishHolidays), 'daysLeft');
        $scope.holidays = holid
        $rootScope.$broadcast('got_holidays', false);
        saveOriginRequest();
      }

      var date = jhs.getDate();
      jhs.getHolidays().then(function(jewish){
        var jewish_holidays = jewish.data.items;
        localStorage.setItem('jewish_holidays', JSON.stringify(jewish));
        $rootScope.$broadcast('got_holidays', true);
        nh.getHolidays().then(function(nationals){
            addHolidays(nationals, jewish_holidays)

        }, function(error){
          var data = {
            data:{
              "holidays": []
            }
          };
          addHolidays(data,jewish_holidays);
        })

      });
    }]
  }
}])
.directive('nationalHolidays', ['$rootScope', 'NationService', '$timeout', function($rootScope, ns, $timeout){
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
          scope.nation = nation.data;
          scope.nation.icon = ns.getFlagByCode(scope.nation.countryCode);
      })

    }]
  }
}])
.directive('loaderHolidays', ['$rootScope', function($rootScope){
  return {
    scope: {},
    templateUrl: "/assets/templates/loader-holidays.html",
    link: function(scope, element, attr){
      scope.jewish = false;
      $rootScope.$on('got_holidays', function(e,data){
        scope.jewish = data;
        if(!data)
          element[0].style.display = "none";
      })
    }
  }
}]);
