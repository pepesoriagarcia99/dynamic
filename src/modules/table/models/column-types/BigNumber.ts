// import { valueTransformer } from "../../../../utils/value-transformer";
import { ColumnType } from "./ColumnType";

/**
 * TODO: integrar transformador de numeros grandes
 * Formato: 1234567,89 --> 1.234.567,89
 * 
 */
export default class BigNumber extends ColumnType {

    constructor() {
        super();
    }

    getValue(): string {
        return '';
        //         const value = this.value;
        
        // // Si el valor está vacío o no es un número, devolver vacío
        // if (value === null || value === undefined || value === '') {
        //     return '';
        // }

        // Convertir a número y luego a string
        // const value = valueTransformer.getValue('value', this);
        // const numStr = String(value);
        
        // // Separar parte entera y decimal si existe
        // const parts = numStr.split('.');
        // const integerPart = parts[0];
        // const decimalPart = parts[1] ? ',' + parts[1] : '';
        
        // // Agregar puntos cada 3 dígitos desde la derecha
        // const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        // return formattedInteger + decimalPart;

        // return '';
    }
}