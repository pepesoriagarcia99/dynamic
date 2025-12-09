// /**
//  * Tipo de columna para tabla.
//  * 
//  * Patron composite para que los tipos sean estensibles
//  * 
//  * @example
//  * 
//  * class Address implements ColumnType {
//  * 
//  *     address: UserAddress;
//  * 
//  *     constructor(address: UserAddress) {}
//  * 
//  *     getValue(): string {
//  *         return `${this.address.line}, ${this.address.city}, ${this.address.province}, ${this.address.postalCode}`;
//  *     }
//  *  }
//  */

// import type { Column } from "../Column";

// export abstract class ColumnType {
//   abstract getValue(column?: Column, row?: any): string | any;
//   // abstract getValue(row: any): string | any;
//   // abstract getValue(): string | any;
// }