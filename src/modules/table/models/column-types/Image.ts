import { ColumnType } from "./ColumnType";

/**
 * TODO: Revisar que tiene que hacer aqui la columna de imagen
 */
export default class Image extends ColumnType {

    constructor() {
        super();
    }

    getValue(): string {
        return '';
    }
}