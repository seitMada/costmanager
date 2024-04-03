export interface InterfaceComposition {
    id?: number | undefined;
    fichetechniqueId: number;
    articleId: number;
    quantite: number;
    uniteId: number;
}

export interface InterfaceCompositions {
    compositions: InterfaceComposition[];
}
