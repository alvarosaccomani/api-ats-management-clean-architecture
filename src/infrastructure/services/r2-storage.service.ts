import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
    IStorageService,
    UploadPresignedUrlParams,
    DownloadPresignedUrlParams,
    UploadFileParams,
    DeleteFileParams
} from '../../domain/storage/storage.service';

/**
 * Adaptador de infraestructura para Cloudflare R2 (compatible con API S3).
 * Implementa el puerto IStorageService utilizando el SDK oficial de AWS v3.
 */
export class R2StorageService implements IStorageService {
    private readonly s3Client: S3Client;
    public readonly publicBucket: string;
    public readonly privateBucket: string;
    public readonly publicUrl: string;

    constructor() {
        const accountId = process.env.R2_ACCOUNT_ID || '';
        const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';

        if (!accountId || !accessKeyId || !secretAccessKey) {
            console.error('Error crítico: Faltan variables de entorno para Cloudflare R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID o R2_SECRET_ACCESS_KEY no están definidas en el servidor).');
            throw new Error('Configuración de almacenamiento incompleta en el servidor: verifique R2_ACCOUNT_ID, R2_ACCESS_KEY_ID y R2_SECRET_ACCESS_KEY en su archivo .env');
        }

        this.publicBucket = process.env.R2_BUCKET_PUBLIC || 'ats-public-assets';
        this.privateBucket = process.env.R2_BUCKET_PRIVATE || 'ats-private-vault';
        this.publicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    /**
     * Genera una URL prefirmada (Presigned URL) para que el cliente suba directamente el archivo a R2 mediante HTTP PUT.
     */
    async getUploadPresignedUrl(params: UploadPresignedUrlParams): Promise<string> {
        const { bucket, key, contentType, expiresInSeconds = 300 } = params;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
        });

        return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    }

    /**
     * Genera una URL prefirmada de lectura/descarga temporal para archivos protegidos en buckets privados.
     */
    async getDownloadPresignedUrl(params: DownloadPresignedUrlParams): Promise<string> {
        const { bucket, key, expiresInSeconds = 300 } = params;

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    }

    /**
     * Sube un archivo directamente desde el backend (útil para tareas batch, exports o webhooks).
     */
    async uploadFile(params: UploadFileParams): Promise<string> {
        const { bucket, key, body, contentType } = params;

        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: contentType,
        });

        await this.s3Client.send(command);

        if (bucket === this.publicBucket && this.publicUrl) {
            return `${this.publicUrl}/${key}`;
        }

        return key;
    }

    /**
     * Elimina un objeto de un bucket en R2.
     */
    async deleteFile(params: DeleteFileParams): Promise<void> {
        const { bucket, key } = params;

        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        await this.s3Client.send(command);
    }

    /**
     * Construye la URL pública para un objeto ubicado en el bucket público.
     */
    getPublicUrl(key: string): string {
        const sanitizedKey = key.replace(/^\//, '');
        return this.publicUrl ? `${this.publicUrl}/${sanitizedKey}` : sanitizedKey;
    }
}
