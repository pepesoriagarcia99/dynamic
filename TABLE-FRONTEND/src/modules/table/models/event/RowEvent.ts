import type { Column } from '../column/Column';
import type { RowData } from '../row/RowData';

export type RowEventType = 'leftclick' | 'rightclick' | 'doubleclick';

export interface EventContext {
  CTRL: boolean; // si se ha pulsado la tecla CTRL
  SHIFT: boolean; // si se ha pulsado la tecla SHIFT
}

export interface EventMouse {
  x?: number;
  y?: number;
  preventDefault?: () => void; // función para prevenir el comportamiento por defecto del evento
}

export interface RowEvent {
  type: RowEventType; // tipo de evento
  index?: number; // indice de la fila en la tabla
  row: RowData; // datos de la fila
  column?: Column; // columna afectada (si aplica)
  ctx: EventContext; // contexto del evento
  mouse: EventMouse; // datos del evento
}
