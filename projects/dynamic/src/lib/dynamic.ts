import { ApplicationRef, Injector, inject } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { Datagrid } from './datagrid/datagrid';

export class DynamicElementsLoader {

  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);

  constructor() {
    this.registerElements();
  }

  private registerElements() {
    if (!customElements.get('dyn-datagrid')) {
      const datagridElement = createCustomElement(Datagrid, {
        injector: this.injector,
      });
      customElements.define('dyn-datagrid', datagridElement);
    }
  }
}
