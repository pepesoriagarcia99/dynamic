export interface Column {
    name: string;
    type: string;
}

export class Model {
    name: string;
    fields: Column[];

    constructor(name: string, fields: Column[]) {
        this.name = name;
        this.fields = fields;
    }
}
