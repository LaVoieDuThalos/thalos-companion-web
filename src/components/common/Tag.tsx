import { concatStyles, type Styles } from './Types';
import View, { type ViewProps } from './View';

type Props = ViewProps & {
  size?: number;
  style?: Styles;
  color?: string;
  textColor?: string;
};

// eslint-disable-next-line
const defaultSizeInPx = 14;

export default function Tag({ style, children, ...props }: Props) {
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
