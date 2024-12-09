const crypto = require('crypto');
const { Firestore } = require('@google-cloud/firestore');
const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const { credentials, projectId } = require('../credentials/credentials');

const db = new Firestore({
  projectId: projectId,
  credentials: credentials
});

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { result, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id: id,
    result: result,
    suggestion: suggestion,
    createdAt: createdAt
  };

  await storeData(db, id, data);

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data
  });
  response.code(201);
  return response;
}

async function getHistoriesHandler(request, h) {
  const predictCollection = db.collection('predictions');

  try {
    const snapshot = await predictCollection.get();

    const histories = snapshot.docs.map(doc => ({
      id: doc.id,
      history: doc.data(),
    }));

    const response = h.response({
      status: 'success',
      data: histories
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: `Gagal mengambil riwayat prediksi: ${error.message}`,
    });
    response.code(500);
    return response;
  }
}

module.exports = {
  postPredictHandler,
  getHistoriesHandler,
};
