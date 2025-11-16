/**
 * Tipo de columna para tabla.
 * 
 * Patron composite para que los tipos sean estensibles
 * 
 * @example
 * 
 * class Address implements ColumnType {
 * 
 *     address: UserAddress;
 * 
 *     constructor(address: UserAddress) {}
 * 
 *     getValue(): string {
 *         return `${this.address.line}, ${this.address.city}, ${this.address.province}, ${this.address.postalCode}`;
 *     }
 *  }
 */

// export interface ColumnType {
//     getValue(): string;
// }

export abstract class ColumnType {
  abstract getValue(): string;

  // TODO: se tiene que agreagar un filter strategy --> esto marcara el input del filtro
}