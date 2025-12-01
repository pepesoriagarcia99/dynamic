export type RowData = {
  [key: string]: any; // resto de datos de la fila
  __ctx: {
    key: string; // Forma de identificar la fila de forma unica
    isSelected?: boolean; // Indica si la fila está seleccionada
  };
};
