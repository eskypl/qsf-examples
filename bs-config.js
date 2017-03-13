module.exports = {
    "files": [
        "docs"
    ],
    "watchOptions": {
        "ignoreInitial": true,
        "ignored": 'styles/**/*.{scss,map}',
        "usePolling": true
    },
    "server": true,
    "serveStatic": [
        "docs"
    ]
};