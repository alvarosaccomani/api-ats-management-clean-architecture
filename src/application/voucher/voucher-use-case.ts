import { VoucherRepository } from "../../domain/voucher/voucher.repository";
import { VoucherValue } from "../../domain/voucher/voucher.value";
import { TimezoneConverter } from "../../infrastructure/utils/TimezoneConverter";
import { VoucherFeeRepository } from "../../domain/voucher-fee/voucher-fee.repository";
import { VoucherFeeValue } from "../../domain/voucher-fee/voucher-fee.value";
import { sequelize } from "../../infrastructure/db/sequelize";

export class VoucherUseCase {
    constructor(
        private readonly voucherRepository: VoucherRepository,
        private readonly voucherFeeRepository: VoucherFeeRepository
    ) {
        this.getVouchers = this.getVouchers.bind(this);
        this.getDetailVoucher = this.getDetailVoucher.bind(this);
        this.createVoucher = this.createVoucher.bind(this);
        this.updateVoucher = this.updateVoucher.bind(this);
        this.deleteVoucher = this.deleteVoucher.bind(this);
        this.findVoucherByTransactionNumber = this.findVoucherByTransactionNumber.bind(this);
    }

    public async getVouchers(usr_uuid: string, crd_uuid: string, per_uuid: string) {
        try {
            const vouchers = await this.voucherRepository.getVouchers(usr_uuid, crd_uuid, per_uuid);
            if(!vouchers) {
                throw new Error('No hay comprobantes.');
            }
            return vouchers.map(voucher => ({
                usr_uuid: voucher.usr_uuid,
                crd_uuid: voucher.crd_uuid,
                per_uuid: voucher.per_uuid,
                vou_uuid: voucher.vou_uuid,
                vou_authorizationnumber: voucher.vou_authorizationnumber,
                vou_transactionnumber: voucher.vou_transactionnumber,
                vou_datetime: TimezoneConverter.toIsoStringInTimezone(voucher.vou_datetime, 'America/Buenos_Aires'),
                vou_amount: voucher.vou_amount,
                vou_currency: voucher.vou_currency,
                vou_commercename: voucher.vou_commercename,
                vou_commercecuit: voucher.vou_commercecuit,
                vou_commercecategory: voucher.vou_commercecategory,
                tyop_uuid: voucher.tyop_uuid,
                tyop: voucher.tyop,
                vou_installments: voucher.vou_installments,
                vou_installmentcount: voucher.vou_installmentcount,
                vou_installmentinterest: voucher.vou_installmentinterest,
                vou_poscode: voucher.vou_poscode,
                vou_reference: voucher.vou_reference,
                vous_uuid: voucher.vous_uuid,
                vous: voucher.vous,
                vou_image: voucher.vou_image,
                vou_notes: voucher.vou_notes,
                vou_createdat: TimezoneConverter.toIsoStringInTimezone(voucher.vou_createdat, 'America/Buenos_Aires'),
                vou_updatedat: TimezoneConverter.toIsoStringInTimezone(voucher.vou_updatedat, 'America/Buenos_Aires'),
            }));
        } catch (error: any) {
            console.error('Error en getVouchers (use case):', error.message);
            throw error;
        }
    }

    public async getDetailVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string) {
        try {
            const voucher = await this.voucherRepository.findVoucherById(usr_uuid, crd_uuid, per_uuid, vou_uuid);
            if(!voucher) {
                throw new Error(`No hay comprobante con el Id: ${vou_uuid}`);
            }
            const fees = await this.voucherFeeRepository.getVoucherFees(usr_uuid, crd_uuid, per_uuid, vou_uuid);
            return {
                usr_uuid: voucher.usr_uuid,
                crd_uuid: voucher.crd_uuid,
                per_uuid: voucher.per_uuid,
                vou_uuid: voucher.vou_uuid,
                vou_authorizationnumber: voucher.vou_authorizationnumber,
                vou_transactionnumber: voucher.vou_transactionnumber,
                vou_datetime: TimezoneConverter.toIsoStringInTimezone(voucher.vou_datetime, 'America/Buenos_Aires'),
                vou_amount: voucher.vou_amount,
                vou_currency: voucher.vou_currency,
                vou_commercename: voucher.vou_commercename,
                vou_commercecuit: voucher.vou_commercecuit,
                vou_commercecategory: voucher.vou_commercecategory,
                tyop_uuid: voucher.tyop_uuid,
                vou_installments: voucher.vou_installments,
                vou_installmentcount: voucher.vou_installmentcount,
                vou_installmentinterest: voucher.vou_installmentinterest,
                vou_poscode: voucher.vou_poscode,
                vou_reference: voucher.vou_reference,
                vous_uuid: voucher.vous_uuid,
                vou_image: voucher.vou_image,
                vou_notes: voucher.vou_notes,
                vou_createdat: TimezoneConverter.toIsoStringInTimezone(voucher.vou_createdat, 'America/Buenos_Aires'),
                vou_updatedat: TimezoneConverter.toIsoStringInTimezone(voucher.vou_updatedat, 'America/Buenos_Aires'),
                fees: fees ? fees.map(f => ({
                    usr_uuid: f.usr_uuid,
                    crd_uuid: f.crd_uuid,
                    per_uuid: f.per_uuid,
                    vou_uuid: f.vou_uuid,
                    vouf_uuid: f.vouf_uuid,
                    vouf_quotanumber: f.vouf_quotanumber,
                    vouf_quotaamount: f.vouf_quotaamount,
                    vouf_quotaduedate: f.vouf_quotaduedate,
                    voufs_uuid: f.voufs_uuid
                })) : []
            };
        } catch (error: any) {
            console.error('Error en getDetailVoucher (use case):', error.message);
            throw error;
        }
    }
    
    public async createVoucher(data: any) {
        const t = await sequelize.transaction();
        try {
            const voucherValue = new VoucherValue(data);
            const voucherCreated = await this.voucherRepository.createVoucher(voucherValue, { transaction: t });
            if(!voucherCreated) {
                throw new Error(`No se pudo insertar el comprobante.`);
            }

            if(data.fees && Array.isArray(data.fees)) {
                for (const fee of data.fees) {
                    const feeValue = new VoucherFeeValue({
                        ...fee,
                        usr_uuid: voucherCreated.usr_uuid,
                        crd_uuid: voucherCreated.crd_uuid,
                        per_uuid: voucherCreated.per_uuid,
                        vou_uuid: voucherCreated.vou_uuid
                    });
                    await this.voucherFeeRepository.createVoucherFee(feeValue, { transaction: t });
                }
            }

            await t.commit();

            return {
                usr_uuid: voucherCreated.usr_uuid,
                crd_uuid: voucherCreated.crd_uuid,
                per_uuid: voucherCreated.per_uuid,
                vou_uuid: voucherCreated.vou_uuid,
                vou_authorizationnumber: voucherCreated.vou_authorizationnumber,
                vou_transactionnumber: voucherCreated.vou_transactionnumber,
                vou_datetime: TimezoneConverter.toIsoStringInTimezone(voucherCreated.vou_datetime, 'America/Buenos_Aires'),
                vou_amount: voucherCreated.vou_amount,
                vou_currency: voucherCreated.vou_currency,
                vou_commercename: voucherCreated.vou_commercename,
                vou_commercecuit: voucherCreated.vou_commercecuit,
                vou_commercecategory: voucherCreated.vou_commercecategory,
                tyop_uuid: voucherCreated.tyop_uuid,
                vou_installments: voucherCreated.vou_installments,
                vou_installmentcount: voucherCreated.vou_installmentcount,
                vou_installmentinterest: voucherCreated.vou_installmentinterest,
                vou_poscode: voucherCreated.vou_poscode,
                vou_reference: voucherCreated.vou_reference,
                vous_uuid: voucherCreated.vous_uuid,
                vou_image: voucherCreated.vou_image,
                vou_notes: voucherCreated.vou_notes,
                vou_createdat: TimezoneConverter.toIsoStringInTimezone(voucherCreated.vou_createdat, 'America/Buenos_Aires'),
                vou_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherCreated.vou_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            await t.rollback();
            console.error('Error en createVoucher (use case):', error.message);
            throw error;
        }
    }

    public async updateVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string, data: any) {
        const t = await sequelize.transaction();
        try {
            const voucherUpdated = await this.voucherRepository.updateVoucher(usr_uuid, crd_uuid, per_uuid, vou_uuid, data, { transaction: t });
            if(!voucherUpdated) {
                throw new Error(`No se pudo actualizar el comprobante.`);
            }

            if(data.fees && Array.isArray(data.fees)) {
                // A) Consultar los detalles existentes en la base de datos
                const existingFees = await this.voucherFeeRepository.getVoucherFees(usr_uuid, crd_uuid, per_uuid, vou_uuid, { transaction: t }) || [];

                // B) Comparar los IDs existentes contra los IDs de los detalles recibidos
                const incomingIds = data.fees.map((f: any) => f.vouf_uuid).filter(Boolean);

                // C) Eliminar físicamente aquellos detalles que ya no figuran
                const orphans = existingFees.filter((f: any) => !incomingIds.includes(f.vouf_uuid));
                for(const orphan of orphans) {
                    await this.voucherFeeRepository.deleteVoucherFee(usr_uuid, crd_uuid, per_uuid, vou_uuid, orphan.vouf_uuid, { transaction: t });
                }

                // D) Crear o actualizar los detalles recibidos
                for(const fee of data.fees) {
                    const isExisting = fee.vouf_uuid && existingFees.some((ef: any) => ef.vouf_uuid === fee.vouf_uuid);
                    if(isExisting) {
                        await this.voucherFeeRepository.updateVoucherFee(usr_uuid, crd_uuid, per_uuid, vou_uuid, fee.vouf_uuid, fee, { transaction: t });
                    } else {
                        const newFee = new VoucherFeeValue({
                            ...fee,
                            usr_uuid,
                            crd_uuid,
                            per_uuid,
                            vou_uuid
                        });
                        await this.voucherFeeRepository.createVoucherFee(newFee, { transaction: t });
                    }
                }
            }

            await t.commit();

            return {
                usr_uuid: voucherUpdated.usr_uuid,
                crd_uuid: voucherUpdated.crd_uuid,
                per_uuid: voucherUpdated.per_uuid,
                vou_uuid: voucherUpdated.vou_uuid,
                vou_authorizationnumber: voucherUpdated.vou_authorizationnumber,
                vou_transactionnumber: voucherUpdated.vou_transactionnumber,
                vou_datetime: TimezoneConverter.toIsoStringInTimezone(voucherUpdated.vou_datetime, 'America/Buenos_Aires'),
                vou_amount: voucherUpdated.vou_amount,
                vou_currency: voucherUpdated.vou_currency,
                vou_commercename: voucherUpdated.vou_commercename,
                vou_commercecuit: voucherUpdated.vou_commercecuit,
                vou_commercecategory: voucherUpdated.vou_commercecategory,
                tyop_uuid: voucherUpdated.tyop_uuid,
                vou_installments: voucherUpdated.vou_installments,
                vou_installmentcount: voucherUpdated.vou_installmentcount,
                vou_installmentinterest: voucherUpdated.vou_installmentinterest,
                vou_poscode: voucherUpdated.vou_poscode,
                vou_reference: voucherUpdated.vou_reference,
                vous_uuid: voucherUpdated.vous_uuid,
                vou_image: voucherUpdated.vou_image,
                vou_notes: voucherUpdated.vou_notes,
                vou_createdat: TimezoneConverter.toIsoStringInTimezone(voucherUpdated.vou_createdat, 'America/Buenos_Aires'),
                vou_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherUpdated.vou_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            await t.rollback();
            console.error('Error en updateVoucher (use case):', error.message);
            throw error;
        }
    }

    public async deleteVoucher(usr_uuid: string, crd_uuid: string, per_uuid: string, vou_uuid: string) {
        const t = await sequelize.transaction();
        try {
            // First delete associated fees
            const fees = await this.voucherFeeRepository.getVoucherFees(usr_uuid, crd_uuid, per_uuid, vou_uuid, { transaction: t }) || [];
            for (const fee of fees) {
                await this.voucherFeeRepository.deleteVoucherFee(usr_uuid, crd_uuid, per_uuid, vou_uuid, fee.vouf_uuid, { transaction: t });
            }

            const voucherDeleted = await this.voucherRepository.deleteVoucher(usr_uuid, crd_uuid, per_uuid, vou_uuid, { transaction: t });
            if(!voucherDeleted) {
                throw new Error(`No se pudo eliminar el comprobante.`);
            }

            await t.commit();
            return {
                usr_uuid: voucherDeleted.usr_uuid,
                crd_uuid: voucherDeleted.crd_uuid,
                per_uuid: voucherDeleted.per_uuid,
                vou_uuid: voucherDeleted.vou_uuid,
                vou_authorizationnumber: voucherDeleted.vou_authorizationnumber,
                vou_transactionnumber: voucherDeleted.vou_transactionnumber,
                vou_datetime: TimezoneConverter.toIsoStringInTimezone(voucherDeleted.vou_datetime, 'America/Buenos_Aires'),
                vou_amount: voucherDeleted.vou_amount,
                vou_currency: voucherDeleted.vou_currency,
                vou_commercename: voucherDeleted.vou_commercename,
                vou_commercecuit: voucherDeleted.vou_commercecuit,
                vou_commercecategory: voucherDeleted.vou_commercecategory,
                tyop_uuid: voucherDeleted.tyop_uuid,
                vou_installments: voucherDeleted.vou_installments,
                vou_installmentcount: voucherDeleted.vou_installmentcount,
                vou_installmentinterest: voucherDeleted.vou_installmentinterest,
                vou_poscode: voucherDeleted.vou_poscode,
                vou_reference: voucherDeleted.vou_reference,
                vous_uuid: voucherDeleted.vous_uuid,
                vou_image: voucherDeleted.vou_image,
                vou_notes: voucherDeleted.vou_notes,
                vou_createdat: TimezoneConverter.toIsoStringInTimezone(voucherDeleted.vou_createdat, 'America/Buenos_Aires'),
                vou_updatedat: TimezoneConverter.toIsoStringInTimezone(voucherDeleted.vou_updatedat, 'America/Buenos_Aires'),
            };
        } catch (error: any) {
            await t.rollback();
            console.error('Error en deleteVoucher (use case):', error.message);
            throw error;
        }
    }

    public async findVoucherByTransactionNumber(vou_transactionnumber: string) {
        try {
            const voucher = await this.voucherRepository.findVoucherByTransactionNumber(vou_transactionnumber)
            if(voucher) {
                throw new Error(`Ya existe un comprobante con el número de transacción ${vou_transactionnumber}.`);
            }
            return voucher
        } catch (error: any) {
            console.error('Error en findVoucherByTransactionNumber (use case):', error.message);
            throw error;
        }
    }
}