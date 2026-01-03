import type { Column } from "../models/column/Column";
import { AvatarTransformer } from "./transformers/AvatarTransformer";
import { BooleanTransformer } from "./transformers/BooleanTransformer";
import { DateTransformer } from "./transformers/DateTransformer";
import { ImageTransformer } from "./transformers/ImageTransformer";
import { NativeTransformer } from "./transformers/NativeTransformer";
import { NumberTransformer } from "./transformers/NumberTransformer";
import type { TransformerTemplate } from "./TransformerTemplate";

// Cada transformador pertenece a la columna, comparten index
const transformerCache: Array<TransformerTemplate> = []; 

export class TransformerFactory {
    private static readonly transformers = {
        'string': NativeTransformer,
        'relative-date': NativeTransformer,
        'selector': NativeTransformer,
        'number': NumberTransformer,
        'date': DateTransformer,
        'boolean': BooleanTransformer,
        'image': ImageTransformer,
        'avatar': AvatarTransformer,
    } as const;

    public static createTransformer(column: Column): TransformerTemplate {
        const TransformerClass = this.transformers[column.type as keyof typeof this.transformers];
        if (!TransformerClass) {
            throw new Error(`Transformer for column type ${column.type} not implemented.`);
        }

        let transformer = transformerCache[column.index!];
        if (!transformer) {
            transformer = new TransformerClass(column);
            transformerCache.push(transformer);
        }

        return transformer
    }
}
