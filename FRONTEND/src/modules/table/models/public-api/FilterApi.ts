export interface ControlApi {
    index: number;
    reset: () => void // resetea el valor del filtro

    setOptions?: (options: any[]) => void; // añade mas opciones al control

    onChange: (callback: (value: any) => void) => void; // callback emitido al cambiar el valor del filtro
    onNextPage: (callback: () => void) => void; // callback emitido al pulsar "cargar mas" en controls con paginacion (autoComplete)
}

export interface FilterApi {
    controls: ControlApi[];
    reset: () => void
}