israel.factory("JewishHolidaysService",["$http","$q",function(a,b){var c="https://thenextholiday-1c49d.firebaseio.com/jewishholidays";return{getHolidays:function(){var d=localStorage.getItem("jewish_holidays");if(d){var e=b.defer();return e.resolve(JSON.parse(d)),e.promise}return a.get(c)},getDate:function(){var a=moment().startOf("day");return a._d}}}]).factory("NationService",["$http","$q",function(a,b){return{getNation:function(){var c=localStorage.getItem("nation");if(c){var d=b.defer();return d.resolve(JSON.parse(c)),d.promise}return a.get("https://api.ipinfodb.com/v3/ip-country/?key=d58990a3b407cc57ab33db28ea5522848c4dcf6064f6e9e144800a7cac899eca&format=json")},getFlagByCode:function(a){return a?"//flagpedia.net/data/flags/normal/"+a.toLowerCase()+".png":""}}}]).factory("NationalHolidays",["NationService","$http","$q",function(a,b,c){function d(a){var d=e(a.data.country_code);if(!d){var f={data:{holidays:[]}},g=c.defer();return g.resolve(f),g.promise}if(1==d.source)var h="https://thenextholiday-1c49d.firebaseio.com/holidays/"+a.data.country_code+".json";else var h="http://kayaposoft.com/enrico/json/v1.0/?action=getPublicHolidaysForYear&year=2016&country="+d.countryCode;var i=localStorage.getItem(a.data.country_code+"_holidays");if(i){var g=c.defer();return g.resolve(JSON.parse(i)),g.promise}return b.get(h)}function e(a){return _.find(supportedCountries,function(b){return b.code===a})}return{getHolidays:function(a){var b=localStorage.getItem("nation");return b?d(JSON.parse(b)):a.getNation().then(function(a){var b=a;return localStorage.setItem("nation",JSON.stringify(b)),d(b)},function(a){var b={data:{holidays:[]}},d=c.defer();return d.resolve(b),d.promise})}}}]);