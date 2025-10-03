import { Button, type ButtonProps } from 'react-bootstrap';

import { useState } from 'react';
export type Icons = 'settings';

type Props = ButtonProps & {
  icon: string;
  label?: string;
  color?: string;
  iconSize?: number;
  onClick: () => void;
};

export default function IconButton({
  icon,
  color,
  iconSize,
  label,
  variant,
  onClick,
  ...rest
}: Props) {
  const [hover, setHover] = useState(false);

  return (
    <Button
      {...rest}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <span className="material-symbols-outlined" style={{}}>
        {icon}
      </span>
      {label ? <span>{label}</span> : null}
    </Button>
  );
}
