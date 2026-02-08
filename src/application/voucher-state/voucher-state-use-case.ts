import { VoucherStateRepository } from "../../domain/voucher-state/voucher-state.repository";
import { VoucherStateValue } from "../../domain/voucher-state/voucher-state.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";

export class VoucherStateUseCase {
    constructor(
        private readonly voucherStateRepository: VoucherStateRepository
    ) {
        this.getVoucherStates = this.getVoucherStates.bind(this);
        this.getDetailVoucherState = this.getDetailVoucherState.bind(this);
        this.createVoucherState = this.createVoucherState.bind(this);
        this.updateVoucherState = this.updateVoucherState.bind(this);
        this.deleteVoucherState = this.deleteVoucherState.bind(this);
        this.findVoucherStateByName = this.findVoucherStateByName.bind(this);
    }

    public async getVoucherStates() {
        try {
            const voucherStates = await this.voucherStateRepository.getVoucherStates();
            if(!voucherStates) {
                throw new Error('No hay estados de comprobante.');
            }
            return voucherStates.map(voucherState => ({
                vous_uuid: voucherState.vous_uuid,
                vous_name: voucherState.vous_name,
                vous_description: voucherState.vous_description,
                vous_createdat: TimezoneConverter.toIsoStringInTimezone(voucherState.vous_createdat, 'America/Buenos_Aires'),
                vous_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherState.vous_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getVoucherStates (use case):', error.message);
            throw error;
        }
    }

    public async getDetailVoucherState(vous_uuid: string) {
        try {
            const voucherState = await this.voucherStateRepository.findVoucherStateById(vous_uuid);
            if(!voucherState) {
                throw new Error(`No hay estado de comprobante con el Id: ${vous_uuid}`);
            }
            return {
                vous_uuid: voucherState.vous_uuid,
                vous_name: voucherState.vous_name,
                vous_description: voucherState.vous_description,
                vous_createdat: TimezoneConverter.toIsoStringInTimezone(voucherState.vous_createdat, 'America/Buenos_Aires'),
                vous_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherState.vous_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en getDetailVoucherState (use case):', error.message);
            throw error;
        }
    }
    
    public async createVoucherState({ vous_uuid, vous_name, vous_description } : { vous_uuid?: string, vous_name: string, vous_description?: string }) {
        try {
            const voucherStateValue = new VoucherStateValue({ vous_uuid, vous_name, vous_description });
            const voucherStateCreated = await this.voucherStateRepository.createVoucherState(voucherStateValue);
            if(!voucherStateCreated) {
                throw new Error(`No se pudo insertar el estado de comprobante.`);
            }
            return {
                vous_uuid: voucherStateCreated.vous_uuid,
                vous_name: voucherStateCreated.vous_name,
                vous_description: voucherStateCreated.vous_description,
                vous_createdat: TimezoneConverter.toIsoStringInTimezone(voucherStateCreated.vous_createdat, 'America/Buenos_Aires'),
                vous_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherStateCreated.vous_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en createVoucherState (use case):', error.message);
            throw error;
        }
    }

    public async updateVoucherState(vous_uuid: string, { vous_name, vous_description } : { vous_name: string, vous_description: string }) {
        try {
            const voucherStateUpdated = await this.voucherStateRepository.updateVoucherState(vous_uuid, { vous_name, vous_description });
            if(!voucherStateUpdated) {
                throw new Error(`No se pudo actualizar el estado de comprobante.`);
            }
            return {
                vous_uuid: voucherStateUpdated.vous_uuid,
                vous_name: voucherStateUpdated.vous_name,
                vous_description: voucherStateUpdated.vous_description,
                vous_createdat: TimezoneConverter.toIsoStringInTimezone(voucherStateUpdated.vous_createdat, 'America/Buenos_Aires'),
                vous_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherStateUpdated.vous_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en updateVoucherState (use case):', error.message);
            throw error;
        }
    }

    public async deleteVoucherState(vous_uuid: string) {
        try {
            const voucherStateDeleted = await this.voucherStateRepository.deleteVoucherState(vous_uuid);
            if(!voucherStateDeleted) {
                throw new Error(`No se pudo eliminar el estado de comprobante.`);
            }
            return {
                vous_uuid: voucherStateDeleted.vous_uuid,
                vous_name: voucherStateDeleted.vous_name,
                vous_description: voucherStateDeleted.vous_description,
                vous_createdat: TimezoneConverter.toIsoStringInTimezone(voucherStateDeleted.vous_createdat, 'America/Buenos_Aires'),
                vous_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherStateDeleted.vous_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            console.error('Error en deleteVoucherState (use case):', error.message);
            throw error;
        }
    }

    public async findVoucherStateByName(vous_name: string, excludeUuid?: string) {
        try {
            const voucherState = await this.voucherStateRepository.findVoucherStateByName(vous_name, excludeUuid)
            if(voucherState) {
                throw new Error(`Ya existe un estado de comprobante con el nombre ${vous_name}.`);
            }
            return voucherState
        } catch (error: any) {
            console.error('Error en findVoucherStateByName (use case):', error.message);
            throw error;
        }
    }
}