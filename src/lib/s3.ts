import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

let _client: S3Client | null = null;

export function hasS3(): boolean {
  return !!(
    process.env.S3_BUCKET &&
    (process.env.S3_REGION || process.env.AWS_REGION) &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY
  );
}

export function s3Client(): S3Client {
  if (_client) return _client;
  _client = new S3Client({
    region: process.env.S3_REGION || process.env.AWS_REGION || "us-east-1",
  });
  return _client;
}

export function s3PublicUrl(key: string): string {
  const base = process.env.S3_PUBLIC_BASE_URL;
  if (base) return `${base.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
  const region = process.env.S3_REGION || process.env.AWS_REGION || "us-east-1";
  const bucket = process.env.S3_BUCKET as string;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key.replace(/^\//, "")}`;
}

export async function putObject(opts: { key: string; body: Buffer | Uint8Array | string; contentType?: string; bucket?: string }) {
  const Bucket = opts.bucket || (process.env.S3_BUCKET as string);
  const Key = opts.key.replace(/^\//, "");
  const Body = opts.body;
  const ContentType = opts.contentType;
  await s3Client().send(new PutObjectCommand({ Bucket, Key, Body, ContentType }));
  return { url: s3PublicUrl(Key), key: Key };
}

export async function getObjectText(key: string, bucket?: string): Promise<string | null> {
  const Bucket = bucket || (process.env.S3_BUCKET as string);
  const Key = key.replace(/^\//, "");
  try {
    const res = await s3Client().send(new GetObjectCommand({ Bucket, Key }));
    // @ts-ignore
    const body = await res.Body?.transformToString();
    return typeof body === "string" ? body : null;
  } catch {
    return null;
  }
}
