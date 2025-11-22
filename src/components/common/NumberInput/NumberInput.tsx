import { useState } from 'react';
import { Colors } from '../../../constants/Colors';
import IconButton from '../IconButton/IconButton';
import './NumberInput.scss';
type Props = {
  value: number;
  min?: number;
  max?: number;
  label: string;
  onChange?: (n: number) => void;
};

export default function NumberInput(props: Props) {
  const [numberValue, setNumberValue] = useState(props.value);

  const inc = (dt: number) => {
    setNumberValue((prev) => {
      const newValue = prev + dt;
      if (props.onChange) {
        props.onChange(newValue);
      }
      return newValue;
    });
  };

  return (
    <div className="number-input">
      <span className="number-input-label">{props.label}</span>
      <div className="input-buttons">
        <IconButton
          icon="remove"
          disabled={props.min !== undefined && numberValue === props.min}
          iconSize={30}
          color={Colors.white}
          onClick={() => inc(-1)}
        />
        <span className="input-value">{numberValue}</span>
        <IconButton
          icon="add"
          iconSize={30}
          disabled={props.max !== undefined && numberValue === props.max}
          color={Colors.white}
          onClick={() => inc(1)}
        />
      </div>
    </div>
  );
}
