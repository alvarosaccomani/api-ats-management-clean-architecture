import { VoucherFeeStatusEntity, VoucherFeeStatusUpdateData } from "./voucher-fee-status.entity";

export interface VoucherFeeStatusRepository {
    getVoucherFeeStatuses(): Promise<VoucherFeeStatusEntity[] | null>;
    findVoucherFeeStatusById(voufs_uuid: string): Promise<VoucherFeeStatusEntity | null>;
    createVoucherFeeStatus(voucherFeeStatus: VoucherFeeStatusEntity): Promise<VoucherFeeStatusEntity | null>;
    updateVoucherFeeStatus(voufs_uuid: string, voucherFeeStatus: VoucherFeeStatusUpdateData): Promise<VoucherFeeStatusEntity | null>;
    deleteVoucherFeeStatus(voufs_uuid: string): Promise<VoucherFeeStatusEntity | null>;
    findVoucherFeeStatusByName(voufs_name: string, excludeUuid?: string | null): Promise<VoucherFeeStatusEntity | null>;
}