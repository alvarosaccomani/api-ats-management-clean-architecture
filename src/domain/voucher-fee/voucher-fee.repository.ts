import { VoucherFeeEntity, VoucherFeeUpdateData } from "./voucher-fee.entity";

export interface VoucherFeeRepository {
    getVoucherFees(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string): Promise<VoucherFeeEntity[] | null>;
    findVoucherFeeById(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string): Promise<VoucherFeeEntity | null>;
    createVoucherFee(voucherFee: VoucherFeeEntity): Promise<VoucherFeeEntity | null>;
    updateVoucherFee(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string, voucherFee: VoucherFeeUpdateData): Promise<VoucherFeeEntity | null>;
    deleteVoucherFee(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, vouf_uuid: string): Promise<VoucherFeeEntity | null>;
}