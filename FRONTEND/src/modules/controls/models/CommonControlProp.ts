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