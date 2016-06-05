
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const result = function (callback, errback) {
    return function (err, stdout, stderr) {
        if (err) {
            return errback(stdout, stderr);
        }
        return callback(stdout, stderr);
    };
};

const npm = function (address, callback, errback) {
    exec(
        `npm install ${address} -loglevel silent`,
        result(callback, errback)
    );
};

const git = function (address, dir, callback, errback) {
    fs.mkdir(dir, function () {
        const staticDir = function (out) {
            return path.join(dir, out.split("'")[1].split("'")[0]);
        };
        exec(
            `git clone ${address}`,
            {cwd: dir},
            result(
                function (_, out) {
                    callback(staticDir(out));
                },
                function (_, err) {
                    if (err.includes('already exists')) {
                        return callback(staticDir(err));
                    }
                    errback();
                }
            )
        );
    });
};

module.exports = function (express, address, callback) {
    npm(
        address,
        function (stdout) {
            callback(
                null,
                require(stdout.split('@')[0])(express)
            );
        },
        function () {
            git(
                address,
                'static_apps',
                function (dir) {
                    callback(null, express.static(dir));
                },
                function () {
                    callback(null, express.static(address));
                }
            );
        }
    );
};

