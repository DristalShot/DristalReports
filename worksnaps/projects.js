"use strict";

var Base = require('./base');
var util = require('util');
var _ = require('underscore');

function Projects () {
    this.apiUrl = '/projects';
    this.rootTag = 'projects';

    Base.apply(this, arguments);
}

util.inherits(Projects, Base);

Projects.prototype.getAll = function () {
    return this.get().then(function (data) {
        data = data['project'];
        if (!_.isArray(data)) {
            data = [data];
        }
        return data;
    });
};

Projects.prototype.getById = function (projectId) {
    var url = this.getFullUrl(projectId);
    return this.client.get(url).then(function (result) {
        return result['project'];
    });
};

module.exports = Projects;