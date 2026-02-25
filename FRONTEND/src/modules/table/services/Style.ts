import { styleTransformer } from "../utils/style-transformer";
import type { Column } from "../models/column/Column";

export const buildStyleGetter = (column: Column) => {
  const compiledStyles: string[] = [];
  column.configuration?.colorConfiguration?.forEach(element => {
    compiledStyles.push(styleTransformer.toString(element.style));
  });

  return (value: any): string => {
    if (!column.configuration?.colorConfiguration) {
      return '';
    }

    const index = column.configuration?.colorConfiguration?.findIndex((config) => {
      if (config.range) {
        if (Number(value) >= Number(config.range?.min) && Number(value) <= Number(config.range?.max)) {
          return true;
        }
      } else if (config.value) {
        if (String(value) === String(config.value)) {
          return true;
        }
      }

      return false;
    });

    return index !== -1 ? compiledStyles[index] : '';
  };
}
