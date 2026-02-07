// import { Store } from '../../core/models/Store';
// import type { TableConfiguration } from '../models/configuration/TableConfiguration';
// import type { EventContext, RowEvent } from '../models/event/RowEvent';
// import type { RowData } from '../models/RowData';

import type { TableConfiguration } from "../models/configuration/TableConfiguration";

// /**
//  * Store para gestionar la seleccion de filas en la tabla
//  */
// class SelectionStore extends Store<RowData> {
//   private configuration!: TableConfiguration;

//   constructor() {
//     super({ autoCommit: false });
//   }

//   init(configuration: TableConfiguration) {
//     this.configuration = configuration;
//   }

//   /**
//    * Sistema de seleccion simple (una sola fila)
//    * @param key
//    */
//   // private simpleSelect(event: RowEvent) {
//   //   const key = event.row[this.configuration.primaryKey!];

//     // let selectionCount = 0;
//     // this.elements.forEach((el) => {
//     //   if (el.key === key) {
//     //     const state = el.value?.__ctx.isSelected ?? false;
//     //     el.value!.__ctx.isSelected = !state;
//     //     el.setValue(el.value);
//     //   } else if (el.value?.__ctx.isSelected === true) {
//     //     selectionCount++;
//     //     el.value!.__ctx.isSelected = false;
//     //     el.setValue(el.value);
//     //   }
//     // });

//     // // Caso: cuando haces click en una fila cuando ya tienes seleccionadas varias, todas deben deseleccionarse y quedarse solo la que has clickeado
//     // if (selectionCount > 1) {
//     //   const element = this.elements.find((el) => el.key === key);
//     //   if (element) {
//     //     element.value!.__ctx.isSelected = true;
//     //     element.setValue(element.value);
//     //   }
//     // }
//   // }

//   /**
//    * Sistema de seleccion multiple (varias filas)
//    * @param key
//    */
//   // private multipleSelect(event: RowEvent) {
//   //   const key = event.row[this.configuration!.primaryKey!];
//   //   const eventContext: EventContext = event.ctx;

//   //   if (eventContext.SHIFT && eventContext.CTRL) {
//   //     /**
//   //      * TODO: Implementar seleccion multiple con SHIFT + CTRL
//   //      */
//   //   } else if (eventContext.CTRL) {
//   //     this.elements.forEach((el) => {
//   //       if (el.key === key) {
//   //         const state = el.value?.__ctx.isSelected ?? false;
//   //         el.value!.__ctx.isSelected = !state;
//   //         el.setValue(el.value);
//   //       }
//   //     });
//   //   } else {
//   //     this.simpleSelect(event);
//   //   }
//   // }

//   /**
//    * Maneja el evento de toggle de seleccion de fila
//    *
//    * @param event Evento de fila
//    */
//   // onSelectToggle(event: RowEvent) {
//   //   if (this.configuration!.selectableType === 'single') {
//   //     this.simpleSelect(event);
//   //   } else if (this.configuration!.selectableType === 'multiple') {
//   //     this.multipleSelect(event);
//   //   }

//   //   this.emit();
//   // }

//   /**
//    * Emite cambios en la seleccion
//    * @override
//    */
//   emit() {
//     super.emit(
//       this.elements.filter((element) => element.value?.__ctx.isSelected === true).map((element) => element.getValue())
//     );
//   }

//   /**
//    * Limpia todas las selecciones
//    * @override
//    */
//   clear() {
//     this.elements.forEach((el) => {
//       el.value!.__ctx.isSelected = false;
//       el.setValue(el.value);
//     });
//     this.emit();
//   }
// }

// export const selectionStore = new SelectionStore();

let tableConfiguration: TableConfiguration;
let indexSelection = new Set<string>();
let selection = new Array<any>();

const init = (configuration: TableConfiguration) => {
  tableConfiguration = configuration;
}

const add = (key: string, row: any) => {
  indexSelection.add(key);
  selection.push(row);
};

const remove = (key: string) => {
  indexSelection.delete(key);
  const index = selection.findIndex((item) => item[key] === key);
  if (index > -1) {
    selection.splice(index, 1);
  }
};

const has = (key: string): boolean => {
  return indexSelection.has(key);
};

const clear = () => {
  indexSelection = new Set<string>();
  selection = new Array<any>();
};

const get = (): Array<any> => {
  return selection;
};

export const selectionStore = {
  init,
  add,
  remove,
  has,
  clear,
  get,
}; 
