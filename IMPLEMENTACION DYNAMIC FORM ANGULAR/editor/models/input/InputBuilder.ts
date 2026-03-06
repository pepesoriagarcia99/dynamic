/**
 * Modelos guardados en el backend para los formularios
 */
export interface Column {
  name: string;
  type: string;
  value: any;
  editable: boolean;
}


// type: AUTO, BOOLEAN, DATE, SELECTOR
export interface ArtifactInput {
  label: string;
  column: Column;
  required: boolean;
  defaultValue: any;
}



// type: AUTO
export interface AutoArtifact extends ArtifactInput {
  maxCharts: number;
  maxDecimals: number;
}

export interface ButtonArtifact {
  label: string;
  value: string;
}

// type: SPACER, 
export interface ArtifactBackend {
  id: string;
  key: string; // esta key sera usada para la visivilidad
  type: string;
  span: number;
  visible?: string;
  properties?: { [key: string]: any } | AutoArtifact | ButtonArtifact;
}


export interface SchemaBackend {
  id: string;
  name: string;
  columns: number;
  visible?: string;
  artifacts: ArtifactBackend[];
}

export interface FormBackend {
  id: string;
  schemas: SchemaBackend[];
}
