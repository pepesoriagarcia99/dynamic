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

interface ConditionELement {
  type: 'condition';
  operator: string;
  value: any;
  expanded: boolean;
}

interface BlockElement {
  type: 'block';
  operator: 'AND' | 'OR';
  value: Element[];
  expanded: boolean;
}
