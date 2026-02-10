import { VoucherFeeStatusRepository } from "../../domain/voucher-fee-status/voucher-fee-status.repository";
import { VoucherFeeStatusValue } from "../../domain/voucher-fee-status/voucher-fee-status.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class VoucherFeeStatusUseCase {
    constructor(
        private readonly voucherFeeStatusRepository: VoucherFeeStatusRepository
    ) {
        this.getVoucherFeeStatuses = this.getVoucherFeeStatuses.bind(this);
        this.getDetailVoucherFeeStatus = this.getDetailVoucherFeeStatus.bind(this);
        this.createVoucherFeeStatus = this.createVoucherFeeStatus.bind(this);
        this.updateVoucherFeeStatus = this.updateVoucherFeeStatus.bind(this);
        this.deleteVoucherFeeStatus = this.deleteVoucherFeeStatus.bind(this);
        this.findVoucherFeeStatusByName = this.findVoucherFeeStatusByName.bind(this);
    }

    public async getVoucherFeeStatuses() {
        try {
            const voucherFeeStatuses = await this.voucherFeeStatusRepository.getVoucherFeeStatuses();
            if(!voucherFeeStatuses) {
                throw new Error('No hay estados de cuota de comprobante.');
            }
            return voucherFeeStatuses.map(voucherFeeStatus => ({
                voufs_uuid: voucherFeeStatus.voufs_uuid,
                voufs_name: voucherFeeStatus.voufs_name,
                voufs_description: voucherFeeStatus.voufs_description,
                voufs_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatus.voufs_createdat, 'America/Buenos_Aires'),
                voufs_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatus.voufs_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getVoucherFeeStatuses (use case):', error.message);
            throw error;
        }
    }

    public async getDetailVoucherFeeStatus(voufs_uuid: string) {
        try {
            const voucherFeeStatus = await this.voucherFeeStatusRepository.findVoucherFeeStatusById(voufs_uuid);
            if(!voucherFeeStatus) {
                throw new Error(`No hay estado de cuota de comprobante con el Id: ${voufs_uuid}`);
            }
            return {
                voufs_uuid: voucherFeeStatus.voufs_uuid,
                voufs_name: voucherFeeStatus.voufs_name,
                voufs_description: voucherFeeStatus.voufs_description,
                voufs_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatus.voufs_createdat, 'America/Buenos_Aires'),
                voufs_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatus.voufs_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailVoucherFeeStatus (use case):', error.message);
            throw error;
        }
    }
    
    public async createVoucherFeeStatus({ voufs_uuid, voufs_name, voufs_description } : { voufs_uuid?: string, voufs_name: string, voufs_description?: string }) {
        try {
            const voucherFeeStatusValue = new VoucherFeeStatusValue({ voufs_uuid, voufs_name, voufs_description });
            const voucherFeeStatusCreated = await this.voucherFeeStatusRepository.createVoucherFeeStatus(voucherFeeStatusValue);
            if(!voucherFeeStatusCreated) {
                throw new Error(`No se pudo insertar el estado de cuota de comprobante.`);
            }
            return {
                voufs_uuid: voucherFeeStatusCreated.voufs_uuid,
                voufs_name: voucherFeeStatusCreated.voufs_name,
                voufs_description: voucherFeeStatusCreated.voufs_description,
                voufs_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatusCreated.voufs_createdat, 'America/Buenos_Aires'),
                voufs_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatusCreated.voufs_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createVoucherFeeStatus (use case):', error.message);
            throw error;
        }
    }

    public async updateVoucherFeeStatus(voufs_uuid: string, { voufs_name, voufs_description } : { voufs_name: string, voufs_description: string }) {
        try {
            const voucherFeeStatusUpdated = await this.voucherFeeStatusRepository.updateVoucherFeeStatus(voufs_uuid, { voufs_name, voufs_description });
            if(!voucherFeeStatusUpdated) {
                throw new Error(`No se pudo actualizar el estado de cuota de comprobante.`);
            }
            return {
                voufs_uuid: voucherFeeStatusUpdated.voufs_uuid,
                voufs_name: voucherFeeStatusUpdated.voufs_name,
                voufs_description: voucherFeeStatusUpdated.voufs_description,
                voufs_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatusUpdated.voufs_createdat, 'America/Buenos_Aires'),
                voufs_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatusUpdated.voufs_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateVoucherFeeStatus (use case):', error.message);
            throw error;
        }
    }

    public async deleteVoucherFeeStatus(voufs_uuid: string) {
        try {
            const voucherFeeStatusDeleted = await this.voucherFeeStatusRepository.deleteVoucherFeeStatus(voufs_uuid);
            if(!voucherFeeStatusDeleted) {
                throw new Error(`No se pudo eliminar el estado de cuota de comprobante.`);
            }
            return {
                voufs_uuid: voucherFeeStatusDeleted.voufs_uuid,
                voufs_name: voucherFeeStatusDeleted.voufs_name,
                voufs_description: voucherFeeStatusDeleted.voufs_description,
                voufs_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatusDeleted.voufs_createdat, 'America/Buenos_Aires'),
                voufs_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFeeStatusDeleted.voufs_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteVoucherFeeStatus (use case):', error.message);
            throw error;
        }
    }

    public async findVoucherFeeStatusByName(voufs_name: string, excludeUuid?: string) {
        try {
            const voucherFeeStatus = await this.voucherFeeStatusRepository.findVoucherFeeStatusByName(voufs_name, excludeUuid)
            if(voucherFeeStatus) {
                throw new Error(`Ya existe un estado de cuota de comprobante con el nombre ${voufs_name}.`);
            }
            return voucherFeeStatus
        } catch (error: any) {
            console.error('Error en findVoucherFeeStatusByName (use case):', error.message);
            throw error;
        }
    }
}