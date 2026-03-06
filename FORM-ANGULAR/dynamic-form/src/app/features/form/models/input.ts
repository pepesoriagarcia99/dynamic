

export interface Form {
    name: string;

    columns: number; 

    active: boolean; // el admin puede configurar si esta pestaña esta activa

    visible: string; // Input para el servicio de visivilidad ('leader_name_column == 12')

    controls: FormControl[];
}

export type ArtifactType = 'AUTO';

export interface Artifact {
    id: string; // nombre de la columna, si no se asigna uno aleatorio

    type: ArtifactType;

    span: number;

    active: boolean; // el admin puede configurar si este control esta activo

    editable: boolean;

    visible: string; // Input para el servicio de visivilidad ('leader_name_column == 12')

    properties: any
}
