angular.module('wsReports', ['ui.router', 'ui.bootstrap', 'ngStorage', 'ngCachedResource', 'ncy-angular-breadcrumb', 'ngTouch'])
    .config(['$stateProvider', '$urlRouterProvider', function (states, url) {
        url.otherwise('/');

        states.state('main', {
            abstract: true,
            url: '',
            controller: 'mainCtrl',
            templateUrl: 'main.html',
            ncyBreadcrumb: {
                skip: true
            }
        }).state('main.home', {
            url: '/',
            templateUrl: 'home.html',
            ncyBreadcrumb: {
                label: 'Dashboard',
                skip: true
            }
        }).state('main.login', {
            url: '/login',
            controller: 'loginCtrl',
            templateUrl: 'login.html',
            ncyBreadcrumb: {
                skip: true
            }
        }).state('main.projects', {
            url: '/projects',
            controller: 'projectsCtrl',
            templateUrl: 'projects.html',
            ncyBreadcrumb: {
                label: 'Projects',
                parent: 'main.home'
            }
        }).state('main.project', {
            url: '/projects/:projectId/:tab',
            controller: 'projectCtrl',
            ncyBreadcrumb: {
                label: '{{project.name}}',
                parent: 'main.projects'
            },
            params: {
                tab: 'report'
            },
            templateUrl: 'project.html'
        })

    }]).run(['currentUser', '$state', '$rootScope', function (currentUser, $state, $rootScope) {
        if (!currentUser.isLoggedIn()) {
            $state.go('main.home');
        }
        else {
            //$state.go('main.projects');
        }
        $rootScope.$on('responseUnauthorized', function () {
            currentUser.clearUserData();
            $state.go('main.home');
        });
    }]).filter('toHours', function () {
        function toHours (x) {
            var hours = Math.floor(x / 60);
            var minutes = x % 60;
            return fillZero(hours) + ':' + fillZero(minutes)
        }
        function fillZero (str) {
            if (str.toString().length < 2) {
                return '0' + str;
            }
            return str;
        }

        return toHours
    });

angular.module('wsReports').config(['$httpProvider', function ($httpProvider) {

    var interceptor = ['$rootScope', '$q'];
    interceptor.push(function($rootScope, $q) {

        return {
            'request': function(config) {
                return config;
            },

            'requestError': function(rejection) {
                return $q.reject(rejection);
            },

            'responseError': function (response) {
                if (response.status === 0) {
                    response.status = 500;
                    response.statusText = 'Connection refused';
                }
                if(response.status === 401) {
                    $rootScope.$broadcast('responseUnauthorized', response.status);
                }
                return $q.reject(response);
            },

            'response': function(response) {
                return response;
            }
        }
    });


    $httpProvider.interceptors.push(interceptor);
}]);
angular.module('wsReports').factory('currentUser', ['$localStorage', '$http', '$q', function ($localStorage, $http, $q) {
    var storage = $localStorage.$default({
        user: {}
    });
    return {
        isLoggedIn: function () {
            return typeof storage.user.id !== 'undefined';
        },
        login: function (token) {
            var that = this;
            return $http.post('/api/login', {token: token}).then(function (response) {
                angular.extend(storage.user, response.data);
                return angular.copy(response.data);
            }, function (error) {
                that.clearUserData();
                return $q.reject(error);
            });
        },
        logout: function () {
            var that = this;
            return $http.post('/api/logout').then(function (response) {
                that.clearUserData();
                return response;
            });
        },
        clearUserData: function () {
            localStorage.clear();
            storage.user = {};
        },
        getData: function () {
            return storage.user
        }
    }
}]);
angular.module('wsReports').directive('wsDatePicker', function () {
    return {
        scope: {
            dates: '='
        },
        link: function (scope, elem, attr) {

            elem.daterangepicker({
                "startDate": scope.dates.start,
                "endDate": scope.dates.end,
                maxDate: new Date(),
                autoApply: true,
                startDay: 1,
                dateLimit: 30,
                buttonClasses: 'hide',
                locale: {
                    firstDay: 1,
                    format: 'DD MMM'
                }
                //parentEl: elem.parent()
            }, function (start, end, label) {
                console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
                scope.$apply(function () {
                    scope.dates.start = start;
                    scope.dates.end = end;

                });

            });
            $('.daterangepicker').find('.daterangepicker_input').remove();
        }
    }
});

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
angular.module("wsReports").run(["$templateCache", function ($templateCache) {$templateCache.put("header.html","<nav class=\"navbar navbar-default\" ng-controller=\"headerCtrl\">\n    <div class=\"container-fluid\">\n        <!-- Brand and toggle get grouped for better mobile display -->\n        <div class=\"navbar-header\">\n            <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\" aria-expanded=\"false\">\n                <span class=\"sr-only\">Toggle navigation</span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n            </button>\n            <a class=\"navbar-brand\" ui-sref=\"main.home()\">WS Helper</a>\n        </div>\n\n        <!-- Collect the nav links, forms, and other content for toggling -->\n        <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n            <ul class=\"nav navbar-nav navbar-right\">\n                <li ng-hide=\"!isLoggedIn()\" class=\"dropdown\">\n                    <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                        <span>{{user.first_name}}</span> <span class=\"caret\"></span>\n                    </a>\n                    <ul class=\"dropdown-menu\">\n                        <li><a href=\"#\" ng-click=\"$event.preventDefault(); logout()\">Logout</a></li>\n                    </ul>\n                </li>\n            </ul>\n        </div>\n    </div>\n</nav>\n");
$templateCache.put("home.html","<div class=\"jumbotron\" ng-init=\"showLogin = false;\">\n    <h1>Working with WS on easy way</h1>\n    <p>\n        Do you tired of the constant lags and wretched ui/ux?\n    </p>\n    <p>\n        Do you want a more effective tool to overview time which worksnaps has tracked?\n    </p>\n\n    <p ng-hide=\"showLogin\">\n        <button class=\"btn btn-primary btn-lg\" ng-click=\"showLogin = true\" role=\"button\">\n            Sign in\n        </button>\n    </p>\n    <div ng-show=\"showLogin\" ng-include=\"\'login.html\'\" ng-controller=\"loginCtrl\">\n\n    </div>\n</div>\n");
$templateCache.put("login.html","<form class=\"form-inline\" ng-submit=\"login(token)\">\n    <div class=\"form-group\">\n        <label class=\"sr-only\" for=\"inputToken\">API Token</label>\n        <input autofocus ng-disabled=\"logging\" type=\"text\" class=\"form-control\" ng-model=\"token\" required id=\"inputToken\" placeholder=\"Enter your API token\">\n    </div>\n    <button type=\"submit\" class=\"btn btn-default\" ng-show=\"!logging\">Open the door</button>\n    <button type=\"button\" disabled class=\"btn btn-default\" ng-show=\"logging\">Signing in...</button>\n    <p></p>\n    <div class=\"alert alert-danger\" ng-show=\"error.length > 0\">\n        <button type=\"button\" class=\"close\" ng-click=\"closeError()\">×</button>\n        <strong>Oh snap!</strong> {{error}}\n    </div>\n</form>\n");
$templateCache.put("main.html","<div ncy-breadcrumb></div>\n<div ui-view></div>");
$templateCache.put("project.html","<div class=\"well\">\n    <h4>{{project.name}}</h4>\n    <div ng-repeat=\"(key, val) in project\" ng-if=\"key !== \'name\' && val\">\n        <span class=\"text-capitalize\">{{key}}</span>: {{val}}\n    </div>\n    <div ng-if=\"assignments.length > 0\">\n        Roles: <span ng-repeat=\"assignment in assignments track by assignment.id\">\n        {{assignment.role}} <span ng-if=\"!$last\">,</span>\n    </span>\n    </div>\n    <div ng-if=\"assignments.length === 0\">Have not assignments</div>\n</div>\n\n<tabset ng-if=\"project.id\">\n    <tab select=\"goToTab(\'report\')\" active=\"isActiveTabs.report\">\n        <tab-heading>\n            <a ui-sref=\"main.project({projectId: project.id, tab: \'report\'})\">Report</a>\n        </tab-heading>\n        <div class=\"container\">\n            <!--<div class=\"checkbox-inline\">Group by</div>-->\n            <!--<label class=\"checkbox-inline\">-->\n                <!--<input type=\"checkbox\" ng-model=\"groupBy.task\"> Task-->\n            <!--</label>-->\n            <!--<label class=\"checkbox-inline\">-->\n                <!--<input type=\"checkbox\" ng-model=\"groupBy.memo\"> Memo-->\n            <!--</label>-->\n\n            <form class=\"form-inline\" ng-submit=\"login(token)\">\n                <div class=\"form-group\">\n                    <label for=\"inputDates\">Choose date range</label>\n                    <input type=\"text\" id=\"inputDates\" class=\"form-control\"\n                           readonly ws-date-picker dates=\"dates\"\n                           ng-if=\"dates.start && dates.end\">\n                </div>\n            </form>\n\n            <p class=\"lead text-center\" ng-show=\"loadingTimeEntries\">Loading...</p>\n            <p>\n                <span ng-if=\"loadingRemoteTimeEntries\">...</span>\n            </p>\n            <div class=\"panel panel-default\" ng-show=\"!loadingTimeEntries\">\n                <!-- List group -->\n                <ul class=\"list-group\">\n                    <li class=\"list-group-item\" ng-repeat=\"item in timeEntries track by item.user_comment\">\n                        {{item.user_comment}} {{item.duration_in_minutes | toHours}}\n                    </li>\n                    <li class=\"list-group-item active\" ng-if=\"timeEntries.length > 1\">\n                        Total: {{calculateTotal() | toHours}}\n                    </li>\n                    <li class=\"list-group-item\" ng-if=\"timeEntries.length === 0\">There is no entries</li>\n                </ul>\n            </div>\n        </div>\n    </tab>\n    <!--<tab select=\"goToTab(\'tasks\')\" active=\"isActiveTabs.tasks\">-->\n        <!--<tab-heading>-->\n            <!--<a ui-sref=\"main.project({projectId: project.id, tab: \'tasks\'})\">Tasks</a>-->\n        <!--</tab-heading>-->\n        <!--Tasks goes here-->\n    <!--</tab>-->\n</tabset>");
$templateCache.put("projects.html","<div class=\"panel panel-primary\">\n    <!-- Default panel contents -->\n    <div class=\"panel-heading\">\n        <span class=\"badge\" ng-if=\"projects.length >= 0\">{{projects.length}}</span>\n        <button class=\"btn btn-sm btn-link pull-right\" ng-click=\"refresh()\">\n            <span class=\"glyphicon glyphicon-refresh\"></span>\n        </button>\n        <span>Projects {{loadingProjects}}</span>\n    </div>\n\n    <!-- List group -->\n    <div class=\"list-group\" >\n        <a class=\"list-group-item\" ng-hide=\"loadingProjects\"\n           ng-repeat=\"project in projects track by project.id\"\n           ui-sref=\"main.project({projectId: project.id})\">\n            {{project.name}}\n            <span class=\"glyphicon glyphicon-ban-circle\" ng-if=\"project.status !== \'active\'\"></span>\n        </a>\n        <a class=\"list-group-item lead text-center\" ng-click=\"$event.preventDefault()\"  ng-show=\"loadingProjects\">\n            Loading...\n        </a>\n    </div>\n</div>");}]);
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
angular.module('wsReports').controller('mainCtrl', ['$scope', function ($scope) {
    $scope.hello = "HELLO";
}]);
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

angular.module('wsReports').factory('userAssignments', ['$cachedResource', function ($cachedResource) {
    var projects = $cachedResource('projects', '/api/projects/:projectId/user_assignments/:id', {id: "@id"});
    return projects;
}]);


angular.module('wsReports').factory('projects', ['$cachedResource', function ($cachedResource) {
    var projects = $cachedResource('projects', '/api/projects/:id', {id: "@id"});
    return projects;
}]);


angular.module('wsReports').factory('timeEntries', ['$cachedResource', function ($cachedResource) {
    var timeEntries = $cachedResource('timeEntries', '/api/projects/:projectId/report', {id: "@user_comment"});
    return timeEntries;
}]);