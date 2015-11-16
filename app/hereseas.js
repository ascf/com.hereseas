var hereseasApp = angular.module('hereseasApp', [
    'ngAnimate', 'ngCookies', 'ngSanitize','ui.select2',
    'ui.router', 'ngMaterial', 'ngMessages',
    'pascalprecht.translate', 'LocalStorageModule',
    'pascalprecht.translate', 'angular-loading-bar', 'hereseasDirectives','uiGmapgoogle-maps','ngResource', 'ngFileUpload','ui.bootstrap','jkuri.gallery', 'mp.datePicker'
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

hereseasApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}]);


hereseasApp.config(function ($stateProvider, $urlRouterProvider,
                             $translateProvider, $httpProvider,
                             $translatePartialLoaderProvider,
                             localStorageServiceProvider, APP) {


    $urlRouterProvider.otherwise("/home");

    /*$stateProvider.state('login', {
        url: '/login',
        templateUrl: '/app/view/login.html',
        controller: 'LoginController'

    });*/

    //$stateProvider.state('user', {
    //    url: '/user',
    //    views: {
    //        'header': {
    //            templateUrl: '/app/view/partials/_header.html',
    //            controller: 'HeaderController'
    //        },
    //        'footer': {
    //            templateUrl: '/app/view/partials/_footer.html',
    //            controller: 'FooterController'
    //        },
    //        'content': {
    //            templateUrl: '/app/view/partials/_public.html',
    //            controller: 'CommonController'
    //        }
    //    }
    //});


    $stateProvider.state('public', {
        url: '/public',
        templateUrl: '/app/view/partials/_public.html'
    });

    $stateProvider.state('chat', {
        url: '/chat',
        templateUrl: '/app/view/partials/_chat_window.html',
        controller:'ChatCtrl'
    });
    
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/app/view/new_home.html',
        controller: 'HomeController'
    });
    
    $stateProvider.state('school', {
        url: '/school/:schoolId',
        templateUrl: '/app/view/school.html',
        controller: 'SchoolController'
    });
    
    $stateProvider.state('rooms', {
        url: '/rooms/:aptId',
        templateUrl: '/app/view/rooms.html',
        controller: 'RoomDisplayController',
        onEnter: scrollContent = function() {
            // Your favorite scroll method here
            },
    });
    
    $stateProvider.state('items', {
        url: '/items/:itemId',
        templateUrl: '/app/view/items.html',
        controller: 'ItemsDisplayController',
        onEnter: scrollContent = function() {
            // Your favorite scroll method here
            },
    });
    
    $stateProvider.state('forum', {
        url: '/forum/:schoolId/',
        templateUrl: '/app/view/forum.html',
        controller: 'ForumController',
        
    });
    
    $stateProvider.state('article', {
        url: '/forum/article/:id',
        templateUrl: '/app/view/article.html',
        controller: 'ArticleController',
        
    });
    
    
    $stateProvider.state('allApts', {
        url: '/apts/:schoolId',
        templateUrl: '/app/view/all_apts.html',
        controller: 'AptsController'
    });
    
    $stateProvider.state('allCars', {
        url: '/allCars/:schoolId',
        templateUrl: '/app/view/all_cars.html',
        controller: 'AllCarsController'
    });
    
    $stateProvider.state('allItems', {
        url: '/allItems/:schoolId',
        templateUrl: '/app/view/all_items.html',
        controller: 'ItemsController'
    });
    
    $stateProvider.state('allActivs', {
        url: '/allActivs/:schoolId',
        templateUrl: '/app/view/all_activs.html',
        controller: 'ActivsController'
    });
    
    $stateProvider.state('schoolMates', {
        url: '/schoolMates/:schoolId',
        templateUrl: '/app/view/schoolmates.html',
        controller: 'SchoolMatesCtrl'
    });
    
    $stateProvider.state('cars', {
        url: '/cars/:carId',
        templateUrl: '/app/view/cars.html',
        controller: 'CarDisplayController'
    });
    
    $stateProvider.state('activs', {
        url: '/activs/:activId',
        templateUrl: '/app/view/activities.html',
        controller: 'ActivsDisplayController'
    });
    
    $stateProvider.state('verify', {
        url: '/verify',
        templateUrl: '/app/view/verify.html',
        controller: 'VerifyController'
    });
    
    $stateProvider.state('404', {
        url: '/404',
        templateUrl: '/app/view/404.html',
        controller: 'ErrorController'
    });
	
    $stateProvider.state('about', {
        url: '/about',
        templateUrl: '/app/view/about.html'
    });
	

    $stateProvider.state('reset', {
        url: '/reset',
        templateUrl: '/app/view/reset.html',
        controller: 'ResetController'
    });

    $stateProvider.state('admin', {
        url: '/admin/userinfo',
        templateUrl: '/app/view/admin_userinfo.html',
        controller: 'AdminController'
    }); 
    
    $stateProvider.state('othersProfile', {
        url: '/othersProfile/:othersId',
        templateUrl: '/app/view/othersProfile.html',
        controller: 'OthersProfileController'
    });  
    /*$stateProvider.state('roompost', {
        url: '/roompost',
        templateUrl: '/app/view/room_post.html',
        controller: 'RoomPostController'
    });*/
    
    
    /*$stateProvider.state('user', {
        url: '/user',
        templateUrl: '/app/view/partials/_public-user.html'
    });

    $stateProvider.state('public.test', {
        url: '/test',
        views: {
            'side-overlay': {
                templateUrl: '/app/view/partials/_side-overlay.html',
                controller: 'HeaderController'
            },
            'sidebar': {
                templateUrl: '/app/view/partials/_sidebar.html',
                controller: 'HeaderController'
            },
            'header': {
                templateUrl: '/app/view/partials/_header-one.html',
                controller: 'HeaderController'
            },
            'footer': {
                templateUrl: '/app/view/partials/_footer-one.html',
                controller: 'FooterController'
            },
            'content': {
                templateUrl: '/app/view/partials/_main.html',
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
    });*/

    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: '/app/view/profiles.html',
        controller: 'ProfileController'
    });

    /*$stateProvider.state('user.edit', {
        url: '/edit',
        views: {
            "content": {
                templateUrl: '/app/view/profile-edit.html',
                controller: 'profileController'
            }
        }
    });*/

});

/**
 * loading bar options
 */
hereseasApp.config(function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 100;
});

hereseasApp.config(function ($mdThemingProvider, $mdIconProvider) {
    //
    $mdIconProvider
        .iconSet('action', '../stylesheets/icons/material-design/action-icons.svg', 24)
        .iconSet('alert', '../stylesheets/icons/material-design/alert-icons.svg', 24)
        .iconSet('av', '/stylesheets/icons/material-design/av-icons.svg', 24)
        .iconSet('communication', '/stylesheets/icons/material-design/communication-icons.svg', 24)
        .iconSet('content', '/stylesheets/icons/material-design/content-icons.svg', 24)
        .iconSet('device', '/stylesheets/icons/material-design/device-icons.svg', 24)
        .iconSet('editor', '/public/stylesheets/icons/material-design/editor-icons.svg', 24)
        .iconSet('file', '/stylesheets/icons/material-design/file-icons.svg', 24)
        .iconSet('hardware', '/stylesheets/icons/material-design/hardware-icons.svg', 24)
        .iconSet('icons', '/stylesheets/icons/material-design/icons-icons.svg', 24)
        .iconSet('image', '/stylesheets/icons/material-design/image-icons.svg', 24)
        .iconSet('maps', '/stylesheets/icons/material-design/maps-icons.svg', 24)
        .iconSet('navigation', '/stylesheets/icons/material-design/navigation-icons.svg', 24)
        .iconSet('notification', '/stylesheets/icons/material-design/notification-icons.svg', 24)
        .iconSet('social', '/stylesheets/icons/material-design/social-icons.svg', 24)
        .iconSet('toggle', '/stylesheets/icons/material-design/toggle-icons.svg', 24);


    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});


/**
 *  PALETTES & THEMES & SKINS oh my.....
 */
hereseasApp.config(function ($mdThemingProvider) {
    /**
     *  PALETTES
     */
    $mdThemingProvider.definePalette('white', {
        '50': 'ffffff',
        '100': 'ffffff',
        '200': 'ffffff',
        '300': 'ffffff',
        '400': 'ffffff',
        '500': 'ffffff',
        '600': 'ffffff',
        '700': 'ffffff',
        '800': 'ffffff',
        '900': 'ffffff',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
    });

    $mdThemingProvider.definePalette('black', {
        '50': 'e1e1e1',
        '100': 'b6b6b6',
        '200': '8c8c8c',
        '300': '646464',
        '400': '4d4d4d',
        '500': '3a3a3a',
        '600': '2f2f2f',
        '700': '232323',
        '800': '1a1a1a',
        '900': '121212',
        'A100': 'ffffff',
        'A200': 'ffffff',
        'A400': 'ffffff',
        'A700': 'ffffff',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
    });

    /**
     *  SKINS
     */

        // CYAN CLOUD SKIN
    $mdThemingProvider.theme('cyan')
        .primaryPalette('cyan')
        .accentPalette('amber')
        .warnPalette('deep-orange');

    $mdThemingProvider.theme('white-cyan')
        .primaryPalette('white')
        .accentPalette('cyan', {
            'default': '500'
        })
        .warnPalette('deep-orange');

    // RED DWARF SKIN
    $mdThemingProvider.theme('red')
        .primaryPalette('red')
        .accentPalette('amber')
        .warnPalette('purple');

    $mdThemingProvider.theme('white-red')
        .primaryPalette('white')
        .accentPalette('red', {
            'default': '500'
        })
        .warnPalette('purple');


    // PLUMB PURPLE SKIN
    $mdThemingProvider.theme('purple')
        .primaryPalette('purple')
        .accentPalette('deep-orange')
        .warnPalette('amber');

    $mdThemingProvider.theme('white-purple')
        .primaryPalette('white')
        .accentPalette('purple', {
            'default': '400'
        })
        .warnPalette('deep-orange');

    // DARK KNIGHT SKIN
    $mdThemingProvider.theme('dark')
        .primaryPalette('black')
        .accentPalette('amber')
        .warnPalette('deep-orange')
        .dark();

    // BATTLESHIP GREY SKIN
    $mdThemingProvider.theme('blue-grey')
        .primaryPalette('blue-grey')
        .accentPalette('amber')
        .warnPalette('orange');

    $mdThemingProvider.theme('white-blue-grey')
        .primaryPalette('white')
        .accentPalette('blue-grey', {
            'default': '400'
        })
        .warnPalette('orange');

    // ZESTY ORANGE SKIN
    $mdThemingProvider.theme('orange')
        .primaryPalette('orange', {
            'default': '800'
        })
        .accentPalette('lime')
        .warnPalette('amber');

    $mdThemingProvider.theme('white-orange')
        .primaryPalette('white')
        .accentPalette('orange', {
            'default': '500'
        })
        .warnPalette('lime');

    // INDIGO ISLAND SKIN
    $mdThemingProvider.theme('indigo')
        .primaryPalette('indigo', {
            'default': '600'
        })
        .accentPalette('red')
        .warnPalette('lime');

    // KERMIT GREEN SKIN
    $mdThemingProvider.theme('light-green')
        .primaryPalette('light-green', {
            'default': '400'
        })
        .accentPalette('amber')
        .warnPalette('deep-orange');

    $mdThemingProvider.theme('white-light-green')
        .primaryPalette('white')
        .accentPalette('light-green', {
            'default': '400'
        })
        .warnPalette('deep-orange');


});
//
//hereseasApp.config(function(uiSelectConfig) {
//    uiSelectConfig.theme = 'select2';
//});
