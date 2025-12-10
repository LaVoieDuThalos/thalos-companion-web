export interface Activity {
  id: ActivityId;
  name: ActivityName;
  filterable?: boolean;
  countable?: boolean;
  figurines?: boolean;
  referent?: boolean;
  style: ActivityStyle;
}

export type ActivityId = string;

export type ActivityName = string;

export type Color = string;

export type ActivityStyle = {
  color?: Color;
  backgroundColor?: Color;
}