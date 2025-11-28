import { ColumnType } from "./ColumnType";

export default class Image extends ColumnType {

    constructor() {
        super();
    }

    getValue(): string {
        return '';
    }
}