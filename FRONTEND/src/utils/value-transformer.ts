export class ValueTransformer {

    // #getKey(key: string) {
    //     return key.replace(/_\d+$/, '');
    // }

    /**
     * Extrae el valor de una clave de un objeto, soportando claves anidadas y arreglos.
     * Ejemplo: 'address.street.name' o 'names.[0].first'
     * 
     * @param key 
     * @param element 
     * @returns 
     */
    getValue(key: string, element: any): any {
        let value;
        let keys = key.split('.');

        if (keys.length > 1) {
            let currentValue = element;
            for (const key of keys) {
                const arrayIndexMatch = key.match(/\[(\d+)\]$/);

                if (arrayIndexMatch) {
                    const index = parseInt(key.replaceAll(/[^\d]/g, ''));
                    currentValue = currentValue[index];
                } else {
                    currentValue = currentValue[key];
                }
            }

            value = currentValue;
        } else {
            value = element[key];
        }

        return value;
    }
}

export const valueTransformer = new ValueTransformer();
