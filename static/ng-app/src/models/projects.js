angular.module('wsReports').factory('projects', ['$cachedResource', function ($cachedResource) {
    var projects = $cachedResource('projects', '/api/projects/:id', {id: "@id"});
    return projects;
}]);

