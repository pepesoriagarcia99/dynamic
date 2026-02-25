export interface CommonControlProp {
    id?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    tooltip?: string;
    style?: string;

    value?: any;
    onChange?: (change: string) => void;
}

export interface LazyControlProp {
    lazy?: boolean; // esta propiedad indica que el control debe cargar datos de forma perezosa
}