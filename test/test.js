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

    it('should clone git repos into a static_apps area', function (done) {
        this.timeout(5000);
        const cwd = path.join(__dirname, 'static');
        exec('git init; git add index.html; git commit -m "M"', {cwd: cwd}, function () {
            staticTest(function (err) {
                exec('rm -rf test/static/.git static_apps', function () {
                    done(err);
                });
            });
        });
    });

    it('should connect to express webapps dynamically', function (done) {
        const cleanup = function (err) {
            exec('npm uninstall dynamic', function () {
                done(err);
            });
        }

        this.timeout(5000);
        appPlugin(express, path.join(__dirname, 'dynamic'), (err, subapp) => {
            if (err) {
                cleanup(err);
            }

            const app = express();
            app.use(subapp);

            request(app)
                .get('/')
                .expect(function (res) {
                    assert.equal(res.text.trim(), 'Dynamic');
                })
                .end(function (err, res) {
                    cleanup(err);
                });
            ;
        });
    });
});

