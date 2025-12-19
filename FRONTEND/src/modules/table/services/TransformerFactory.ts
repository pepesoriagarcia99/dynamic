import type { Column } from "../models/column/Column";
import { AvatarTransformer } from "./transformers/AvatarTransformer";
import { BooleanTransformer } from "./transformers/BooleanTransformer";
import { DateTransformer } from "./transformers/DateTransformer";
import { ImageTransformer } from "./transformers/ImageTransformer";
import { NumberTransformer } from "./transformers/NumberTransformer";
import { RelativeDateTransformer } from "./transformers/RelativeDateTransformer";
import { SelectorTransformer } from "./transformers/SelectorTransformer";
import { StringTransformer } from "./transformers/StringTransformer";

export class TransformerFactory {
    public static createTransformer(column: Column, element: any): any {
        switch (column.type) {
            case 'string':
                return new StringTransformer(column, element);
            case 'number':
                return new NumberTransformer(column, element);
            case 'date':
                return new DateTransformer(column, element);
            case 'boolean':
                return new BooleanTransformer(column, element);
            case 'image':
                return new ImageTransformer(column, element);
            case 'avatar':
                return new AvatarTransformer(column, element);
            case 'relative-date':
                return new RelativeDateTransformer(column, element);
            case 'selector':
                return new SelectorTransformer(column, element);
            default:
                throw new Error(`Transformer for column type ${column.type} not implemented.`);
        }
    }
}
