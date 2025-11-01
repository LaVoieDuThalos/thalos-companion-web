import { useEffect } from 'react';
import { useAlert } from '../hooks/useAlert';

type BeforeInstallPromptEvent = Event & {
  prompt: () => void;
};

export default function InstallAppPrompt() {
  const alert = useAlert();

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      const installEvent = e as BeforeInstallPromptEvent;
      alert.dialog(
        'La Voie du Thalos Companion App',
        "Souhaitez-vous installer l'application sur cet appareil ?",
        [
          {
            label: 'Non merci',
            onClick(closeFunction) {
              closeFunction();
            },
          },
          {
            label: 'Oh oui !',
            primary: true,
            onClick(closeFunction) {
              closeFunction();
              installEvent.prompt();
            },
          },
        ]
      );
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    };
  }, []);

  return <></>;
}
