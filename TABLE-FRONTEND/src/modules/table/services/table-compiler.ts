import type { RowConfiguration, RowConfigurationCompiled } from '../models/row/RowConfiguration';
import { buildStyleGetter } from './style';
import { buildValueGetter } from './value';

export const tableCompiler = (configuration: RowConfiguration): RowConfigurationCompiled => {
  const styleGetters: Record<string, (value: any) => string> = {};
  const valueGetters: Record<string, (row: any) => any> = {};

  configuration.rowColorConfiguration?.forEach((config) => {
    styleGetters[config.column] = buildStyleGetter(config.colorConfiguration);
    valueGetters[config.column] = buildValueGetter(config.column);
  });

  return {
    ...configuration,
    compiled: {
      styleGetters,
      valueGetters
    }
  };
};
