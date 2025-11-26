export interface CommonControlProp {
    id?: string;
    label?: string;
    disabled?: boolean;
    tooltip?: string;

    value?: any;
    onChange?: (change: string) => void;
}