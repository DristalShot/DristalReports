angular.module('wsReports').factory('userAssignments', ['$cachedResource', function ($cachedResource) {
    var projects = $cachedResource('projects', '/api/projects/:projectId/user_assignments/:id', {id: "@id"});
    return projects;
}]);

