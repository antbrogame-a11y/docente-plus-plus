const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.logFileMetadataOnUpload = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;
  const metageneration = object.metageneration;

  functions.logger.log("File upload detected.", {
    bucket: fileBucket,
    file: filePath,
    contentType: contentType,
    metageneration: metageneration
  });
});
