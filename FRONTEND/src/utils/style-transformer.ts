import type { Style } from "../modules/table/models/column/Style";


class StyleTransformer {

    toString(columnStyle?: Style): string | undefined {
        if (!columnStyle) {
            return undefined;
        }

        let styleString = '';

        for (const [key, value] of Object.entries(columnStyle)) {
            styleString += `${key}:${value};`;
        }

        return styleString.trim();
    }
}

export const styleTransformer = new StyleTransformer();