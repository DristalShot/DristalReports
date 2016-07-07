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
