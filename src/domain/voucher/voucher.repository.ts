import { VoucherEntity, VoucherUpdateData } from "./voucher.entity";

export interface VoucherRepository {
    getVouchers(usr_uuid: string, crd_uuid: string, per_uuid: string, options?: { transaction?: any }): Promise<VoucherEntity[] | null>;
    findVoucherById(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, options?: { transaction?: any }): Promise<VoucherEntity | null>;
    createVoucher(voucher: VoucherEntity, options?: { transaction?: any }): Promise<VoucherEntity | null>;
    updateVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, voucher: VoucherUpdateData, options?: { transaction?: any }): Promise<VoucherEntity | null>;
    deleteVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, options?: { transaction?: any }): Promise<VoucherEntity | null>;
    findVoucherByTransactionNumber(vou_transactionnumber: string, options?: { transaction?: any }): Promise<VoucherEntity | null>;
}