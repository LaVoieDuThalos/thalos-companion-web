import { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { ACTIVITIES } from '../../../constants/Activities';
import { Colors } from '../../../constants/Colors';
import type { DayCounts } from '../../../model/Counting';
import { countingService } from '../../../services/CountingService';
import ActivityIndicator from '../../common/ActivityIndicator';
import CustomCard from '../../common/CustomCard/CustomCard';
import Icon from '../../common/Icon';
import type {
  ModalAction,
  ModalPageProps,
} from '../../common/ModalPage/ModalPage';
import ModalPage from '../../common/ModalPage/ModalPage';
import NumberInput from '../../common/NumberInput/NumberInput';
import View from '../../common/View';

type Props = ModalPageProps & {
  title?: string;
  dayId: string;
  onSuccess: () => void;
  onCancel: () => void;
  onChange?: (counts: DayCounts) => void;
};

const selectDefaultTab = () => {
  const now = new Date();
  if (now.getHours() >= 20) {
    return 'night';
  } else {
    return 'afternoon';
  }
};

export default function CountingFormModal(props: Props) {
  const [counts, setCounts] = useState<DayCounts>({
    dayId: props.dayId,
  });
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(selectDefaultTab());

  useEffect(() => {
    countingService.getCounting(props.dayId).then((countings) => {
      setCounts(countings || { dayId: props.dayId });
    });
  }, [props.dayId]);

  const ACTIONS: ModalAction[] = [
    {
      name: 'cancel',
      label: 'Annuler',
      disabled: loading,
      variant: 'secondary',
      onClick: () => {
        if (props.onCancel) {
          props.onCancel();
        }
      },
    },
    {
      name: 'save',
      label: 'Enregistrer',
      disabled: loading,
      onClick: () => {
        setLoading(true);
        countingService
          .saveOrUpdateCounting(counts)
          .then(() => {
            setLoading(false);
            if (props.onSuccess) {
              props.onSuccess();
            }
          })
          .catch(() => setLoading(false));
      },
    },
  ];

  const setActivityCounts = (
    period: 'afternoon' | 'night',
    activityId: string,
    count: number
  ): void => {
    setCounts((prev) => {
      return {
        ...prev,
        [period]: { ...prev[period], [activityId]: count },
      };
    });
  };

  const activities = ACTIVITIES.filter((a) => a.countable);

  return (
    <ModalPage
      {...props}
      onHide={props.onCancel}
      options={{ title: props.title, actions: ACTIONS }}
    >
      {loading ? (
        <View style={{}}>
          <ActivityIndicator color={Colors.red} size={50} />
        </View>
      ) : null}
      {!loading ? (
        <div>
          <div>
            <Nav
              fill
              variant="tabs"
              defaultActiveKey={selectDefaultTab()}
              onSelect={(e) => setCurrentTab(e || 'afternoon')}
            >
              <Nav.Item>
                <Nav.Link eventKey="afternoon" title="Après-midi">
                  <Icon icon="sunny" iconSize={30} />
                  <span style={{ fontSize: 20 }}>Après-midi</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="night" title="Soirée">
                  <Icon icon="nightlight" iconSize={30} />
                  <span style={{ fontSize: 20 }}>Soirée</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          {!loading && currentTab === 'afternoon' ? (
            <>
              {activities.map((act) => (
                <CustomCard key={act.id} clickable={false}>
                  <NumberInput
                    label={act.name}
                    value={
                      counts.afternoon && counts.afternoon[act.id] !== undefined
                        ? counts.afternoon[act.id]
                        : 0
                    }
                    onChange={(count) =>
                      setActivityCounts('afternoon', act.id, count)
                    }
                  />
                </CustomCard>
              ))}
            </>
          ) : null}
          {!loading && currentTab === 'night' ? (
            <>
              {activities.map((act) => (
                <CustomCard key={act.id} style={{}}>
                  <NumberInput
                    label={act.name}
                    value={
                      counts.night && counts.night[act.id] !== undefined
                        ? counts.night[act.id]
                        : 0
                    }
                    onChange={(count) =>
                      setActivityCounts('night', act.id, count)
                    }
                  />
                </CustomCard>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </ModalPage>
  );
}
