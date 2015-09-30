hereseasApp.controller('LoginController',
    function ($scope, $state, userService, alertService) {
        // create blank user variable for login form
        $scope.user = {
            email: '',
            password: '',
            save: true
        };

        $scope.socialLogins = [{
            icon: 'fa-twitter',
            color: '#5bc0de',
            url: '#'
        }, {
            icon: 'fa-facebook',
            color: '#337ab7',
            url: '#'
        }, {
            icon: 'fa-google-plus',
            color: '#e05d6f',
            url: '#'
        }, {
            icon: 'fa-linkedin',
            color: '#337ab7',
            url: '#'
        }];
    
    
        // controller to handle login check
        $scope.loginClick = function () {
            console.log($scope.user);
            userService.login($scope.user)
                .then(function (res) {
                    if (res.result) {
                        
                        

                        
                        $state.go('home');
                        /*userService.getUser()
                            .then(function(userRes){
                                console.log(userRes);
                                if(userRes.result)
                                    //$state.go('home');
                                else
                                    alertService.alert(userRes.err);
                            });*/


                    } else {
                        //alert!
                        alertService.alert(res.err);
                    }
                });
        };

        /*$('.js-validation-login').validate({
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                $(e).parents('.form-group .form-material').append(error);
            },
            highlight: function(e) {
                $(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                $(e).closest('.help-block').remove();
            },
            success: function(e) {
                $(e).closest('.form-group').removeClass('has-error');
                $(e).closest('.help-block').remove();
            },
            rules: {
                'login-username': {
                    required: true,
                    minlength: 3
                },
                'login-password': {
                    required: true,
                    minlength: 5
                }
            },
            messages: {
                'login-username': {
                    required: 'Please enter a username',
                    minlength: 'Your username must consist of at least 3 characters'
                },
                'login-password': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long'
                }
                //gyklytewt
            }
        });*/
    });

hereseasApp.controller('SignupCtrl',
    function ($scope, $stateParams,
              $rootScope, $location,
              $mdDialog, userService, alertService) {

        $scope.signUpData = {};

        $scope.signUpSubmit = function () {
            console.log($scope.signUpData);

            userService.registerUser($scope.signUpData)
                .then(function (res) {
                    console.log(res);
                    if (res.result) {
                        alert("created");
                    } else {
                        //alert("failed");
                        alertService.alert('The email has already been registered!');
                    }
                });
        };
    });

