import { Button, type ButtonProps } from 'react-bootstrap';
import './IconButton.scss';
export type Icons = 'settings';

type Props = ButtonProps & {
  icon: string;
  label?: string;
  variant?: string;
  iconSize?: number;
  onClick: () => void;
};

export default function IconButton({
  icon,
  label,
  iconSize,
  onClick,
  ...rest
}: Props) {
  return (
    <Button
      {...rest}
      className="icon-button"
      variant={rest.variant}
      onClick={onClick}
    >
      <span
        className="icon material-symbols-outlined"
        style={{ fontSize: `${iconSize}px` }}
      >
        {icon}
      </span>
      {label ? <span>{label}</span> : null}
    </Button>
  );
}
