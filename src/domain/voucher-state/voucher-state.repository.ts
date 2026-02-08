import { VoucherStateEntity, VoucherStateUpdateData } from "./voucher-state.entity";

export interface VoucherStateRepository {
    getVoucherStates(): Promise<VoucherStateEntity[] | null>;
    findVoucherStateById(vous_uuid: string): Promise<VoucherStateEntity | null>;
    createVoucherState(voucherState: VoucherStateEntity): Promise<VoucherStateEntity | null>;
    updateVoucherState(vous_uuid: string, voucherState: VoucherStateUpdateData): Promise<VoucherStateEntity | null>;
    deleteVoucherState(vous_uuid: string): Promise<VoucherStateEntity | null>;
    findVoucherStateByName(vous_name: string, excludeUuid?: string | null): Promise<VoucherStateEntity | null>;
}