angular.module('wsReports').factory('timeEntries', ['$cachedResource', function ($cachedResource) {
    var timeEntries = $cachedResource('timeEntries', '/api/projects/:projectId/report', {id: "@user_comment"});
    return timeEntries;
}]);