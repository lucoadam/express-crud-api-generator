routers = require('./generator/route')
module.exports = (app,options) => {
    app.use(options.path,routers(options.modal))
}