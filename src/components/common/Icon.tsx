type Props = {
  iconSize?: number;
  color?: string;
  icon: string;
};

export default function Icon({ icon }: Props) {
  return (
    <span className="material-symbols-outlined" style={{}}>
      {icon}
    </span>
  );
}
