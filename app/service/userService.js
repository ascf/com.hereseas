hereseasApp.factory('userService', function ($http, $state, $cookies) {


    var userService = this;
    var host = "http://www.hereseas.com";
    
    
    var toSignup = false;
    var toLogin = false;

    var loginState = false;   
    
    var userInfo = {};
    var draft = {};
    var carDraft = {};
    //var itemDraft = [];
    
    var signupOrLogin = 'login';
    
    this.getHost = function(){
        
        return host;
    };
    /*var favoriteList = {
        apartments:[],
        activities:[],
        cars:[],
        items:[]
    };
    
    this.saveFavorite2Cookies = function(data){
        angular.forEach($cookies, function(v,k){
            delete $cookies[k];
        });
        angular.forEach(data.apartments, function(key){
            $cookies['apt'+data.apartments.indexOf(key)] = key;
        });
        angular.forEach(data.activities, function(key){
            $cookies['acti'+data.activities.indexOf(key)] = key;
        });
        angular.forEach(data.cars, function(key){
            $cookies['car'+data.cars.indexOf(key)] = key;
        });
        angular.forEach(data.items, function(key){
            $cookies['item'+data.items.indexOf(key)] = key;
        });
    };
    
    this.cookies2Favorite = function(){
        
        favoriteList = {
            apartments:[],
            activities:[],
            cars:[],
            items:[]
        };
        
        angular.forEach($cookies, function(key, value){
            //console.log(key, value);
            if(value.indexOf('apt')!==-1)
                favoriteList.apartments.push(key);
            else if(value.indexOf('acti')!==-1)
                favoriteList.activities.push(key);
            else if(value.indexOf('car')!==-1)
                favoriteList.cars.push(key);
            else if(value.indexOf('item')!==-1)
                favoriteList.items.push(key);
        });
        return favoriteList;
    };*/
    
    
    this.setSignupOrLogin = function(state){
        signupOrLogin = state;
    };
    
    this.getSignupOrLogin = function(){
        return signupOrLogin;
    };
    
    
    this.setDraft = function(data){
        draft = data;
    };
    
    this.getDraft = function(){
        return draft;
    };
    
    this.setCarDraft = function(data){
        carDraft = data;
    };
    
    this.getCarDraft = function(){
        return carDraft;
    };

//    this.setItemDraft = function(data){
//        itemDraft.push(data);
//    };
//    
//    this.getItemDraft = function(){
//        return itemDraft;
//    };
    
    this.setUser = function (info){
        userInfo = info;
    };
    
    this.getUser = function(){
        return userInfo;
    };

    this.setLoginState = function(state) {
        loginState = state;
    };
    
    this.getLoginState = function() {
        return loginState;
    };
    
    this.getToLogin = function() {
        return toLogin;
    };
    this.changeToLogin = function() {
        toLogin = !toLogin;
    };
    
    this.getToSignup = function() {
        return toSignup;
    };
    
    this.changeToSignup = function() {
        toSignup = !toSignup;
    };
    
    /*
     *  verify the email user have given
     */
    this.verify = function (data){
        return $http.post(host+'/user/verify',{
            uid: data.id,
            code: data.code
            
        })
            .then(
                function(res){
                    if(res.data.result){
                        return {result:true};
                    }else{
                        return {result:false,err:res.data.err};
                    }
                },errResponseHandler);


    };
    
    this.active = function (data){
        return $http.post(host+'/user/active',{
            eduEmail: data.eduEmail,
        })
            .then(
                function(res){
                    console.log(res);
                    if(res.data.result){
                        return {result:true};
                    }else{
                        return {result:false,err:res.data.err};
                    }
                },errResponseHandler);


    };


    this.checkreset = function (data){
        //console.log("1");
        return $http.post(host+'/checkreset',{
            token: data.token
        })
        .then(
            function(res){
                //console.log("server" + res);
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    };

    this.resetpassword = function (data){
        //console.log("2");
        return $http.put(host+'/reset',{
            id: data.id,
            password: data.password
        })
        .then(
            function(res){
                //console.log("3");
                //console.log(res);
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    };

    this.sendmessage = function (data) {
        return $http.post(host+'/sendmessage',{
            id: data.id,
            content: data.content
        })
        .then(
            function(res){
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    }
    
    this.updateMessages = function (data) {
        return $http.put(host+'/readmessage',{
            id: data.id
        })
        .then(
            function(res){
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    }
    
    this.postFavorite = function(data){
        return $http.post(host+'/favorite',{
            id: data.id,
            category: data.category
        })
        .then(
            function(res){
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    };
    
    this.deleteFavorite = function(data){
        return $http({url:host+'/favorite',
                      method:'DELETE',
                      data: {id: data.id, category: data.category}, 
                      headers: {"Content-Type": "application/json;charset=utf-8"}
        })
        .then(
            function(res){
                if(res.data.result){
                    return {result:true};
                }else{
                    return {result:false,err:res.data.err};
                }
            },errResponseHandler);
    };

    return userService;
});
