const { postPredictHandler, getHistoriesHandler } = require('../server/handler');

const routes = [
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getHistoriesHandler,
  },
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true
      }
    }
  },

];

module.exports = routes;
