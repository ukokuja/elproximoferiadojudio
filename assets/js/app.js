var israel = angular.module('israel', ['pascalprecht.translate']);

israel.config(function ($translateProvider) {
  $translateProvider.translations('es', {
    FALTAN: 'FALTAN',
    DIAS: "DÍAS",
    MOSTRANDODIAS: "Incluyendo feriados de ",
    GETTINGJEWISH: "Cargando feriados judíos",
    GETTINGNATIONALS: "Cargando feriados nacionales"

  });
  $translateProvider.translations('en', {
    FALTAN: '',
    DIAS: 'DAYS LEFT',
    MOSTRANDODIAS: 'Including holidays of ',
    GETTINGJEWISH: "Getting jewish holidays",
    GETTINGNATIONALS: "Getting national holidays"
  });
  var language = navigator.language.substring(0,2);
  $translateProvider.preferredLanguage(language);
})
