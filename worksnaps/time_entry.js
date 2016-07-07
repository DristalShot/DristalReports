"use strict";

var Base = require('./base');
var util = require('util');
var utils = require('./utils');

function TimeEntries () {
    this.apiUrl = '/projects';
    this.rootTag = 'time_entries';

    Base.apply(this, arguments);
}

util.inherits(TimeEntries, Base);

TimeEntries.prototype.availableTimeEntriesTypes = ['time_entries', 'time_summary'];
TimeEntries.prototype.timeEntriesInnerTags = {
    'time_entries': 'time_entry',
    'time_summary': 'time_entry'
};

TimeEntries.prototype.getReports = function (options) {
    var url = this.getFullUrl(options.projectId + '/reports');
    var that = this;
    options.type = options.type || this.availableTimeEntriesTypes[0];
    var params = {
        name: options.type,
        user_ids: options.usersIds.join(';'),
        from_timestamp: utils.getStartTimestamp(options.from),
        to_timestamp: utils.getEndTimestamp(options.to)
    };
    return this.client.get(url, params).then(function (result) {
        console.log(result);
        return utils.entityToArray(result[options.type], that.timeEntriesInnerTags[options.type]);
    })
};

module.exports = TimeEntries;