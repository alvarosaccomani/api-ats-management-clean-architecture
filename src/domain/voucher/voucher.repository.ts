import { VoucherEntity, VoucherUpdateData } from "./voucher.entity";

export interface VoucherRepository {
    getVouchers(usr_uuid: string, crd_uuid: string, per_uuid: string): Promise<VoucherEntity[] | null>;
    findVoucherById(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string): Promise<VoucherEntity | null>;
    createVoucher(voucher: VoucherEntity): Promise<VoucherEntity | null>;
    updateVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, voucher: VoucherUpdateData): Promise<VoucherEntity | null>;
    deleteVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string): Promise<VoucherEntity | null>;
    findVoucherByTransactionNumber(vou_transactionnumber: string): Promise<VoucherEntity | null>;
}