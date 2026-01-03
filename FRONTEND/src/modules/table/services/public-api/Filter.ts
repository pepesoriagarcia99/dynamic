interface Control {
  index: number;
}

export class Filter {
  private tableRef: HTMLElement;

  private controls: Control[];

  constructor(tableRef: HTMLElement) {
    this.tableRef = tableRef;
    this.controls = [];
  }

  reset() {}

  setOptions() {}

  // el detalle del evento debe ajustarse a los diferentes tipos de filtro -> string[] o un objeto en los tipos mas avanzados
  onChange() {
    // aqui debo emitir el CustomEvent del table

    // this.tableRef.dispatchEvent(
    //   new CustomEvent(FILTER_EVENT_NAME, {
    //     detail: eventDetail as FilterEvent[],
    //     bubbles: true,
    //     composed: true
    //   })
    // );
  }

  onLoadMore() {}
}
