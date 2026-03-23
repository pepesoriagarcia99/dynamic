import { styleTransformer } from '../utils/style-transformer';
import type { ColorConfiguration } from '../models/common/ColorConfiguration';

export const buildStyleGetter = (colorConfiguration: ColorConfiguration[] = []) => {
  const compiledStyles: string[] = [];
  colorConfiguration?.forEach((element) => {
    compiledStyles.push(styleTransformer.toString(element.style));
  });

  return (value: any): string => {
    const index = colorConfiguration.findIndex((config) => {
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
};
