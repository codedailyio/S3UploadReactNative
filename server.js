import S3 from "aws-sdk/clients/s3";
import { Credentials } from "aws-sdk";
import { v4 as uuid } from "uuid";

const access = new Credentials({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const s3 = new S3({
  credentials: access,
  region: process.env.S3_REGION, //"us-west-2"
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
