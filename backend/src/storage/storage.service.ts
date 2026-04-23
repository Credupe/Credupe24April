import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Storage abstraction.
 * - When `S3_*` env vars are set (works for AWS S3 _and_ Cloudflare R2 — they
 *   speak the same API), `presignUpload` / `presignDownload` emit real
 *   pre-signed URLs via AWS SDK v3.
 * - Otherwise we return `/api/v1/documents/mock-upload/<key>` so the full
 *   upload flow can still be exercised locally without cloud credentials.
 */
export interface PresignedUpload {
  storageKey: string;
  /** @deprecated — use `storageKey`. Kept for FE backward compat. */
  key: string;
  uploadUrl: string;
  method: 'PUT';
  headers: Record<string, string>;
  expiresInSec: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client: S3Client | null = null;

  get configured() {
    return Boolean(
      process.env.S3_ACCESS_KEY_ID &&
        process.env.S3_SECRET_ACCESS_KEY &&
        process.env.S3_BUCKET &&
        process.env.S3_ENDPOINT,
    );
  }

  private get bucket() { return process.env.S3_BUCKET!; }

  private getClient(): S3Client {
    if (!this.client) {
      this.client = new S3Client({
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        // R2 + most S3-compat providers need path-style URLs.
        forcePathStyle: true,
      });
    }
    return this.client;
  }

  async presignUpload(params: {
    ownerUserId: string;
    fileName: string;
    mimeType?: string;
  }): Promise<PresignedUpload> {
    const safeName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `u/${params.ownerUserId}/${Date.now()}-${randomUUID()}-${safeName}`;
    const contentType = params.mimeType || 'application/octet-stream';

    if (this.configured) {
      const cmd = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      });
      const uploadUrl = await getSignedUrl(this.getClient(), cmd, { expiresIn: 600 });
      return {
        storageKey: key,
        key,
        uploadUrl,
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        expiresInSec: 600,
      };
    }

    return {
      storageKey: key,
      key,
      uploadUrl: `/api/v1/documents/mock-upload/${encodeURIComponent(key)}`,
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      expiresInSec: 600,
    };
  }

  async presignDownload(key: string): Promise<string> {
    if (this.configured) {
      const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
      return getSignedUrl(this.getClient(), cmd, { expiresIn: 600 });
    }
    return `/api/v1/documents/mock-download/${encodeURIComponent(key)}`;
  }
}
