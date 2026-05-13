export interface Activity {
  id: string;
  name: string;
  filterable?: boolean;
  countable?: boolean;
  figurines?: boolean;
  referent?: boolean;
  defaultImg?: string;
  style: { color: string; backgroundColor: string };
}
