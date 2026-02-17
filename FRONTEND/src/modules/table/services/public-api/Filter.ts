import type { default as HeaderComponent } from '../../components/header/Header.svelte';
import type { default as SimpleFilterComponent } from '../../components/header/filter/SimpleFilter.svelte';


export class Filter {
  private filter: SimpleFilterComponent | null;

  constructor(header: HeaderComponent) {
    this.filter = header.getSimpleFilter();
  }

  reset() {
    this.filter?.reset();
  }

  // setOptions() {

  // }

  // onChange() {

  // }

  // onSelect() {

  // }

  // onSelectAll() {
    
  // }

  // onLoadMore() {

  // }
}
