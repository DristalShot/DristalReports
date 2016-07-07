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