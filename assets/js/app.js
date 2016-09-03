var israel = angular.module('israel', ['pascalprecht.translate']);

israel.config(function ($translateProvider) {
  $translateProvider.translations('es', {
    FALTAN: 'FALTAN',
    DIAS: "DÍAS",
  });
  $translateProvider.translations('en', {
    FALTAN: '',
    DIAS: 'DAYS LEFT',
  });
  $translateProvider.preferredLanguage('en');
})
