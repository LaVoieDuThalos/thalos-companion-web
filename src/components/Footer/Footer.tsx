import { ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { ROLE_OUVREUR } from '../../constants/Roles';
import { useUser } from '../../hooks/useUser';
import { settingsService } from '../../services/SettingsService';
import IconButton from '../common/IconButton/IconButton';
import './Footer.scss';

export default function Footer() {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const isOuvreur =
    user &&
    user.preferences &&
    settingsService.hasRole(user.preferences, ROLE_OUVREUR);

  return (
    <div className="footer">
      <ButtonGroup style={{}} aria-label="Basic example">
        <IconButton
          icon="home"
          label=""
          variant="secondary"
          onClick={() => navigate('/')}
        />

        <IconButton
          icon="calendar_month"
          label=""
          variant="secondary"
          onClick={() => navigate('/agenda')}
        />

        {!loading && isOuvreur ? (
          <IconButton
            icon="key"
            label=""
            variant="secondary"
            onClick={() => navigate('/keys')}
          />
        ) : null}
      </ButtonGroup>
    </div>
  );
}
