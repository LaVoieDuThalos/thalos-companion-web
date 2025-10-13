import { useState } from 'react';
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
  // eslint-disable-next-line
  const [hover, setHover] = useState(false);

  return (
    <Button
      {...rest}
      className="icon-button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
