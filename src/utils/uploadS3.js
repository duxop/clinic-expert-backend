const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * S3 client configured from environment variables.
 *
 * Required env vars:
 * - AWS_S3_ACCESS_KEY
 * - AWS_S3_SECRET_KEY
 * - AWS_S3_REGION
 * - AWS_S3_BUCKET
 */
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

/**
 * Generate a unique object key for S3.
 * Keeps original filename at the end so the extension is preserved.
 *
 * @param {string} fileName - Original file name (e.g. "report.pdf")
 * @param {string} [folder="uploads"] - Optional folder/prefix in the bucket
 * @returns {string}
 */
function buildObjectKey(fileName, folder = "uploads") {
  const safeName = fileName.replace(/[^\w.\-]/g, "_");
  const random =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : crypto.randomBytes(16).toString("hex");

  return `${folder}/${Date.now()}-${random}-${safeName}`;
}

/**
 * Generate a pre-signed URL that the frontend can use to upload
 * a file directly to S3 using HTTP PUT.
 *
 * @param {Object} params
 * @param {string} params.fileName - Original file name (with extension)
 * @param {string} params.fileType - MIME type, e.g. "image/png" or "application/pdf"
 * @param {string} [params.folder="uploads"] - Optional folder/prefix in the bucket
 * @param {string} [params.key] - Optional full S3 object key. If provided, overrides folder/fileName.
 * @param {number} [params.expiresIn=300] - URL expiry in seconds (default 5 minutes)
 * @returns {Promise<{ uploadUrl: string, key: string, fileUrl: string }>}
 */
async function getS3UploadUrl({
  fileName = "file",
  fileType,
  folder = "uploads",
  key: explicitKey,
  expiresIn = 300,
}) {
  if (!process.env.AWS_S3_BUCKET) {
    throw new Error("AWS_S3_BUCKET env var is not set");
  }
  if (!process.env.AWS_S3_REGION) {
    throw new Error("AWS_S3_REGION env var is not set");
  }

  const key = explicitKey || buildObjectKey(fileName, folder);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: fileType,
    // Optional: make objects public by default. Remove if you control access via IAM.
    // ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    uploadUrl,
    key,
  };
}

module.exports = {
  getS3UploadUrl,
};

