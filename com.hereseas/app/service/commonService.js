var commonResponseHandler = function (res) {
    return res.data;
};

var errResponseHandler = function (res) {
    return {
        result: false,
        err: 'Server error:' + res.status
    };
};

hereseasApp.factory('alertService', function ($http,$mdDialog) {



    return {
        alert: function (msg, $event) {
            var mAlert = $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('This is an alert title')
                .content(msg)
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!');

            if($event){
                mAlert.targetEvent($event);
            }

            return $mdDialog.show(mAlert);
        }
    };
});
