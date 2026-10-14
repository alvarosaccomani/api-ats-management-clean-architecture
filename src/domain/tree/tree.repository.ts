import { TreeEntity } from "./tree.entity";

export interface TreeRepository {
    getCardsTree(usr_uuid: string, scp_uuid?: string): Promise<TreeEntity[] | null>;
}