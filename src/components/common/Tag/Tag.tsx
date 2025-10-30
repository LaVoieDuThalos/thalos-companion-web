import { concatStyles, type Styles } from '../Types';
import View, { type ViewProps } from '../View';

import './Tag.scss';

type Props = ViewProps & {
  size?: number;
  style?: Styles;
  color?: string;
  textColor?: string;
};

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
      className="tag"
      style={{
        fontSize: `${size}px`,
        backgroundColor: color,
        color: textColor,
        ...concatStyles(style),
      }}
    >
      {children}
    </View>
  );
}
