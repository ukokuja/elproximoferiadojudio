var israel = angular.module('israel', ['pascalprecht.translate']);

israel.config(function ($translateProvider) {
  $translateProvider.translations('es', {
    FALTAN: 'FALTAN',
    DIAS: "DÍAS",
    MOSTRANDODIAS: "Incluyendo feriados de "

  });
  $translateProvider.translations('en', {
    FALTAN: '',
    DIAS: 'DAYS LEFT',
    MOSTRANDODIAS: 'Including holidays of '
  });
  var language = navigator.language.substring(0,2);
  $translateProvider.preferredLanguage(language);
})
