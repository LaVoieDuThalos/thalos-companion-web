import { ClipLoader } from 'react-spinners';

type Props = {
  color?: string;
  size?: number;
  full?: boolean;
};

export default function ActivityIndicator({ color, size }: Props) {
  return (
    <div style={{}}>
      <ClipLoader
        color={color ?? '#aa0000'}
        cssOverride={{}}
        loading
        size={size ?? 50}
        speedMultiplier={2}
      />
    </div>
  );
}
