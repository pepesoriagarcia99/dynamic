import { styleTransformer } from "../../../utils/style-transformer";
import type { Column, ColumnCompiled } from "../models/column/Column";
import { buildValueGetter } from "./value";

export const columnCompiler = (column: Column, index: number): ColumnCompiled => {
    const compiledColum: ColumnCompiled = column as ColumnCompiled;
    compiledColum.compiled = {
        class: {
            column: `column column-${index}`,
            columnValue: `column-value column-value-${index}`
        },
        style: {
            column: styleTransformer.toString(column.style)
        },
        valueGetter: buildValueGetter(column),
        // styleGetter: buildStyleGetter(column)
    };
    return compiledColum;
}

  // const optimizedColumns: OptimizedColumn[] = $derived(
  //   /**
  //    * TODO: Revisar tipado Typescript
  //    * TODO: Revisar rendimiento de esto
  //    */
  //   columns.map((column, index) => {
  //     const optimizationColumn: OptimizedColumn = column as OptimizedColumn;
  //     optimizationColumn.optimization = {
  //       style: {
  //         td: `column column-${index}`,
  //         val: `column-value column-value-${index}`
  //       },
  //       valueGetter: buildValueGetter(column),
  //       // styleGetter: buildStyleGetter(column)
  //     };

  //     // if (column.style) {
  //     //   optimizationColumn.optimization.style.custom = styleTransformer.toString(column.style);
  //     // }

  //     // if (optimizationColumn?.configuration?.colorConfiguration && column?.configuration?.colorConfiguration) {
  //     //   optimizationColumn.optimization.configuration = {
  //     //     colorConfiguration: []
  //     //   };

  //     //   column.configuration?.colorConfiguration.forEach((colorConfig: ColorConfiguration) => {
  //     //     optimizationColumn.optimization.configuration!.colorConfiguration!.push({
  //     //       style: styleTransformer.toString(colorConfig.style)
  //     //     });
  //     //   });
  //     // }

  //     // optimizationColumn.resizable = column.resizable ?? untrack(() => resizable);

  //     return optimizationColumn;
  //   })
  // );

