
export interface ImageValue {
    src: string;
    alt: string;
}

export interface AvatarValue {
    picture?: string;
    name: string;
    alt: string;
}

export type TransformerValue = string | boolean | ImageValue | AvatarValue | undefined;
