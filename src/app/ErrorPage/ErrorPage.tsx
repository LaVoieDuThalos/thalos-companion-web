import { applicationService } from '../../services/ApplicationService.ts';
import { Alert, Button, Image } from 'react-bootstrap';
import Icon from '../../components/common/Icon.tsx';
import { Globals } from '../../constants/Globals.ts';

// @ts-expect-error : Cant provide error type
export function ErrorPage({ error }) {
  return (
    <>
      <div
        style={{
          margin: '10px',
          paddingTop: '10px',
        }}
      >
        <div>
          <Image src={Globals.BASE_URL + '/icon100.png'} width={'50vw'} />
          <span className="app-title">La Voie du Thalos</span>
        </div>

        <Alert>️Aie ! Un petit bug empêche l'affichage de l'application.</Alert>

        <p>
          <Button onClick={() => applicationService.reloadApplication()}>
            <Icon icon="refresh" iconSize={30} /> Recharger l'application
          </Button>
        </p>
        <div>
          Si le problème persiste après avoir rechargé l'application. Dite le
          sur le canal Discord dédié : <br />
          <a href="https://discord.com/channels/677657875736166410/1443331310721568920">
            https://discord.com/channels/677657875736166410/1443331310721568920
          </a>{' '}
          . Merci de joindre la capture de cet écran.
          <br />
          Erreur :<pre>{error.message}</pre>
        </div>
      </div>
    </>
  );
}
