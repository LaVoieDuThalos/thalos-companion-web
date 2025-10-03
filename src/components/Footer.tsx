import { Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import Icon from './common/Icon';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div style={{}}>
      <ButtonGroup style={{}} aria-label="Basic example">
        <Button variant="secondary" style={{}} onClick={() => navigate('/')}>
          <Icon icon="home" iconSize={30} />
          Accueil
        </Button>
        <Button
          variant="secondary"
          style={{}}
          onClick={() => navigate('/agenda')}
        >
          <Icon icon="calendar_month" iconSize={30} />
          Agenda
        </Button>
        <Button
          variant="secondary"
          style={{}}
          onClick={() => navigate('/keys')}
        >
          <Icon icon="key" iconSize={30} />
          Badges
        </Button>
      </ButtonGroup>
    </div>
  );
}
