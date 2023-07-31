const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");
const { v4: uuid } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  region: BUCKET_REGION,
});

const uploadToS3 = async ({ file, username }) => {
  const key = `${username}/${uuid()}`;
  // const fileBuffer = await sharp(file.buffer)
  //   .resize({ height: 1920, width: 1080, fit: "contain" })
  //   .toBuffer();
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  try {
    await s3.send(command);
    return { key };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const getImageFromS3 = async (imageKey) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: imageKey,
  };

  const command = new GetObjectCommand(params);
  const seconds = 60;
  const url = await getSignedUrl(s3, command, { expiresIn: seconds });
  return url;
};

const deleteImageFromS3 = async ({ imageKey }) => {
  const deleteParams = {
    Bucket: BUCKET_NAME,
    Key: imageKey,
  };

  return s3.send(new DeleteObjectCommand(deleteParams));
};

module.exports = { uploadToS3, getImageFromS3, deleteImageFromS3 };
