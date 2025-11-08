type Props = {
  iconSize?: number;
  color?: string;
  icon: string;
};

export default function Icon({ icon, iconSize, color }: Props) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ color: color ?? undefined, fontSize: iconSize ?? 10 }}
    >
      {icon}
    </span>
  );
}
