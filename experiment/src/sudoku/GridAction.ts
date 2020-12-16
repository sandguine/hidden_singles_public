export enum GridActionType {
  Select = 'select',
  Deselect = 'deselect',
  Write = 'write',
  Erase = "erase"
}

export class GridAction {
  actionType: GridActionType;
  x: number;
  y: number;
  digit: string | null;
  new_digit?: string;

  constructor(actionType: GridActionType,
              x: number,
              y: number,
              digit: string | null,
              new_digit?: string) {
    this.actionType = actionType;
    this.x = x;
    this.y = y;
    this.digit = digit;
    this.new_digit = new_digit;
  }
}