"use strict";

var Base = require('./base');
var util = require('util');
var utils = require('./utils');

function UserAssignments () {
    this.apiUrl = '/projects';
    this.rootTag = 'user_assignments';

    Base.apply(this, arguments);
}

util.inherits(UserAssignments, Base);

UserAssignments.prototype.get = function (projectId) {
    var url = this.getFullUrl(projectId + '/user_assignments');
    var that = this;
    return this.client.get(url).then(function (result) {
        return utils.entityToArray(result[that.rootTag], 'user_assignment');
    })
};

module.exports = UserAssignments;