import CustomCard from '../../components/common/CustomCard/CustomCard';

import './AboutPage.scss';

export default function AboutPage() {
  return (
    <>
      <h2>Objectifs de l'application</h2>
      <div className="objectives">
        <ul>
          <li>
            Améliorer l'organisation et la visibilité des différents évènements
            proposés au sein de l'association.
          </li>
          <li>
            Simplifier la gestion des salles (réservation, occupation,
            planning).
          </li>
          <li>Aider la gestion de l'association au sens large.</li>
        </ul>
      </div>
      <hr />
      <h2>Liens utiles</h2>
      <div className="links">
        <CustomCard>
          <a href="https://discord.gg/x6M4HhGRS5" target="_blank">
            <img src="icons/discord.png" width={100} />
            <br />
            Discord
          </a>
        </CustomCard>
        <CustomCard>
          <a href="mailto:voieduthalos@hotmail.com" target="_blank">
            <img src="icons/email.png" width={100} />
            <br />
            E-mail
          </a>
        </CustomCard>
        <CustomCard>
          <a href="https://voie-du-thalos.org" target="_blank">
            <img src="icons/globe.png" width={100} />
            <br />
            Site web voie-du-thalos.org
          </a>
        </CustomCard>
        <CustomCard>
          <a
            href="https://www.facebook.com/lavoieduthalos/?locale=fr_FR"
            target="_blank"
          >
            <img src="icons/facebook.png" width={100} />
            <br />
            Facebook
          </a>
        </CustomCard>
        <CustomCard>
          <a href="https://www.instagram.com/voieduthalos/" target="_blank">
            <img src="icons/instagram.png" width={100} />
            <br />
            Instagram
          </a>
        </CustomCard>
        <CustomCard>
          <a
            href="https://www.myludo.fr/#!/profil/la-voie-du-thalos-12862/collection"
            target="_blank"
          >
            <img src="icons/myludo.png" width={200} />
            <br />
            Notre ludothèque sur MyLudo
          </a>
        </CustomCard>
        <CustomCard>
          <a
            href="https://github.com/LaVoieDuThalos/thalos-companion-web"
            target="_blank"
          >
            <img src="icons/github.png" width={100} />
            <br />
            Code source
          </a>
        </CustomCard>
      </div>
      <hr />
      <h2>Mentions légales</h2>
      <div>
        <h3>Propriétaire du site/application</h3>
        Le site internet sis à l’adresse{' '}
        <a href="https://www.voie-du-thalos.org/">www.voie-du-thalos.org</a> est
        le site officiel de : <p>L’association « La Voie du Thalos »</p>
        <p>1 Place Clémence ISAURE </p>
        <p>31320 Castanet Tolosan (siège social)</p>
        <h3>Responsable de publication</h3>
        <p>La présidente de l’association La Voie du Thalos.</p>
        <h3>Éditeur du site</h3>
        <p>L’association La Voie du Thalos </p>
        <p>1 Place Clémence ISAURE 31320 Castanet Tolosan</p>
        <p>
          {' '}
          Email :{' '}
          <a href="mailto:voieduthalos@hotmail.com">voieduthalos@hotmail.com</a>
        </p>
        <h3>Données recueillies</h3>
        <p>Aucune donnée personnelle n'est recueillie.</p>
        <h3>Réclamation</h3>
        <p>
          Pour toute réclamation se rapportant aux contenus publiés quel qu’en
          soit le vecteur n’hésitez pas à{' '}
          <a href="mailto:voieduthalos@hotmail.com">nous contacter</a>.
        </p>
      </div>
    </>
  );
}
