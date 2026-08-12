import { PendingVoucherEntity, PendingVoucherUpdateData } from "./pending-voucher.entity";

export interface PendingVoucherRepository {
    getPendingVouchers(usr_uuid: string): Promise<PendingVoucherEntity[] | null>;
    findPendingVoucherById(usr_uuid: string, pevou_uuid: string): Promise<PendingVoucherEntity | null>;
    createPendingVoucher(pendingVoucher: PendingVoucherEntity): Promise<PendingVoucherEntity | null>;
    updatePendingVoucher(usr_uuid: string, pevou_uuid: string, pendingVoucher: PendingVoucherUpdateData): Promise<PendingVoucherEntity | null>;
    deletePendingVoucher(usr_uuid: string, pevou_uuid: string): Promise<PendingVoucherEntity | null>;
    findPendingVoucherByName(usr_uuid: string, pevou_name: string, excludeUuid?: string | null): Promise<PendingVoucherEntity | null>;
}