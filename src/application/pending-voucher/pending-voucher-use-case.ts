import { PendingVoucherRepository } from "../../domain/pending-voucher/pending-voucher.repository";
import { PendingVoucherValue } from "../../domain/pending-voucher/pending-voucher.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class PendingVoucherUseCase {
    constructor(
        private readonly pendingVoucherRepository: PendingVoucherRepository
    ) {
        this.getPendingVouchers = this.getPendingVouchers.bind(this);
        this.getDetailPendingVoucher = this.getDetailPendingVoucher.bind(this);
        this.createPendingVoucher = this.createPendingVoucher.bind(this);
        this.updatePendingVoucher = this.updatePendingVoucher.bind(this);
        this.deletePendingVoucher = this.deletePendingVoucher.bind(this);
        this.findPendingVoucherByName = this.findPendingVoucherByName.bind(this);
    }

    public async getPendingVouchers(usr_uuid: string) {
        try {
            const pendingVouchers = await this.pendingVoucherRepository.getPendingVouchers(usr_uuid);
            if(!pendingVouchers) {
                throw new Error('No hay comprobantes pendientes.');
            }
            return pendingVouchers.map(pendingVoucher => ({
                usr_uuid: pendingVoucher.usr_uuid,
                pevou_uuid: pendingVoucher.pevou_uuid,
                pevou_name: pendingVoucher.pevou_name,
                pevou_image: pendingVoucher.pevou_image,
                pevou_unreadcontent: pendingVoucher.pevou_unreadcontent,
                pevou_unreadtext: pendingVoucher.pevou_unreadtext,
                pevou_createdat: TimezoneConverter.toIsoStringInTimezone(pendingVoucher.pevou_createdat, 'America/Buenos_Aires'),
                pevou_updatedat: TimezoneConverter.toIsoStringInTimezone(pendingVoucher.pevou_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getPendingVouchers (use case):', error.message);
            throw error;
        }
    }

    public async getDetailPendingVoucher(usr_uuid: string, vous_uuid: string) {
        try {
            const pendingVoucher = await this.pendingVoucherRepository.findPendingVoucherById(usr_uuid, vous_uuid);
            if(!pendingVoucher) {
                throw new Error(`No hay comprobante pendiente con el Id: ${vous_uuid}`);
            }
            return {
                usr_uuid: pendingVoucher.usr_uuid,
                pevou_uuid: pendingVoucher.pevou_uuid,
                pevou_name: pendingVoucher.pevou_name,
                pevou_image: pendingVoucher.pevou_image,
                pevou_unreadcontent: pendingVoucher.pevou_unreadcontent,
                pevou_unreadtext: pendingVoucher.pevou_unreadtext,
                pevou_createdat: TimezoneConverter.toIsoStringInTimezone(pendingVoucher.pevou_createdat, 'America/Buenos_Aires'),
                pevou_updatedat: TimezoneConverter.toIsoStringInTimezone(pendingVoucher.pevou_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailPendingVoucher (use case):', error.message);
            throw error;
        }
    }
    
    public async createPendingVoucher({ usr_uuid, pevou_name, pevou_image, pevou_unreadcontent, pevou_unreadtext } : { usr_uuid: string, pevou_name: string, pevou_image: string, pevou_unreadcontent: string, pevou_unreadtext: string }) {
        try {
            const pendingVoucherValue = new PendingVoucherValue({ usr_uuid, pevou_name, pevou_image, pevou_unreadcontent, pevou_unreadtext });
            const pendingVoucherCreated = await this.pendingVoucherRepository.createPendingVoucher(pendingVoucherValue);
            if(!pendingVoucherCreated) {
                throw new Error(`No se pudo insertar el comprobante pendiente.`);
            }
            return {
                usr_uuid: pendingVoucherCreated.usr_uuid,
                pevou_uuid: pendingVoucherCreated.pevou_uuid,
                pevou_name: pendingVoucherCreated.pevou_name,
                pevou_image: pendingVoucherCreated.pevou_image,
                pevou_unreadcontent: pendingVoucherCreated.pevou_unreadcontent,
                pevou_unreadtext: pendingVoucherCreated.pevou_unreadtext,
                pevou_createdat: TimezoneConverter.toIsoStringInTimezone(pendingVoucherCreated.pevou_createdat, 'America/Buenos_Aires'),
                pevou_updatedat: TimezoneConverter.toIsoStringInTimezone(pendingVoucherCreated.pevou_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createPendingVoucher (use case):', error.message);
            throw error;
        }
    }

    public async updatePendingVoucher(usr_uuid: string, pevou_uuid: string, { pevou_name, pevou_image, pevou_unreadcontent, pevou_unreadtext } : { pevou_name: string, pevou_image: string, pevou_unreadcontent: string, pevou_unreadtext: string }) {
        try {
            const pendingVoucherUpdated = await this.pendingVoucherRepository.updatePendingVoucher(usr_uuid, pevou_uuid, { pevou_name, pevou_image, pevou_unreadcontent, pevou_unreadtext });
            if(!pendingVoucherUpdated) {
                throw new Error(`No se pudo actualizar el comprobante pendiente.`);
            }
            return {
                usr_uuid: pendingVoucherUpdated.usr_uuid,
                pevou_uuid: pendingVoucherUpdated.pevou_uuid,
                pevou_name: pendingVoucherUpdated.pevou_name,
                pevou_image: pendingVoucherUpdated.pevou_image,
                pevou_unreadcontent: pendingVoucherUpdated.pevou_unreadcontent,
                pevou_unreadtext: pendingVoucherUpdated.pevou_unreadtext,
                pevou_createdat: TimezoneConverter.toIsoStringInTimezone(pendingVoucherUpdated.pevou_createdat, 'America/Buenos_Aires'),
                pevou_updatedat: TimezoneConverter.toIsoStringInTimezone(pendingVoucherUpdated.pevou_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updatePendingVoucher (use case):', error.message);
            throw error;
        }
    }

    public async deletePendingVoucher(usr_uuid: string, pevou_uuid: string) {
        try {
            const pendingVoucherDeleted = await this.pendingVoucherRepository.deletePendingVoucher(usr_uuid,pevou_uuid);
            if(!pendingVoucherDeleted) {
                throw new Error(`No se pudo eliminar el comprobante pendiente.`);
            }
            return {
                usr_uuid: pendingVoucherDeleted.usr_uuid,
                pevou_uuid: pendingVoucherDeleted.pevou_uuid,
                pevou_name: pendingVoucherDeleted.pevou_name,
                pevou_image: pendingVoucherDeleted.pevou_image,
                pevou_unreadcontent: pendingVoucherDeleted.pevou_unreadcontent,
                pevou_unreadtext: pendingVoucherDeleted.pevou_unreadtext,
                pevou_createdat: TimezoneConverter.toIsoStringInTimezone(pendingVoucherDeleted.pevou_createdat, 'America/Buenos_Aires'),
                pevou_updatedat: TimezoneConverter.toIsoStringInTimezone(pendingVoucherDeleted.pevou_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deletePendingVoucher (use case):', error.message);  
            throw error;
        }
    }

    public async findPendingVoucherByName(usr_uuid: string, vous_name: string, excludeUuid?: string) {
        try {
            const pendingVoucher = await this.pendingVoucherRepository.findPendingVoucherByName(usr_uuid, vous_name, excludeUuid)
            if(pendingVoucher) {
                throw new Error(`Ya existe un comprobante pendiente con el nombre ${vous_name}.`);
            }
            return pendingVoucher
        } catch (error: any) {
            console.error('Error en findPendingVoucherByName (use case):', error.message);
            throw error;
        }
    }
}