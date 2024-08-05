import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";
import dotenv from "dotenv";

// not figure out why config twice that s3 can work properly
dotenv.config();

const S3_ACCOUNT_ID = process.env.S3_ACCOUNT_ID || "";
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
const S3_PUBLIC_DOMAIN = process.env.S3_PUBLIC_DOMAIN || "";

const s3Client = new S3Client({
  region: "auto",
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
  endpoint: `https://${S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,
});

export async function uploadImage(image: Buffer) {
  const uploadPath = `${createId()}.png`;
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: uploadPath,
    Body: image,
    ContentType: "image/png",
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `${S3_PUBLIC_DOMAIN}/${uploadPath}`;
  } catch (err) {
    console.log("Error", err);
  }
}
