import type { Column } from "./Column";

export type RowEventType = 'leftclick' | 'rightclick' | 'doubleclick';

export interface RowEvent {
    type: RowEventType;
    index?: number;
    row: any;
    column?: Column
}