const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
  try {
    const maxSizeInBytes = 1 * 1000 * 1000;
    if (image.length > maxSizeInBytes) {
      const error = new InputError(
        "Payload content length greater than maximum allowed: 1000000."
      );
      error.statusCode = 413;
      throw error;
    }

    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();

    const cancerProbability = score[0];

    let result, suggestion;

    if (cancerProbability < 0.5) {
      result = "Non-cancer";
      suggestion = "Penyakit kanker tidak terdeteksi.";
    } else {
      result = "Cancer";
      suggestion = "Segera periksa ke dokter!";
    }

    return { result, suggestion };
  } catch (error) {
    if (!(error instanceof InputError)) {
      error = new InputError("Terjadi kesalahan dalam melakukan prediksi" + error);

      error.statusCode = 400;
    }
    console.log(error);
    throw error;
  }
}

module.exports = predictClassification;
