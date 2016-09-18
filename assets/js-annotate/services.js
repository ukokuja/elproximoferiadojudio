israel.factory('JewishHolidaysService', ['$http', '$q', function($http, $q) {
        var hebcal = "https://thenextholiday-1c49d.firebaseio.com/jewishholidays"
        return {
            getHolidays: function() {
                var jewishHolidays = localStorage.getItem('jewish_holidays');
                if (jewishHolidays) {
                    var def = $q.defer();
                    def.resolve(JSON.parse(jewishHolidays));
                    return def.promise;
                }
                return $http.get(hebcal)
            },
            getDate: function() {
                var today = moment().startOf('day');
                return today._d;
            }
        }
    }])
    .factory('NationService', ['$http', '$q', function($http, $q) {
        return {
            getNation: function() {
                var nation = localStorage.getItem('nation');
                if (nation) {
                    var def = $q.defer();
                    def.resolve(JSON.parse(nation));
                    return def.promise;
                }
                return $http.get('https://api.ipinfodb.com/v3/ip-country/?key=d58990a3b407cc57ab33db28ea5522848c4dcf6064f6e9e144800a7cac899eca&format=json');
            },
            getFlagByCode: function(code) {
                if(!code)
                  return '';
                return "//flagpedia.net/data/flags/normal/" + code.toLowerCase() + ".png"
            }
        }
    }])
    .factory('NationalHolidays', ['NationService', '$http', '$q', function(ns, $http, $q) {
        var key = "b09de4d7-921f-4841-9023-04c1c543a9a3";
        /*function request(){
          for(c in supportedCountries){
            if(c>0){
              console.log(c);
              (function(c, supportedCountries){
                console.log('c: '+ c);
                getHolidaysByNation({
                  data: {
                    country_code: supportedCountries[c].code
                  }
                }).then(function(success){
                  if(success.data.length>0){
                    firebase.database().ref('holidays/' + supportedCountries[c].code).set(success.data);
                  }

                })
              })(c, supportedCountries);
            }
          }
        }
        request();*/
        function getHolidaysByNation(nation) {
            var supported = checkSupportedCountries(nation.data.country_code)
            if (!supported) {
                var data = {
                    data: {
                        "holidays": []
                    }
                }
                var def = $q.defer();
                def.resolve(data);
                return def.promise
            }
            if (supported.source == 1) {
              var url = "https://thenextholiday-1c49d.firebaseio.com/holidays/" + nation.data.country_code + ".json"
            } else {
                var url = "http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForYear&year=2016&country=" +supported.countryCode
            }
            var holidays = localStorage.getItem(nation.data.country_code + '_holidays');
            if (holidays) {
                var def = $q.defer();
                def.resolve(JSON.parse(holidays));
                return def.promise;
            }
            return $http.get(url)
        }

        function checkSupportedCountries(countryCode) {
            return _.find(supportedCountries, function(c){ return c.code === countryCode });
        }
        return {
            getHolidays: function(NationService) {
                var nation = localStorage.getItem('nation');
                if (nation) {
                    return getHolidaysByNation(JSON.parse(nation));
                } else {
                    return NationService.getNation().then(function(success) {
                        var nation = success
                        localStorage.setItem('nation', JSON.stringify(nation));
                        return getHolidaysByNation(nation);
                    }, function(error) {
                        var data = {
                            data: {
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
    }]);
