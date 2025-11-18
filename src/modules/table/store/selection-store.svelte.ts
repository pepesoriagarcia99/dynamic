import type { TableConfiguration } from "../models/configuration/TableConfiguration";
import type { EventContext, RowEvent } from "../models/TableEvents";

type Subscriber = (selected: boolean) => void;

/**
 * Store para gestionar la seleccion de filas en la tabla
 */
class SelectionStore {

  private configuration?: TableConfiguration;

  private selection: string[] = [];

  private subscribers: Map<string, Subscriber> = new Map();

  private selectionSubscribers: Set<(selection: string[]) => void> = new Set();

  constructor() { }

  init(configuration: TableConfiguration /*, data: RowData[]*/) {
    this.configuration = configuration;
    // this.data = data;

    this.selection = [];
    this.subscribers.clear();
  }

  /**
   * Sistema de seleccion simple (una sola fila)
   * @param key 
   */
  private simpleSelect(key: string) {
    const index = this.selection.indexOf(key);
    this.clearSelection();

    if (index !== -1) {
      this.selection = [];
    } else {
      this.selection = [key];
    }

    const subscriber = this.subscribers.get(key);
    if (subscriber) {
      subscriber(index === -1);
    }
  }

  /**
   * Sistema de seleccion multiple (varias filas)
   * @param key 
   */
  private multipleSelect(event: RowEvent) {
    const key = event.row.__key;
    const eventContext: EventContext = event.ctx;

    if (eventContext.SHIFT && eventContext.CTRL) {
      // const dataIndex = event.index;
      // if (this.shiSftSelectStartIndex === null) {
      //   this.shiSftSelectStartIndex = dataIndex!;

      //   this.simpleSelect(key);
      // } else {
      //   const start = Math.min(this.shiSftSelectStartIndex, dataIndex!);
      //   console.log("🚀 ~ SelectionStore ~ multipleSelect ~ start:", start)
      //   const end = Math.max(this.shiSftSelectStartIndex, dataIndex!);
      //   console.log("🚀 ~ SelectionStore ~ multipleSelect ~ end:", end)

      //   this.clearSelection();
      //   this.selection = [];

      //   for (let i = start; i <= end; i++) {
      //     const rowKey = this.data[i].__key;
      //     this.selection.push(rowKey);
      //     const subscriber = this.subscribers.get(rowKey);
      //     if (subscriber) {
      //       subscriber(true);
      //     }
      //   }
      //   this.shiSftSelectStartIndex = null;
      // }
    } else if (eventContext.CTRL) {
      const index = this.selection.indexOf(key);

      if (index === -1) {
        this.selection.push(key);
      } else {
        this.selection.splice(index, 1);
      }

      const subscriber = this.subscribers.get(key);
      if (subscriber) {
        subscriber(index === -1);
      }
    } else {
      this.simpleSelect(key);
    }
  }

  onSelectToggle(event: RowEvent) {
    const key = event.row.__key;

    if (this.configuration!.selectableType === 'single') {
      this.simpleSelect(key);
    } else if (this.configuration!.selectableType === 'multiple') {
      this.multipleSelect(event);
    }

    this.emitSelectionChange();
  }

  onSelectAll() {
    this.subscribers.forEach((callback) => {
      callback(true);
    });
  }

  clearSelection() {
    this.subscribers.forEach((callback) => {
      callback(false);
    });
  }

  subscribe(key: string, callback: Subscriber) {
    this.subscribers.set(key, callback);
  }

  subscribeSelection(callback: (selection: string[]) => void) {
    this.selectionSubscribers.add(callback);
  }

  emitSelectionChange() {
    this.selectionSubscribers.forEach((callback) => {
      callback(this.selection);
    });
  }

  unSubscribe(key: string) {
    this.subscribers.delete(key);
  }

  clearSubscribers() {
    this.subscribers.clear();
  }
}

export const selectionStore = new SelectionStore();


