Multi-room Server Manager
=========================

Pourquoi ?
----------
- Pour que chaque Sarah installée (client et serveur) dans un multi-room soit vue comme un client unique d'un système global.
- Pour que chaque client Sarah puisse communiquer et partager des informations avec les autres clients.
- Pour avoir un système multi-room toujours opérationnel (e.g. un client que ne fonctionne plus dû à un plantage system/harware d'un client).
- Pour supprimer les latences réseaux dû au montage de répertoires (e.g. plugins).
		
Comment ?
---------
L'application est en 2 parties:
- Une première partie "ServerManager", application nodejs indépendante, qui gère le multiroom et les clients Sarah qui se connectent.
- Une seconde partie "clientManager", plugin dans chaque client Sarah, qui envoie/recoit des informations du/vers le Server Manager.
	
- Communication synchrone entre le Server Manager et tous les client Manager.
- Gestion des fichiers:
	- Création/Modification/Suppression d'un fichier/répertoire:
		- Sur le server Manager sera automatiquement envoyé sur tous les clients. Si un client est déconnecté, la modification sera envoyé lors de sa prochaine connexion.
		- Sur un client sera automatiquement envoyé sur le Server Manager qui l'enverra à son tour sur tous les autres clients.
- Gestion des versions de fichiers:
	- Permet de gérer pour chaque client une version différente de fichier.
	- Chaque client peut avoir des plugins, des xml, des js, des fichiers de propriétés différents.
- Gestion de requètes HTTP:
	- Le Server Manager recoit et centralise des requètes HTTP (e.g. provenant d'une box domotique) qui sont envoyés automatiquement vers tous les clients ou un client dédié.
- Gestion de l'application des modifications:
	- Si necessaire, redémarrage automatique du serveur et/ou du client de chaque client Sarah pour enregistrer des modifications de fichiers en fonction du type (js,xml,prop,etc...).
- Alerte de déconnexion:
	- Un message d'alerte est envoyé lorsqu'un client ou le Server Manager se déconnecte afin d'avertir des problèmes système/hardware.
- Mode inter-comm:
	- Permet d'envoyer un message vocale depuis un client vers un autre client ou tous les clients via le Server Manager.
- Evolutif:
	- Répertoire plugins sur le Server Manager pour développer ses propres actions pour le Server Manager, par exemple pour ajouter des requètes HTTP, gérer et modifier des fichiers, etc...
		
Compatibilité
-------------
- Le ServerManager peut être installé sur Windows ou Unix.
- Le clientManager est compatible Sarah V3 et Sarah V4.
	
Installation
------------

## Serveur
- Installez [nodejs](https://nodejs.org/en) sur la plateforme où sera installé ServerManager.
- Créez un répertoire parent pour ServerManager, par exemple c:/Apps/multiroom.	
	- Important: N'utilisez pas de caractères d'espacements dans le nom du répertoire.
- Téléchargez et dézippez le fichier 'SARAH-ServerManager-master.zip' dans le répertoire créé.
- Renommez le répertoire créé en 'ServerManager'.
- Ouvrez un gestionnaire de fichiers et déplacez-vous dans le répertoire ServerManager.
- Localisez et double-cliquez sur le fichier 'install_npm_modules.bat'
- Attendez quelques secondes pendant l'installation des modules npm nécessaires à l'application.

##### Test d'installation
Localisez et double-cliquez sur le fichier de lancement 'ServerManager.bat'.
Le message 'info: Multiroom Server Manager ready [X.XXX secs] doit apparaitre sans erreurs à la fin de l'initialisation.
 
Quelques paramètres sont à personnaliser pour finaliser l'installation.


##  Client
- Récupérez le <ServerManager>/client_install/clientManager.zip et copiez-le dans le répertoire <Sarah>/plugins du client Sarah de votre multi-room.
- Dézippez le fichier.
- Supprimez le fichier <Sarah>/plugins/clientManager.zip après l'extraction.
- Ouvrez un gestionnaire de fichiers et déplacez-vous dans le répertoire <Sarah>/plugins/clientManager.	
- Localisez et double-cliquez sur le fichier 'install_npm_modules.bat'
- Attendez quelques secondes pendant l'installation des modules npm nécessaires à l'application.
- Répetez l'opération pour tous les Sarah de votre multi-room.

Quelques paramètres sont à personnaliser pour finaliser l'installation.
	
Propriétés
----------

## Serveur
	

## Client




