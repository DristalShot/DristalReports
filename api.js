"use strict";

var express = require('express');
var ws = require('./worksnaps');

module.exports = function () {
    var router = express.Router();

    router.post('/login', function (req, res) {
        //res.status(500).json({});
        //return;
        var users = new ws.Users(new ws.Client(req.body.token));
        users.getMe().then(function (data) {
            console.log('logged in', data.id);
            req.session.token = req.body.token;
            req.session.userId = data.id;
            res.json(data);
        });
    });

    router.get('/me', function (req, res) {
        var users = new ws.Users(new ws.Client(req.session.token));
        users.getMe().then(function (data) {
            res.json(data);
        });
    });

    router.get('/projects', function (req, res) {
        var projects = new ws.Projects(new ws.Client(req.session.token));
        projects.getAll().then(function (data) {
            res.json(data);
        });
    });

    router.get('/projects/:id', function (req, res) {
        var projects = new ws.Projects(new ws.Client(req.session.token));
        projects.getById(req.params.id).then(function (data) {
            res.json(data);
        });
    });

    router.get('/projects/:id/report', function (req, res) {
        var timeEntries = new ws.TimeEntries(new ws.Client(req.session.token));
        req.assert('from', 'Invalid date').isDate();
        req.assert('to', 'Invalid date').isDate();
        if (req.query.type) {
            var types = timeEntries.availableTimeEntriesTypes;
            req.assert('type', 'Invalid type. Available types: ' + JSON.stringify(types)).isInArray(types);
        }
        var errors = req.validationErrors();
        if (errors) {
            res.status(400).json(errors);
            return;
        }
        timeEntries.getReports({
            projectId: req.params.id,
            from: req.query.from,
            to: req.query.to,
            type: req.query.type,
            usersIds: [req.session.userId]
        }).then(function (data) {
            res.json(data);
        }).catch(function (err) {
            res.status(500).json(err);
        });
    });

    router.get('/projects/:projectId/user_assignments', function (req, res) {
        var assignments = new ws.UserAssignments(new ws.Client(req.session.token));
        assignments.get(req.params.projectId).then(function (data) {
            res.json(data);
        }, function (err) {
            res.status(500).json(err);
        });
    });

    router.post('/logout', function (req, res) {
        req.session.destroy(function () {
            res.status(200).json();
        });
    });

    return router;
};