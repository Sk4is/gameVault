const cors_proxy = require('cors-anywhere');
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

cors_proxy.createServer({
  originWhitelist: ['http://localhost:5173'], // Asegúrate de que tu origen esté aquí
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
}).listen(port, host, function() {
  console.log('Running CORS Anywhere on ' + host + ':' + port);
});
