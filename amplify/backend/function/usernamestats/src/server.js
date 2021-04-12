const app = require('./app.js')

app.listen(3000, function() {
    console.log("App started")
});

module.exports = app
