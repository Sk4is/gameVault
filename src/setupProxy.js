const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',  // Esta ruta será interceptada por el proxy
    createProxyMiddleware({
      target: 'https://api.igdb.com',  // El servidor de IGDB
      changeOrigin: true,              // Cambia el origen de la solicitud
      pathRewrite: {
        '^/api': '/v4/games',         // Reescribe la ruta para que sea válida
      },
      headers: {
        'Client-ID': 'yytjvifii8si3zmeshx8znlox2nuc5', // Tu Client-ID de IGDB
        'Authorization': 'Bearer vb8e7cupalh6uc0pafce3eikvd9pfs', // Tu Token de acceso
      },
    })
  );
};
