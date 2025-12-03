import Icon from '../../../../components/common/Icon.tsx';
import { Colors } from '../../../../constants/Colors.ts';
import CustomCard from '../../../../components/common/CustomCard/CustomCard.tsx';
import type { DayCounts } from '../../../../model/Counting.ts';
import type { GameDay } from '../../../../model/GameDay.ts';
import { useEffect, useState } from 'react';
import { countingService } from '../../../../services/CountingService.ts';

type Props = {
  day?: GameDay;
  onClick: () => void
}

export default function CountingsCard({day, onClick}: Props) {

  const [countings, setCountings] = useState<DayCounts | undefined>(undefined);

  useEffect(() => {
    if (day) {
      countingService
        .getCounting(day.id)
        .then((countings) => setCountings(countings ?? undefined));
    }
  }, [day]);

  return <CustomCard
    clickable
    onClick={onClick}
  >
    {!!countings && (
      <Icon icon="check_circle" iconSize={30} color={Colors.green} />
    )}
    <Icon
      icon="123"
      color={countings === undefined ? Colors.gray : Colors.green}
      iconSize={40}
    />
  </CustomCard>;
}