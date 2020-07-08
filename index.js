const AWS = require("aws-sdk");
const { v4: uuid } = require("uuid");

const access = new AWS.Credentials({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const s3 = new AWS.S3({
  credentials: access,
  region: process.env.S3_REGION,
  signatureVersion: "v4",
});

const request = async () => {
  const fileId = uuid();
  const signedUrlExpireSeconds = 60 * 15;

  const url = await s3.getSignedUrlPromise("putObject", {
    Bucket: process.env.S3_BUCKET,
    Key: `${fileId}.jpg`,
    ContentType: "image/jpeg",
    Expires: signedUrlExpireSeconds,
  });

  return {
    url,
  };
};

module.exports = request;
