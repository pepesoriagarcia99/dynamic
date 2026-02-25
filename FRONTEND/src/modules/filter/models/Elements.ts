// export interface Condition {
//   field: string;
//   operator: string;
//   value: any;
// }

// export interface Block {
//   type: 'block';
//   operator: 'AND' | 'OR';
//   conditions: Condition[] | Block[];
// }



// export interface Element {
//   type: 'condition' | 'block';
//   operator: 'AND' | 'OR' | string;
//   conditions: Element[];
//   value?: any;
// }

export type Element = ConditionELement | BlockElement;

export interface ConditionELement {
  type: 'condition';
  field: string;
  operator: string;
  value: any;
  expanded: boolean;
}

export interface BlockElement {
  type: 'block';
  operator: 'AND' | 'OR';
  value: Element[];
  expanded: boolean;
}
