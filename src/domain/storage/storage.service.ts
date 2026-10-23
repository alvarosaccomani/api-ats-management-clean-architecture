export type StorageBucketType = 'public' | 'private';

export interface UploadPresignedUrlParams {
    bucket: string;
    key: string;
    contentType: string;
    expiresInSeconds?: number;
}

export interface DownloadPresignedUrlParams {
    bucket: string;
    key: string;
    expiresInSeconds?: number;
}

export interface UploadFileParams {
    bucket: string;
    key: string;
    body: Buffer | Uint8Array;
    contentType: string;
}

export interface DeleteFileParams {
    bucket: string;
    key: string;
}

/**
 * Puerto de Dominio para el servicio de almacenamiento (Object Storage).
 * Define los contratos agnósticos a la implementación tecnológica (Cloudflare R2, AWS S3, MinIO, etc.).
 */
export interface IStorageService {
    getUploadPresignedUrl(params: UploadPresignedUrlParams): Promise<string>;
    getDownloadPresignedUrl(params: DownloadPresignedUrlParams): Promise<string>;
    uploadFile(params: UploadFileParams): Promise<string>;
    deleteFile(params: DeleteFileParams): Promise<void>;
    getPublicUrl(key: string): string;
}
