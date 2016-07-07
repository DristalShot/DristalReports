"use strict";

var _ = require('underscore');

module.exports = {
    getStartTimestamp: function (date) {
        date = new Date(date);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        return Math.round(date.getTime() / 1000);
    },
    getEndTimestamp: function (date) {
        date = new Date(date);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        return Math.round(date.getTime() / 1000);
    },
    entityToArray: function (item, key) {
        if (typeof item[key] === 'undefined') {
            console.log('e - nothing');
            return [];
        }
        if (!_.isArray(item[key])) {
            console.log('e - to array');
            return [item[key]]
        }
        console.log('e - as is');
        return item[key]
    }
};