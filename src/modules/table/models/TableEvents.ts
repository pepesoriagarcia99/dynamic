import type { Column } from "./Column";

export type RowEventType = 'leftclick' | 'rightclick' | 'doubleclick';
export type RowData = {
    __key: string; // Forma de identificar la fila de forma unica
    [key: string]: any; // resto de datos de la fila
};

export interface EventContext {
    CTRL: boolean; // si se ha pulsado la tecla CTRL
    SHIFT: boolean; // si se ha pulsado la tecla SHIFT
}

export interface RowEvent {
    type: RowEventType; // tipo de evento
    index?: number; // indice de la fila en la tabla
    row: RowData; // datos de la fila
    column?: Column // columna afectada (si aplica)
    ctx: EventContext // contexto del evento
}