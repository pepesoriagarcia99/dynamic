import type { ColumnStyle } from "../modules/table/models/column/Column";

class StyleTransformer {

    toString(columnStyle?: ColumnStyle): string | undefined {
        if (!columnStyle) {
            return undefined;
        }

        let styleString = '';

        for (const [key, value] of Object.entries(columnStyle)) {
            const kebabKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            styleString += `${kebabKey}: ${value}; `;
        }
        return styleString.trim();
    }
}

export const styleTransformer = new StyleTransformer();