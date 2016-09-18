israel.directive('generalHolidays', ['$timeout', '$compile', 'JewishHolidaysService', 'NationalHolidays', 'NationService',
        function($timeout, $compile, JewishHolidaysService, NationalHolidays, NationService) {
            return {
                restrict: 'E',
                templateUrl: "/assets/templates/holiday.html",
                link: function(scope, element, attrs) {
                    scope.$watch('holidays', function(oldvalue, newvalue) {
                        $compile(element.contents())(scope);
                    });
                    var banner = element[0].getElementsByTagName('section');
                    scope.next = function() {
                        $(banner).fadeOut("fast", function() {
                            scope.$apply(function() {
                                if (scope.nationalHoliday) {
                                    scope.id++;
                                } else {
                                    scope.id = scope.getNextJewishHoliday(scope.id);
                                }
                            })
                            $(banner).fadeIn("fast");
                        });
                    }

                    scope.previous = function() {
                        $(banner).fadeOut("fast", function() {
                            scope.$apply(function() {
                                if (scope.nationalHoliday) {
                                    scope.id--;
                                } else {
                                    scope.id = scope.getPrevJewishHoliday(scope.id);
                                }
                            })
                            $(banner).fadeIn("fast");
                        });
                    }

                },
                controller: ['$scope', '$timeout', '$rootScope', function($scope, $timeout, $rootScope) {
                    $scope.id = 0;
                    $scope.holidays = {}
                    $scope.nationalHoliday = true;
                    $rootScope.$on('nationalHoliday', function(e, status) {
                        $scope.nationalHoliday = status;
                        switchedJewishness();
                    });

                    function switchedJewishness() {
                        if ($scope.nationalHoliday) {
                            $scope.id = 0;
                        } else {
                            $scope.id = $scope.getNextJewishHoliday();
                        }
                    }
                    $scope.getNextJewishHoliday = function(start) {
                        start = start + 1 || 0;
                        for (var i = start; i < $scope.holidays.length; i++) {
                            if (!$scope.holidays[i].national)
                                return i;
                        }
                        return 0;
                    }
                    $scope.getPrevJewishHoliday = function(start) {
                      if (start > 0) {
                        start--;
                          for (var i = start; i >= 0; i--) {
                              if (!$scope.holidays[i].national)
                                  return i;
                          }
                      }
                      return 0;
                    }
                    function saveOriginRequest() {
                        $timeout(function() {
                            var country = JSON.parse(localStorage.getItem('nation'));
                            var date = new Date()
                            var userData = angular.extend({}, country.data, {
                                timestamp: firebase.database.ServerValue.TIMESTAMP,
                                formatedtime: date.toDateString() + " " + date.toLocaleTimeString()
                            })
                            firebase.database().ref('countries/' + country.data.country_code).push(userData);
                        }, 10000);
                    }

                    function addHolidays(success, holidays) {
                        var nationals = success.data;
                        var jewishHolidays = _.filter(holidays, function(item) {
                            var m = moment(item.date, "YYYY-MM-DD")
                            item.daysLeft = Math.round((m - date) / 86400000);
                            item.months = parseInt(item.daysLeft / 30)
                            item.weeks = parseInt(item.daysLeft / 7)
                            item.days = item.daysLeft % 7
                            item.friendlyDate = moment(item.date, "YYYY-MM-DD").format("LLLL")
                                /*item.style = {
                                    'background': 'url("'+ns.getFlagByCode("IL")+'") 50% 50%',
                                    '-webkit-background-clip': 'text',
                                    '-webkit-text-fill-color': 'transparent'
                                  };*/
                            return item.daysLeft >= 0 && item.yomtov === true;
                        })
                        var nationalHolidays = _.filter(nationals, function(item) {
                            item.date = item.date.year ? item.date.year + "-" + item.date.month + "-" + item.date.day : item.date;
                            item.observed = item.observed || item.date;
                            var m = moment(item.observed, "YYYY-MM-DD")
                            item.daysLeft = Math.round((m - date) / 86400000);
                            item.months = parseInt(item.daysLeft / 30)
                            item.weeks = parseInt(item.daysLeft / 7)
                            item.days = item.daysLeft % 7
                            item.national = true;
                            item.title = item.name || item.localName;
                            item.friendlyDate = moment(item.date, "YYYY-MM-DD").format("LLLL")
                            var nation = JSON.parse(localStorage.getItem('nation'));
                            item.style = {
                                'background': 'url("' + NationService.getFlagByCode(nation.data.country_code) + '") 50% 50%',
                                '-webkit-background-clip': 'text',
                                '-webkit-text-fill-color': 'transparent'
                            };
                            return item.daysLeft >= 0;
                        });
                        console.log(nationalHolidays)
                        var holid = _.sortBy(_.union(nationalHolidays, jewishHolidays), 'daysLeft');
                        $scope.holidays = holid
                        $rootScope.$broadcast('got_holidays', false);
                        saveOriginRequest();
                    }

                    var date = JewishHolidaysService.getDate();
                    JewishHolidaysService.getHolidays().then(function(jewish) {
                        var jewish_holidays = jewish.data.items;
                        localStorage.setItem('jewish_holidays', JSON.stringify(jewish));
                        $rootScope.$broadcast('got_holidays', true);
                        NationalHolidays.getHolidays(NationService).then(function(nationals) {
                            addHolidays(nationals, jewish_holidays)

                        }, function(error) {
                            var data = {
                                data: {
                                    "holidays": []
                                }
                            };
                            addHolidays(data, jewish_holidays);
                        })

                    });
                }]
            }
        }
    ])
    .directive('nationalHolidaysD', ['$rootScope', 'NationService', '$timeout', function($rootScope, NationService, $timeout) {
        return {
            scope: {},
            templateUrl: "/assets/templates/national-holidays.html",
            link: function(scope, element, attr) {

            },
            controller: ['$scope', function(scope) {
                scope.nationalHoliday = true;
                scope.switch = function() {
                    scope.nationalHoliday = !scope.nationalHoliday;
                    $rootScope.$broadcast('nationalHoliday', scope.nationalHoliday);
                }
                scope.nation = {};
                NationService.getNation().then(function(success) {
                    scope.nation = success.data;
                    scope.nation.icon = NationService.getFlagByCode(scope.nation.country_code);
                })

            }]
        }
    }])
    .directive('loaderHolidays', ['$rootScope', function($rootScope) {
        return {
            scope: {},
            templateUrl: "/assets/templates/loader-holidays.html",
            link: function(scope, element, attr) {
                scope.jewish = false;
                $rootScope.$on('got_holidays', function(e, data) {
                    scope.jewish = data;
                    if (!data)
                        element[0].style.display = "none";
                })
            }
        }
    }]);
