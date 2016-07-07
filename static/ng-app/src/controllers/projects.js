angular.module('wsReports').controller('projectsCtrl', ['$scope', 'projects', function ($scope, projects) {

    $scope.load = function () {
        $scope.loadingProjects = true;
        $scope.projects = projects.query();
        $scope.projects.$promise.then(function () {
            if ($scope.projects.length !== 0) {
                $scope.loadingProjects = false;
            }
        });
        $scope.projects.$httpPromise.then(function () {
            $scope.loadingProjects = false;
            console.log('asd')
        });
    };

    $scope.refresh = function () {
        projects.$clearCache();
        $scope.load();
    };

    $scope.load();
}]);
