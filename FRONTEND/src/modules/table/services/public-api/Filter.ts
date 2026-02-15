import type { default as HeaderComponent } from '../../components/header/Header.svelte';

// interface Control {
//   index: number;
// }


/**
 * ! No se si este filter api debe conocer el componente Header o solo debe conocer los componentes que gestionan filtros
 */
export class Filter {
  private header: HeaderComponent;

  // private controls: Control[];

  constructor(header: HeaderComponent) {
    this.header = header;
    // this.controls = [];
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

  onSelect() {

  }

  onSelectAll() {
    
  }

  onLoadMore() {}
}
