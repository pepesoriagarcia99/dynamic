export interface FilterItem {
    key: string;
    value: string | null;
    type: 'string' | 'number' | 'date' | 'boolean';
    operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'STARTS_WITH' | 'ENDS_WITH' | 'GREATER_THAN' | 'LESS_THAN';
}

export interface AdvanceFilter {
    logicalOperator: 'AND' | 'OR';
    filters: Array<FilterItem | AdvanceFilter>;
}

// Example:
// (name == 'pepe' AND age GREATER_THAN '30') OR (city CONTAINS 'York') 

// const exampleAdvanceFilter: AdvanceFilter = {
//     logicalOperator: 'OR',
//     filters: [
//         {
//             logicalOperator: 'AND',
//             filters: [
//                 { key: 'name', value: 'pepe', type: 'string', operator: 'EQUALS' },
//                 { key: 'age', value: '30', type: 'number', operator: 'GREATER_THAN' }
//             ]
//         },
//         {
//             logicalOperator: 'AND',
//             filters: [
//                 { key: 'city', value: 'York', type: 'string', operator: 'CONTAINS' }
//             ]       
//         }
//     ]
// };