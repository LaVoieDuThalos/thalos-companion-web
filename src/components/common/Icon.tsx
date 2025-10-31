type Props = {
  iconSize?: number;
  color?: string;
  icon: string;
};

export default function Icon({ icon, color }: Props) {
  return (
    <span
      className="material-symbols-outlined"
      style={color ? { color } : undefined}
    >
      {icon}
    </span>
  );
}
