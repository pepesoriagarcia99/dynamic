import type { Style } from "../models/common/Style";


class StyleTransformer {

    toString(columnStyle?: Style): string {
        if (!columnStyle) {
            return '';
        }

        let styleString = '';

        for (const [key, value] of Object.entries(columnStyle)) {
            styleString += `${key}:${value};`;
        }

        return styleString.trim();
    }
}

export const styleTransformer = new StyleTransformer();