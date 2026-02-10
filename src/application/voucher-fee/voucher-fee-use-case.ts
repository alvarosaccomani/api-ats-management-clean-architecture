import { VoucherFeeRepository } from "../../domain/voucher-fee/voucher-fee.repository";
import { VoucherFeeValue } from "../../domain/voucher-fee/voucher-fee.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class VoucherFeeUseCase {
    constructor(
        private readonly voucherFeeRepository: VoucherFeeRepository
    ) {
        this.getVoucherFees = this.getVoucherFees.bind(this);
        this.getDetailVoucherFee = this.getDetailVoucherFee.bind(this);
        this.createVoucherFee = this.createVoucherFee.bind(this);
        this.updateVoucherFee = this.updateVoucherFee.bind(this);
        this.deleteVoucherFee = this.deleteVoucherFee.bind(this);
    }

    public async getVoucherFees(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string) {
        try {
            const voucherFees = await this.voucherFeeRepository.getVoucherFees(usr_uuid, crd_uuid, per_uuid, vou_uuid);
            if(!voucherFees) {
                throw new Error('No hay cuotas de comprobante.');
            }
            return voucherFees.map(voucherFee => ({
                usr_uuid: voucherFee.usr_uuid,
                crd_uuid: voucherFee.crd_uuid,
                per_uuid: voucherFee.per_uuid,
                vou_uuid: voucherFee.vou_uuid,
                vouf_uuid: voucherFee.vouf_uuid,
                vouf_quotanumber: voucherFee.vouf_quotanumber,
                vouf_quotaamount: voucherFee.vouf_quotaamount,
                vouf_quotaduedate: voucherFee.vouf_quotaduedate,
                voufs_uuid: voucherFee.voufs_uuid,
                voufs: voucherFee.voufs,
                vouf_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFee.vouf_createdat, 'America/Buenos_Aires'),
                vouf_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFee.vouf_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getVoucherFees (use case):', error.message);
            throw error;
        }
    }

    public async getDetailVoucherFee(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string) {
        try {
            const voucherFee = await this.voucherFeeRepository.findVoucherFeeById(usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid);
            if(!voucherFee) {
                throw new Error(`No hay cuota de comprobante con el Id: ${vouf_uuid}`);
            }
            return {
                usr_uuid: voucherFee.usr_uuid,
                crd_uuid: voucherFee.crd_uuid,
                per_uuid: voucherFee.per_uuid,
                vou_uuid: voucherFee.vou_uuid,
                vouf_uuid: voucherFee.vouf_uuid,
                vouf_quotanumber: voucherFee.vouf_quotanumber,
                vouf_quotaamount: voucherFee.vouf_quotaamount,
                vouf_quotaduedate: voucherFee.vouf_quotaduedate,
                voufs_uuid: voucherFee.voufs_uuid,
                vouf_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFee.vouf_createdat, 'America/Buenos_Aires'),
                vouf_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFee.vouf_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailVoucherFee (use case):', error.message);
            throw error;
        }
    }
    
    public async createVoucherFee({ 
        usr_uuid, 
        crd_uuid, 
        per_uuid, 
        vou_uuid, 
        vouf_uuid, 
        vouf_quotanumber, 
        vouf_quotaamount, 
        vouf_quotaduedate, 
        voufs_uuid 
    } : { 
        usr_uuid: string,
        crd_uuid: string,
        per_uuid: string,
        vou_uuid: string,
        vouf_uuid?: string,
        vouf_quotanumber: number,
        vouf_quotaamount: number,
        vouf_quotaduedate: Date,
        voufs_uuid: string
    }) {
        try {
            const voucherFeeValue = new VoucherFeeValue({ 
                usr_uuid, 
                crd_uuid, 
                per_uuid, 
                vou_uuid, 
                vouf_uuid, 
                vouf_quotanumber, 
                vouf_quotaamount, 
                vouf_quotaduedate, 
                voufs_uuid 
            });
            const voucherFeeCreated = await this.voucherFeeRepository.createVoucherFee(voucherFeeValue);
            if(!voucherFeeCreated) {
                throw new Error(`No se pudo insertar la cuota de comprobante.`);
            }
            return {
                usr_uuid: voucherFeeCreated.usr_uuid,
                crd_uuid: voucherFeeCreated.crd_uuid,
                per_uuid: voucherFeeCreated.per_uuid,
                vou_uuid: voucherFeeCreated.vou_uuid,
                vouf_uuid: voucherFeeCreated.vouf_uuid,
                vouf_quotanumber: voucherFeeCreated.vouf_quotanumber,
                vouf_quotaamount: voucherFeeCreated.vouf_quotaamount,
                vouf_quotaduedate: voucherFeeCreated.vouf_quotaduedate,
                voufs_uuid: voucherFeeCreated.voufs_uuid,
                vouf_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFeeCreated.vouf_createdat, 'America/Buenos_Aires'),
                vouf_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFeeCreated.vouf_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createVoucherFee (use case):', error.message);
            throw error;
        }
    }

    public async updateVoucherFee(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string, { 
        vouf_quotanumber, 
        vouf_quotaamount, 
        vouf_quotaduedate, 
        voufs_uuid 
    } : { 
        vouf_quotanumber: number,
        vouf_quotaamount: number,
        vouf_quotaduedate: Date,
        voufs_uuid: string
    }) {
        try {
            const voucherFeeUpdated = await this.voucherFeeRepository.updateVoucherFee(usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid, { 
                vouf_quotanumber, 
                vouf_quotaamount, 
                vouf_quotaduedate, 
                voufs_uuid 
            });
            if(!voucherFeeUpdated) {
                throw new Error(`No se pudo actualizar la cuota de comprobante.`);
            }
            return {
                usr_uuid: voucherFeeUpdated.usr_uuid,
                crd_uuid: voucherFeeUpdated.crd_uuid,
                per_uuid: voucherFeeUpdated.per_uuid,
                vou_uuid: voucherFeeUpdated.vou_uuid,
                vouf_uuid: voucherFeeUpdated.vouf_uuid,
                vouf_quotanumber: voucherFeeUpdated.vouf_quotanumber,
                vouf_quotaamount: voucherFeeUpdated.vouf_quotaamount,
                vouf_quotaduedate: voucherFeeUpdated.vouf_quotaduedate,
                voufs_uuid: voucherFeeUpdated.voufs_uuid,
                vouf_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFeeUpdated.vouf_createdat, 'America/Buenos_Aires'),
                vouf_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFeeUpdated.vouf_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateVoucherFee (use case):', error.message);
            throw error;
        }
    }

    public async deleteVoucherFee(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string) {
        try {
            const voucherFeeDeleted = await this.voucherFeeRepository.deleteVoucherFee(usr_uuid, crd_uuid, per_uuid, vou_uuid, vouf_uuid);
            if(!voucherFeeDeleted) {
                throw new Error(`No se pudo eliminar la cuota de comprobante.`);
            }
            return {
                usr_uuid: voucherFeeDeleted.usr_uuid,
                crd_uuid: voucherFeeDeleted.crd_uuid,
                per_uuid: voucherFeeDeleted.per_uuid,
                vou_uuid: voucherFeeDeleted.vou_uuid,
                vouf_uuid: voucherFeeDeleted.vouf_uuid,
                vouf_quotanumber: voucherFeeDeleted.vouf_quotanumber,
                vouf_quotaamount: voucherFeeDeleted.vouf_quotaamount,
                vouf_quotaduedate: voucherFeeDeleted.vouf_quotaduedate,
                voufs_uuid: voucherFeeDeleted.voufs_uuid,
                vouf_createdat: TimezoneConverter.toIsoStringInTimezone(voucherFeeDeleted.vouf_createdat, 'America/Buenos_Aires'),
                vouf_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherFeeDeleted.vouf_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteVoucherFee (use case):', error.message);
            throw error;
        }
    }
}