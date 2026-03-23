import type { Style } from "./Style";

export interface StyleConfiguration {
  range?: {
    min: any;
    max: any;
  };

  value?: any;
  style: Style;
}
