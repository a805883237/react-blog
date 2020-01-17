const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 运行 dev 模式时，监听的端口
const PORT = process.env.PORT || 8089;

app.prepare()
.then(() => {
  const server = express();
  server.get('/', (req, res) => {
    const actualPage = '/home';
    app.render(req, res, actualPage)
  });
  
  // server.get('/p/:id', (req, res) => {
  //   const actualPage = '/post';
  //   const queryParams = { title: req.params.id }
  //   app.render(req, res, actualPage, queryParams)
  // });
  
  server.get('*', (req, res) => {
    return handle(req, res)
  });
  
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
});