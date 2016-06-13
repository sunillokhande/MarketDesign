
userModule = angular.module('userModule', []);

userModule.controller('RegistrationController', function ($scope) {
    console.log('registration controller');
    $scope.tab = 1;

    $scope.setTab = function (tabId) {
        debugger;
        $scope.tab = tabId;
    };

    $scope.isSet = function (tabId) {
        return $scope.tab === tabId;
    };
});