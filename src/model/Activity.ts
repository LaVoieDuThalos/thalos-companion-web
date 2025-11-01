export interface Activity {
  id: string;
  name: string;
  filterable?: boolean;
  countable?: boolean;
  figurines?: boolean;
  style: { color: string; backgroundColor: string };
}
