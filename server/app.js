const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')
const logger = require('koa-logger')
const errorHandle = require('./middlewares/errorHandle')
const checkToken = require('./middlewares/checkToken')

const router = require('./router')
const db = require('./models')

const app = new Koa()

app
  .use(cors())
  .use(errorHandle)
  .use(checkToken)
  .use(logger())
  .use(bodyParser())

app.use(router.routes(), router.allowedMethods())

// app.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

app.listen(6060, () => {
  db.sequelize
    .sync({ force: false, logging: false }) // If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
    .then(() => {
      // require('./initData')()

      console.log('sequelize connect success')
      console.log('sever listen on http://127.0.0.1:6060')
    })
    .catch(err => {
      console.log(err)
    })
})
