"use strict";

var _ = require('underscore');

function Namespace(client, url) {
    this.client = client;
    if (url) {
        this.baseUrl = url;
    }
}
Namespace.prototype.baseUrl = 'http://worksnaps.net/api';
Namespace.prototype.apiUrl = null;
Namespace.prototype.rootTag = null;

Namespace.prototype.getFullUrl = function (url) {
    return this.baseUrl + this.apiUrl + (url ? '/' + url : '');
};

Namespace.prototype.get = function (url, query, data) {
    var that = this;
    url = this.getFullUrl(url);
    return this.client.get(url, query, data).then(function (result) {
        return result[that.rootTag];
    });
};

Namespace.prototype.post = function (url, query, data) {
    return this.client.post(this.getFullUrl(url), query, data);
};

Namespace.prototype.put = function (url, query, data) {
    return this.client.put(this.getFullUrl(url), query, data);
};

Namespace.prototype.remove = function (url, query, data) {
    return this.client.remove(this.getFullUrl(url), query, data);
};


module.exports = Namespace;