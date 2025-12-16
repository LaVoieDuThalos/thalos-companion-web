import { ButtonGroup } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';
import { ROLE_OUVREUR } from '../../constants/Roles';
import { useUser } from '../../hooks/useUser';
import { settingsService } from '../../services/SettingsService';
import IconButton from '../common/IconButton/IconButton';
import './Footer.scss';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
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
          iconSize={40}
          variant={location.pathname === '/' ? 'danger' : 'secondary'}
          onClick={() => navigate('/')}
        />

        <IconButton
          icon="calendar_month"
          label=""
          iconSize={40}
          variant={location.pathname.startsWith('/agenda') ? 'danger' : 'secondary'}
          onClick={() => navigate('/agenda')}
        />

        {!loading && isOuvreur ? (
          <IconButton
            icon="key"
            label=""
            variant={location.pathname.startsWith('/keys') ? 'danger' : 'secondary'}
            iconSize={40}
            onClick={() => navigate('/keys')}
          />
        ) : null}

        <IconButton
          icon="info"
          label=""
          variant={location.pathname.startsWith('/about') ? 'danger' : 'secondary'}
          iconSize={40}
          onClick={() => navigate('/about')}
        />
      </ButtonGroup>
    </div>
  );
}
