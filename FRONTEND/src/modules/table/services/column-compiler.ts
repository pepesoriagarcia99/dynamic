import { styleTransformer } from "../utils/style-transformer";
import type { Column, ColumnCompiled } from "../models/column/Column";
import { buildStyleGetter } from "./style";
import { buildValueGetter } from "./value";

export const columnCompiler = (column: Column, index: number): ColumnCompiled => {
    const compiledColum: ColumnCompiled = column as ColumnCompiled;
    compiledColum.compiled = {
        class: {
            column: `column column-${index}`,
            columnValue: `column-value column-value-${index}`
        },
        style: {
            column: styleTransformer.toString(column.style),
        },
        valueGetter: buildValueGetter(column),
        styleGetter: buildStyleGetter(column)
    };

    return compiledColum;
}
