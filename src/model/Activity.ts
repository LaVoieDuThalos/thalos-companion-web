export interface Activity {
  id: string;
  name: string;
  filterable?: boolean;
  countable?: boolean;
  figurines?: boolean;
  referent?: boolean;
  style: { color: string; backgroundColor: string };
}
