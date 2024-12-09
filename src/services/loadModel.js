require('dotenv').config();

const tf = require('@tensorflow/tfjs-node');
const modelUrl = process.env.MODEL_URL;

console.log('Model URL:', process.env.MODEL_URL || modelUrl);

async function loadModel() {
  if (!modelUrl) {
    console.log("model gagal di load");
    throw new Error('MODEL_URL is not defined');
  }

  return await tf.loadGraphModel(modelUrl);
}

module.exports = loadModel;
