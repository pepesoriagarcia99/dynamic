import type { Style } from "./Style";

export interface ColorConfiguration {
  range?: {
    min: any;
    max: any;
  };

  value?: any;
  style: Style;
}

export interface ColumnConfiguration {
  colorConfiguration?: ColorConfiguration[];
}
