import { TreeRepository } from "../../domain/tree/tree.repository";

export class TreeUseCase {
    constructor(
        private readonly treeRepository: TreeRepository
    ) {
        this.getCardsTree = this.getCardsTree.bind(this);
    }

    public async getCardsTree(usr_uuid: string) {
        try {
            const cardsTree = await this.treeRepository.getCardsTree(usr_uuid);
            if(!cardsTree) {
                throw new Error('No hay tarjetas.');
            }
            return cardsTree.map(cardsTree => ({
                title: cardsTree.title,
                key: cardsTree.key,
                icon: cardsTree.icon,
                isLeaf: cardsTree.isLeaf,
                children: cardsTree.children,
            }));
        } catch (error: any) {
            console.error('Error en getCardsTree (use case):', error.message);
            throw error;
        }
    }
}