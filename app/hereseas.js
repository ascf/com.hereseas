var hereseasApp = angular.module('hereseasApp', [
    'ngAnimate', 'ngCookies', 'ngSanitize','ui.select2',
    'ui.router', 'ngMaterial', 'ngMessages',
    'pascalprecht.translate', 'LocalStorageModule', 
    'hereseasDirectives','uiGmapgoogle-maps','ngResource', 'ngFileUpload','ui.bootstrap','jkuri.gallery','textAngular','ui.date'
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
});

hereseasApp.config(function ($stateProvider, $urlRouterProvider,
                             $translateProvider, $httpProvider,
                             $translatePartialLoaderProvider,
                             localStorageServiceProvider, APP) {


    $urlRouterProvider.otherwise("/home");
    $httpProvider.defaults.withCredentials = true;
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
        url: '/forum/:schoolId',
        templateUrl: '/app/view/forum.html',
        controller: 'ForumController',
        
    });
    
    $stateProvider.state('article', {
        url: '/forum/article/:schoolId/:id',
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
        url: '/othersProfile/:othersId/:schoolId',
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


//
//hereseasApp.config(function(uiSelectConfig) {
//    uiSelectConfig.theme = 'select2';
//});
