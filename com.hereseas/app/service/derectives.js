/**
 * Created by yangmang on 7/16/15.
 */

var hereseasDirectives = angular.module('hereseasDirectives', []);

hereseasDirectives.directive('matchValue', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem , attrs,ctrl) {
            var firstPassword = '#' + attrs.matchValue;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    // console.info(elem.val() === $(firstPassword).val());
                    if(!ctrl.$error.required&&elem.val() != $(firstPassword).val())
                        ctrl.$error.unmatched = true;
                    else
                        delete ctrl.$error.unmatched;


                });
            });
        }
    };
});
