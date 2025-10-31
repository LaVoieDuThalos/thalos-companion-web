import { useCallback, useEffect, useState } from 'react';
import { removeAll } from '../../utils/Utils';
import Radio from './Radio';
import View from './View';

type RadioOption = { value: string; label: string };
type Layout = 'horizontal' | 'vertical';

type Props = {
  label: string;
  value: string[];
  layout?: Layout;
  options: RadioOption[];
  onChange: (value: string[]) => void;
};

export default function RadioGroup({
  label,
  value,
  options,
  onChange,
  ...props
}: Props) {
  const defaultValue = options ? options[0].value : '';

  const [checkedValue, setCheckedValue] = useState(value || defaultValue);

  const handleCheck = useCallback((value: string, checked: boolean) => {
    setCheckedValue((prev = []) => {
      let newValues = [...prev];
      if (checked) {
        newValues.push(value);
      } else {
        newValues = removeAll(newValues, value);
      }

      return newValues;
    });
  }, []);

  useEffect(() => {
    onChange(checkedValue);
  }, [checkedValue]);

  return (
    <View style={{}} {...props}>
      <span style={{}}>{label}</span>
      <View
        style={{
          flexDirection: props.layout === 'horizontal' ? 'row' : 'column',
          gap: 5,
        }}
      >
        {options.map((o) => (
          <Radio
            key={o.value}
            value={o.value}
            label={o.label}
            checked={
              checkedValue &&
              checkedValue.length > 0 &&
              checkedValue.indexOf(o.value) >= 0
            }
            onChange={handleCheck}
          />
        ))}
      </View>
    </View>
  );
}
