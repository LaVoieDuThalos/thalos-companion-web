import CustomCard from '../../../../components/common/CustomCard/CustomCard.tsx';
import Icon from '../../../../components/common/Icon.tsx';
import type { RoomKeyHistory } from '../../../../model/RoomKey.ts';
import { formatDate } from '../../../../utils/Utils.ts';

import './KeyHistoryCard.scss';

type Props = {
  keyHistory: RoomKeyHistory;
};

export default function KeyHistoryCard({ keyHistory }: Props) {
  return (
    <CustomCard>
      <div className="history">
        <h4>Historique</h4>
        {keyHistory.map((entry, index) => (
          <div
            key={entry.date}
            className={'entry' + (index % 2 === 0 ? ' odd' : ' even')}
          >
            <span className="date">{formatDate(entry.date)}</span>
            <span className="from-name">{entry.from.name}</span>
            <span className="separator">
              <Icon icon="double_arrow" iconSize={16} />
            </span>
            <span className="to-name">{entry.to.name}</span>
          </div>
        ))}
      </div>
    </CustomCard>
  );
}
