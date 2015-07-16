var hereseasApp = angular.module('hereseasApp', [
    'ngAnimate', 'ngCookies', 'ngSanitize',
  'ui.router', 'ngMaterial', 'ngMessages',
    'pascalprecht.translate', 'LocalStorageModule',
    'pascalprecht.translate','angular-loading-bar','hereseasDirectives'
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

    $stateProvider.state('user',{
        url:'/user',
        views:{
            'header': {
                templateUrl: '/app/view/partials/_header.html',
                controller: 'HeaderController'
            },
            'footer': {
                templateUrl: '/app/view/partials/_footer.html',
                controller: 'FooterController'
            },
            'container' :{
                templateUrl: '/app/view/partials/_public.html',
                controller: 'CommonController'
            }
        }
    });

    $stateProvider.state('user.dashboard', {
        url: '/dashboard',
        views: {
            "content": {
                templateUrl: '/app/view/dashboard.html',
                controller: 'CommonController'
            }
        }

    });

});

/**
 * loading bar options
 */
hereseasApp.config(function(cfpLoadingBarProvider){
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 100;
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
