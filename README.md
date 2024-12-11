# MonProjetSup
Ce repository est un mono-repo qui contient plusieurs applications nécessaires au fonctionnement de Mon Projet Sup

<!-- TOC -->
* [MonProjetSup](#monprojetsup)
  * [Applications contenu dans le repo](#applications-contenu-dans-le-repo)
  * [Schéma simplifié des apps et des types d'échanges en local](#schéma-simplifié-des-apps-et-des-types-déchanges-en-local)
  * [Comment lancer le projet](#comment-lancer-le-projet)
    * [Prérequis](#prérequis-)
  * [Les différentes URLs](#les-différentes-urls)
  * [Comment se connecter](#comment-se-connecter-)
    * [Se connecter en local au Keycloak en tant qu'admin (gérer les comptes, les royaumes...)](#se-connecter-en-local-au-keycloak-en-tant-quadmin-gérer-les-comptes-les-royaumes)
    * [Se connecter en local à l'application en tant qu'élève](#se-connecter-en-local-à-lapplication-en-tant-quélève)
    * [Se connecter en local à l'application en tant qu'enseignant](#se-connecter-en-local-à-lapplication-en-tant-quenseignant)
    * [Se connecter en local à l'application en tant qu'expert](#se-connecter-en-local-à-lapplication-en-tant-quexpert)
  * [Déploiement de l'application](#déploiement-de-lapplication)
  * [Fonction des environnements](#fonction-des-environnements)
<!-- TOC -->

## Applications contenu dans le repo
- **keycloak** - Gestionnaire d'authentification (n'est pas déployé, utilisé uniquement pour le dev local)
- **site-public** - Export statique des fichiers du WP permettant d'alimenter les pages publiques (non utilisé en local, uniquement pour le déploiement)
- **app** - Cœur de l'application Mon Projet Sup
  - front - Frontend Typescript/React/ViteJS
  - back - Backend API Kotlin/Spring Boot
  - etl - alimente les données de référence de la BDD  (Kotlin + Java / Spring Boot)
  - suggestions - API des suggestions de formations (Kotlin + Java / Spring Boot)

## Schéma simplifié des apps et des types d'échanges en local
![Schéma apps en local](/doc/schema-local.png)


## Comment lancer le projet
### Prérequis 
- Démarrer Docker sur sa machine
- À la racine du projet lancer la commande : `docker compose -f docker-compose.dev.yml up`
- Alimenter les données de référence de la BDD en suivant les instructions de [app/etl/README.md](app/etl/README.md)
- Lancer l'api Suggestion en suivant les instructions d'[app/suggestions/README.md](app/suggestions/README.md)
- Lancer le backend en suivant les instructions d'[app/back/README.md](app/back/README.md)
- Lancer le frontend en suivant les instructions d'[app/front/README.md](app/front/README.md)

## Les différentes URLs
- Frontend: http://localhost:5001
- Swagger Backend: http://localhost:5002/swagger-ui/index.html/
- Swagger suggestions: http://localhost:8004/swagger-ui/index.html
- Keycloak: http://localhost:5003


## Comment se connecter 
Le keycloak de ce repo est déjà préconfiguré avec des comptes d'accès.

### Se connecter en local au Keycloak en tant qu'admin (gérer les comptes, les royaumes...)
- Url : http://localhost:5003
- Login : admin
- Mot de passe : password

### Se connecter en local à l'application en tant qu'élève
- Url : http://localhost:5001
- Login : eleve
- Mot de passe : password

### Se connecter en local à l'application en tant qu'enseignant
- Url : http://localhost:5001
- Login : enseignant
- Mot de passe : password

### Se connecter en local à l'application en tant qu'expert
- Url : http://localhost:5001
- Login : expert
- Mot de passe : password

## Déploiement de l'application
- Lors du push sur la branch `demo` ou `prod` et une fois les CI validées le code va être push sur un repo privé Gitlab appartenant à Avenir(s) sur les branches respectives correspondants aux différents environnements. 
- Ce push va déclencher automatiquement le build et le deploy de l'application.

## Fonction des environnements
- `integration` utilisé pour recetter une nouvelle fonctionnalité (branch github `demo`) => cet environnement devrait disparaitre prochainement
- `uat` utilisé pour des betas test (branch github `prod`)
- `preprod` identique à integration mais avec un Cloudflare devant (branch github `demo`)
- `prod` utilisé par les utilisateurs finaux (branch github `prod`)

