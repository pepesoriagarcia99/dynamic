import { ColumnType } from "./ColumnType";

interface EnumOptions<T> {
  /** Se añade un primer valor vacio */
  firstEmpty?: boolean;
}

export default class Enum<T> extends ColumnType {
  #translateRef: string = '';

  #values: { key: T; name: string }[] = [];

  constructor(enumObj: Record<string, any>, options?: EnumOptions<T>) {
    super();

    // this.#translateRef = this.#searchParentKey(enumObj);
    // this.#initValues(enumObj);
    // if(options?.firstEmpty) {
    //   this.#values.unshift({ key: null as T, name: '' });
    // }
  }

  /**
   * TODO: muy mejorable, revisar en el futuro
   */
  //   #searchParentKey(target: Record<string, string>): string {
  //     let result;

  //     for (const [key, value] of Object.entries(es)) {
  //       if (typeof value === 'object' && value !== null) {
  //         const matches = Object.entries(target).every(([k, v]) => k in value);
  //         if (matches) {
  //           result = key;
  //         }
  //       }
  //     }

  //     if (!result) {
  //       throw new Error('No se encontró la referencia de traducción');
  //     }

  //     return result;
  //   }

  //   #initValues(enumObj: Object) {
  //     this.#values = Object.values(enumObj).map((key) => ({
  //       key: key,
  //       name: es[this.#translateRef][key] as string,
  //     }));
  //   }

  //   getTranslateValue(value: string): string {
  //     return es[this.#translateRef][value] as string;
  //   }

  //   getSymbolValue(value: string): string {
  //     return es[this.#translateRef][value + 'Symbol'] as string;
  //   }

  //   get values(): { key: T; name: string }[] {
  //     return this.#values;
  //   }

  getValue(): string {
    return '';
  }
}
