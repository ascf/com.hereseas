var hereseasApp = angular.module('hereseasApp', [
  'ui.router', 'ngMaterial'
]);


hereseasApp.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    //$httpProvider.defaults.withCredentials = true;


    $urlRouterProvider.otherwise("/signup");

    $stateProvider
        .state('signup', {
            url: '/signup',

            templateUrl: '/app/view/signup.html',
            controller: 'LoginCtrl'


        });
});

hereseasApp.config(function ($mdThemingProvider, $mdIconProvider) {
    //
    $mdIconProvider
        .defaultIconSet("/public/images/svg/avatars.svg", 128)
        .icon("menu", "/public/images/svg/menu.svg", 24)
        .icon("share", "/public/images/svg/share.svg", 24)
        .icon("google_plus", "/public/images/svg/google_plus.svg", 512)
        .icon("hangouts", "/public/images/svg/hangouts.svg", 512)
        .icon("twitter", "/public/images/svg/twitter.svg", 512)
        .icon("phone", "/public/images/svg/phone.svg", 512);
    //
    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});