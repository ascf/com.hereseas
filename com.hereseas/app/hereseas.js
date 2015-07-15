var hereseasApp = angular.module('hereseasApp', [
    'ngAnimate', 'ngCookies', 'ngSanitize',
  'ui.router', 'ngMaterial', 'ngMessages',
    'pascalprecht.translate', 'LocalStorageModule',
    'pascalprecht.translate'
]);

hereseasApp.constant('APP', {
    name: 'hereseas',
    logo: 'assets/images/logo.png',
    version: '1.2.0',
    languages: [{
        name: 'LANGUAGES.ENGLISH',
        key: 'en'
    }, {
        name: 'LANGUAGES.FRENCH',
        key: 'fr'
    }],
    defaultSkin: 'cyan-cloud'
});
hereseasApp.config(function ($stateProvider, $urlRouterProvider,
    $translateProvider, $httpProvider,
    $translatePartialLoaderProvider,
    localStorageServiceProvider, APP) {



    $urlRouterProvider.otherwise("/signup");

    $stateProvider.state('signup', {
        url: '/signup',
        views: {
            "content": {
                templateUrl: '/app/view/signup.html',
                controller: 'LoginCtrl'
            }
        }
    });

    $stateProvider.state('login', {
        url: '/login',
        views: {
            "content": {
                templateUrl: '/app/view/login.html',
                controller: 'LoginController'
            }
        }

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