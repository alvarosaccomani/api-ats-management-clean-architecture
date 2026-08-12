export interface PendingVoucherEntity {
    usr_uuid: string;
    pevou_uuid: string;
    pevou_name: string;
    pevou_image: string;
    pevou_unreadcontent: string;
    pevou_unreadtext: string;
    pevou_createdat: Date;
    pevou_updatedat: Date;
}

export type PendingVoucherUpdateData = Pick<PendingVoucherEntity, 'pevou_name' | 'pevou_image' | 'pevou_unreadcontent' | 'pevou_unreadtext'>;
