import type { Column } from "../column/Column";

/**
 * Este evento se dispara al monitorizar el input del filter de una columan concreta
 */
export interface BasicControlEvent {
    column: Column;
    value: string | null;
}