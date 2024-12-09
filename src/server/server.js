require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
      payload: {
        maxBytes: 1 * 1000 * 1000,
      },
    },
  });

  const model = await loadModel();

  if (model) {
    console.log(`Model berhasil di load`);
  }

  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', function (request, h) {
    const response = request.response;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.statusCode === 413
          ? "Payload content length greater than maximum allowed: 1000000"
          : "Terjadi kesalahan dalam melakukan prediksi"
      });
      newResponse.code(response.statusCode || 400);
      return newResponse;
    }

    if (response.isBoom && response.output.statusCode === 413) {
      const newResponse = h.response({
        status: 'fail',
        message: "Payload content length greater than maximum allowed: 1000000"
      });
      newResponse.code(413);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: 'fail',
        message: request.path === '/predict/histories'
          ? "Gagal mengambil riwayat prediksi"
          : "Terjadi kesalahan dalam melakukan prediksi"
      });
      newResponse.code(400);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
