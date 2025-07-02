import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

async function createPresignedUrl(filename: string, filetype: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `listings/${Date.now()}_${filename}`, // 파일명 중복 방지
    ContentType: filetype,
  });

  // 1회용 업로드 URL 생성 (유효시간: 60초)
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  const publicUrl = uploadUrl.split('?')[0]; // 실제 파일이 저장될 최종 URL

  return { uploadUrl, publicUrl };
}

export default {
  createPresignedUrl,
};