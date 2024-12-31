export interface ContainerConfig {
    id: string;
    content: string;
    position: {
        x: number;
        y: number;
    };
    height: number;
    width: number;
    zIndex: number;
    columns: number[];
    children: ComponentConfig[];
}

export interface ComponentConfig {
    type: string;
    name: string;
    config: {
        id: string;
        content: string;
        position: {
            x: number;
            y: number;
        };
        height: number;
        width: number;
        zIndex: number;
        gridColumn: number;
    };
} 