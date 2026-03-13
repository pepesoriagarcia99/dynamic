export type FilterElement = ConditionELement | BlockElement;

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
  value: FilterElement[];
  expanded: boolean;
}
