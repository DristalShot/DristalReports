(function () {
    var deps = ['$scope','$stateParams', 'projects', 'userAssignments', '$state', 'timeEntries', '$localStorage'];

    deps.push(function ($scope, $stateParams, projects, userAssignments, $state, timeEntries, $localStorage) {
        $scope.stateParams = $stateParams;
        $scope.project = projects.get({id: $stateParams.projectId});
        $scope.assignments = userAssignments.query({projectId: $stateParams.projectId});
        $scope.isActiveTabs = {report: $stateParams.tab === 'report', tasks: $stateParams.tab === 'tasks'};
        $scope.goToTab = function (tab) {
            var params = angular.copy($state.current.params);
            params.tab = tab;
            $state.go($state.current.name, params);
        };
        $scope.calculateTotal = function () {
            var total = 0;
            angular.forEach($scope.timeEntries, function (item) {
                total += item.duration_in_minutes
            });
            return total;
        };
        $scope.groupBy = {
            memo: false,
            task: true
        };
        var startDate = moment($localStorage.startDate || new Date());
        if (!$localStorage.startDate) {
            startDate.subtract(startDate.day(), 'days');
        }
        $scope.dates = {
            start: startDate,
            end: moment($localStorage.endDate || new Date())
        };
        $scope.$watch(function () {
            return $scope.dates.start + $scope.dates.end;
        }, function () {
            console.log($scope.dates);
            $scope.loadingTimeEntries = true;
            $scope.loadingRemoteTimeEntries = true;
            $localStorage.startDate = $scope.dates.start.toDate();
            $localStorage.endDate = $scope.dates.end.toDate();

            $scope.timeEntries = timeEntries.query({
                from: $scope.dates.start.toDate(),
                to: $scope.dates.end.toDate(),
                projectId: $stateParams.projectId,
                type: 'time_summary'
            });
            $scope.timeEntries.$promise.finally(function () {
                $scope.loadingTimeEntries = false;
            });
            $scope.timeEntries.$httpPromise.finally(function () {
                $scope.loadingRemoteTimeEntries = false;
            })
        });
    });

    angular.module('wsReports').controller('projectCtrl', deps);
})();