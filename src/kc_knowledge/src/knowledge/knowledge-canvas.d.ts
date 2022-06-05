import { CytoscapeOptions } from "cytoscape";
export declare class KnowledgeCanvas {
    private cyContainer;
    private cyModel;
    constructor(options?: CytoscapeOptions);
    layout(method: string): void;
    private getAllProjects;
    private getTree;
    private getRoot;
}
