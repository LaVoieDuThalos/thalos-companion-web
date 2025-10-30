import { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import IconButton from './IconButton/IconButton';
import View from './View';

type Props = {
  value: number;
  label: string;
  onChange?: (n: number) => void;
};

export default function NumberInput(props: Props) {
  const [numberValue, setNumberValue] = useState(props.value);

  const inc = (dt: number) => {
    setNumberValue((prev) => prev + dt);
  };

  useEffect(() => {
    if (props.onChange) {
      props.onChange(numberValue);
    }
  }, [numberValue, props]);

  return (
    <View style={{}}>
      <View>
        <span style={{}}>{props.label}</span>
      </View>
      <View style={{}}>
        <View style={{}}>
          <IconButton
            icon="remove"
            iconSize={30}
            color={Colors.white}
            onClick={() => inc(-1)}
          />
        </View>
        <View style={{}}>
          <span style={{}}>{numberValue}</span>
        </View>
        <View style={{}}>
          <IconButton
            icon="add"
            iconSize={30}
            color={Colors.white}
            onClick={() => inc(1)}
          />
        </View>
      </View>
    </View>
  );
}
