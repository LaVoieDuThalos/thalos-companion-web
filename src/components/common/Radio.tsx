import { useState } from 'react';
import View from './View';

type RadioOption = { value: string; label: string };

type Props = {
  label: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
};

export default function Radio({
  label,
  value,
  options,
  onChange,
  ...props
}: Props) {
  const defaultValue = options ? options[0].value : '';
  const [checkedValue, setCheckedValue] = useState(value || defaultValue);

  const onCheck = (value: string) => {
    setCheckedValue(value);
    if (onChange) onChange(value);
  };

  return (
    <View style={{}} {...props}>
      <span style={{}}>{label}</span>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        {options.map((o) => (
          <button key={o.value} onClick={() => onCheck(o.value)}>
            <View style={{}}>
              <span style={{}}>{o.label}</span>
            </View>
          </button>
        ))}
      </View>
    </View>
  );
}
