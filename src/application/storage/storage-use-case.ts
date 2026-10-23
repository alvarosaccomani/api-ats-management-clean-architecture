import { v4 as uuid } from "uuid";
import { IStorageService, StorageBucketType } from "../../domain/storage/storage.service";

export interface PresignedUploadRequest {
    usr_uuid: string;
    filename: string;
    contentType: string;
    bucketType?: StorageBucketType;
    folder?: string;
    expiresInSeconds?: number;
}

export interface PresignedUploadResponse {
    uploadUrl: string;
    key: string;
    bucket: string;
    bucketType: StorageBucketType;
    publicUrl: string | null;
    expiresIn: number;
}

export class StorageUseCase {
    private static readonly ALLOWED_MIME_TYPES: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/heic': 'heic',
        'application/pdf': 'pdf',
    };

    constructor(
        private readonly storageService: IStorageService,
        private readonly publicBucketName: string,
        private readonly privateBucketName: string,
        private readonly appPrefix: string = process.env.STORAGE_APP_PREFIX || 'ats-management'
    ) {
        this.getPresignedUploadUrl = this.getPresignedUploadUrl.bind(this);
        this.getPresignedDownloadUrl = this.getPresignedDownloadUrl.bind(this);
    }

    /**
     * Valida los metadatos del archivo y genera una URL prefirmada para subida directa a Cloudflare R2.
     */
    public async getPresignedUploadUrl(request: PresignedUploadRequest): Promise<PresignedUploadResponse> {
        const {
            usr_uuid,
            filename,
            contentType,
            bucketType = 'private',
            folder = 'vouchers',
            expiresInSeconds = 300,
        } = request;

        if (!usr_uuid) {
            throw new Error('El identificador del usuario (usr_uuid) es requerido.');
        }

        if (!filename || !contentType) {
            throw new Error('El nombre de archivo y el tipo MIME (contentType) son requeridos.');
        }

        const normalizedMime = contentType.toLowerCase().trim();
        const expectedExtension = StorageUseCase.ALLOWED_MIME_TYPES[normalizedMime];

        if (!expectedExtension) {
            throw new Error(`Tipo de archivo no permitido: ${contentType}. Solo se permiten imágenes (JPEG, PNG, WebP) y PDFs.`);
        }

        const targetBucket = bucketType === 'public' ? this.publicBucketName : this.privateBucketName;
        const cleanAppPrefix = (this.appPrefix || 'ats-management').replace(/^\/+|\/+$/g, '');
        const sanitizedFolder = folder.replace(/^\/+|\/+$/g, '');
        const fileKey = `${cleanAppPrefix}/${sanitizedFolder}/${usr_uuid}/${Date.now()}_${uuid()}.${expectedExtension}`;

        const uploadUrl = await this.storageService.getUploadPresignedUrl({
            bucket: targetBucket,
            key: fileKey,
            contentType: normalizedMime,
            expiresInSeconds,
        });

        const publicUrl = bucketType === 'public' ? this.storageService.getPublicUrl(fileKey) : null;

        return {
            uploadUrl,
            key: fileKey,
            bucket: targetBucket,
            bucketType,
            publicUrl,
            expiresIn: expiresInSeconds,
        };
    }

    /**
     * Genera una URL prefirmada para descargar o previsualizar un archivo seguro en el bucket privado.
     */
    public async getPresignedDownloadUrl(key: string, expiresInSeconds: number = 300): Promise<{ downloadUrl: string; expiresIn: number }> {
        if (!key) {
            throw new Error('La clave (key) del archivo es requerida.');
        }

        const downloadUrl = await this.storageService.getDownloadPresignedUrl({
            bucket: this.privateBucketName,
            key,
            expiresInSeconds,
        });

        return {
            downloadUrl,
            expiresIn: expiresInSeconds,
        };
    }
}
