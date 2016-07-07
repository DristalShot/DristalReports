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