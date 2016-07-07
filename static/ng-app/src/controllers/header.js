angular.module('wsReports').controller('headerCtrl', ['$scope', 'currentUser', '$state', function ($scope, currentUser, $state) {
    $scope.user = currentUser.getData();
    $scope.isLoggedIn = function () {
        return currentUser.isLoggedIn();
    };
    $scope.logout = function () {
        return currentUser.logout().then(function () {
            $state.go('main.home');
        });
    };
}]);