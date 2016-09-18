var israel = angular.module('israel', ['pascalprecht.translate']);

israel.config(['$translateProvider', '$httpProvider', function($translateProvider, $httpProvider) {
    $httpProvider.defaults.timeout = 5000;
    $translateProvider.translations('es', {
        FALTAN: 'FALTAN',
        DIAS: "DÍAS",
        FALTA: 'FALTA',
        DIA: "DÍA",
        MES: "MES",
        MESES: "MESES",
        SEMANA: "SEMANA",
        SEMANAS: "SEMANAS",
        MOSTRANDODIAS: "Incluyendo feriados de ",
        GETTINGJEWISH: "Cargando feriados judíos",
        GETTINGNATIONALS: "CarganFdo feriados nacionales"

    });
    $translateProvider.translations('en', {
        FALTAN: '',
        DIAS: 'DAYS LEFT',
        FALTA: '',
        DIA: "DAY LEFT",
        MES: "MONTH LEFT",
        MESES: "MONTHS LEFT",
        SEMANA: "WEEK LEFT",
        SEMANAS: "WEEKS LEFT",
        MOSTRANDODIAS: 'Including holidays of ',
        GETTINGJEWISH: "Getting jewish holidays",
        GETTINGNATIONALS: "Getting national holidays"
    });
    var language = navigator.language.substring(0, 2);
    var languages = ['es', 'en'];
    var lang = languages.indexOf(language) >= 0 ? language : "en";
    $translateProvider.preferredLanguage(language);
}])
moment.updateLocale('es', {
    longDateFormat : {
        LLLL: "dddd MMMM Do",
    }
});
moment.updateLocale('en', {
    longDateFormat : {
        LLLL: "dddd MMMM Do",
    }
});
