import { concatStyles, type Styles } from './Types';
import View, { type ViewProps } from './View';

type Props = ViewProps & {
  size?: number;
  style?: Styles;
  color?: string;
  textColor?: string;
};

const defaultSizeInPx = 14;

export default function Tag({
  style,
  size,
  color,
  textColor,
  children,
  ...props
}: Props) {
  return (
    <View
      {...props}
      style={{
        ...concatStyles(style),
      }}
    >
      {children}
    </View>
  );
}
