'use strict';

const assert = require('assert');
const exec = require('child_process').exec;
const path = require('path');

const express = require('express');
const request = require('supertest');

const appPlugin = require('../index.js');

const gitRepoSetup = function () {
};

describe('app-plugin', function () {
    afterEach(function (done) {
        this.timeout(10000);
        // Cleanup
        exec('npm uninstall dynamic', function () {
            exec('rm -rf test/static/.git static_apps', done);
        });
    });

    const staticTest = function (done) {
        appPlugin(express, path.join(__dirname, 'static'), (err, subapp) => {
            if (err) {
                return done(err);
            }
            const app = express();
            app.use(subapp);

            request(app)
                .get('/')
                .expect(function (res) {
                    assert.equal(res.text.trim(), 'Static');
                })
                .end(done);
            ;
        });
    };

    it('should route to static webapps', function (done) {
        staticTest(done);
    });

    const createGitRepo = function (callback) {
        const cwd = path.join(__dirname, 'static');
        exec(
            'git init; git add index.html; git commit -m "M"',
            {cwd: cwd},
            callback
        );
    };

    it('should clone git repos into a static_apps area', function (done) {
        this.timeout(5000);
        createGitRepo(function () {
            staticTest(function (err) {
                done(err);
            });
        });
    });

    it('should use repo when already in static_apps area', function (done) {
        this.timeout(5000);
        // Creating git repo
        createGitRepo(function () {
            // Cloning git repo into static_apps area
            appPlugin(express, path.join(__dirname, 'static'), () => {
                // Running static test
                staticTest(function (err) {
                    done(err);
                });
            });
        });
    });

    it('should connect to express webapps dynamically', function (done) {
        this.timeout(30000);
        appPlugin(express, path.join(__dirname, 'dynamic'), (err, subapp) => {
            if (err) {
                done(err);
            }

            const app = express();
            app.use(subapp);

            request(app)
                .get('/')
                .expect(function (res) {
                    assert.equal(res.text.trim(), 'Dynamic');
                })
                .end(function (err, res) {
                    done(err);
                })
            ;
        });
    });
});

