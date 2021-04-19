const app = require('./app.js')

app.app.listen(3000, function() {
    console.log("App started")
});

module.exports = app
