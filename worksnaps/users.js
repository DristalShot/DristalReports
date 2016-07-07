"use strict";

var Base = require('./base');
var util = require('util');

function Users () {
    this.apiUrl = '';
    this.rootTag = 'user';

    Base.apply(this, arguments);
}

util.inherits(Users, Base);

Users.prototype.getMe = function () {
    var url = 'me';
    return this.get(url)
};

module.exports = Users;