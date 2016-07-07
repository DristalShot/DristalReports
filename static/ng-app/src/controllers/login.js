angular.module('wsReports').controller('loginCtrl', ['$scope', 'currentUser', '$state', function ($scope, currentUser, $state) {
    $scope.token = '';
    $scope.logging = false;
    $scope.error = '';
    $scope.login = function (token) {
        $scope.logging = true;
        console.log('login', token);
        currentUser.login(token).then(function () {
            console.log('logged in successfully', arguments);
            $state.go('main.projects');
            $scope.error = '';
        }).catch(function (response) {
            console.log('error', response);
            $scope.error = response.statusText;
        }).finally(function () {
            $scope.logging = false;
        });
    };
    $scope.closeError = function () {
        $scope.error = '';
    };
    if (currentUser.isLoggedIn()) {
        $state.go('main.projects');
    }
}]);