Multi-room Server Manager
=========================

## Pourquoi ?
- Pour que chaque Sarah installée (client et serveur) dans un multi-room soit vue comme un client unique d'un système global.
- Pour que chaque client Sarah puisse communiquer et partager des informations avec les autres clients.
- Pour avoir un système multi-room toujours opérationnel (e.g. un client que ne fonctionne plus dû à un plantage system/harware d'un client).
- Pour supprimer les latences réseaux dû au montage de répertoires (e.g. plugins).
		
## Comment ?
- L'application est en 2 parties:
	- Une première partie "ServerManager", application nodejs indépendante, qui gère le multi-room et les clients Sarah qui se connectent.
	- Une seconde partie "clientManager", plugin dans chaque client Sarah, qui envoie/recoit des informations du/vers le ServerManager.
- Communication synchrone entre le ServerManager et tous les clientManager.
- Gestion des fichiers:
	- Création/Modification/Suppression d'un fichier/répertoire:
		- Sur le ServerManager sera automatiquement mis à jour sur tous les clients. Si un client est déconnecté, la modification sera envoyé lors de sa prochaine connexion.
		- Sur un client sera automatiquement mis à jour sur le ServerManager qui l'enverra à son tour sur tous les autres clients.
- Gestion des versions de fichiers:
	- Permet de gérer pour chaque client une version différente de fichier.
	- Chaque client peut avoir des plugins, des xml, des js, des fichiers de propriétés différents.
- Gestion de requètes HTTP:
	- Le ServerManager recoit et centralise des requètes HTTP (e.g. provenant d'une box domotique) qui sont envoyés automatiquement vers tous les clients ou un client dédié.
- Gestion de l'application des modifications:
	- Si necessaire, redémarrage automatique du serveur et/ou du client de chaque client Sarah pour enregistrer des modifications de fichiers en fonction du type (js,xml,prop,etc...).
- Alerte de déconnexion:
	- Un message d'alerte est envoyé lorsqu'un client ou le ServerManager se déconnecte afin d'avertir des problèmes système/hardware sur un composant du multi-room.
- Mode inter-comm:
	- Permet d'envoyer un message vocale depuis un client vers un autre client ou tous les clients via le ServerManager.
- Evolutif:
	- Répertoire plugins sur le ServerManager pour développer ses propres actions pour le ServerManager, par exemple pour ajouter des requètes HTTP, gérer et modifier des fichiers, etc...
		
## Compatibilité
- Le ServerManager peut être installé sur Windows ou Unix.
- Le clientManager est compatible Sarah V3 et Sarah V4.
	
## Installation

### Serveur
- Installez [nodejs](https://nodejs.org/en) sur la plateforme où sera installé ServerManager.
	- Acceptez le répertoire par défaut où sélectionnez un répertoire d'installation de votre choix.
- Créez un répertoire parent pour ServerManager, par exemple c:/Apps/multi-room.	
	- Important: N'utilisez pas de caractères d'espacements dans le nom du répertoire.
- Téléchargez et dézippez le fichier 'SARAH-ServerManager-master.zip' dans le répertoire créé.
- Renommez le répertoire créé en 'ServerManager'.
- Ouvrez un gestionnaire de fichiers et déplacez-vous dans le répertoire ServerManager.
- Localisez et double-cliquez sur le fichier 'install_npm_modules.bat'
- Attendez quelques secondes pendant l'installation des modules npm nécessaires à l'application.

##### Test d'installation
Localisez et double-cliquez sur le fichier de lancement 'ServerManager.bat'.
Le message 'info: multi-room Server Manager ready [X.XXX secs] doit apparaitre sans erreurs à la fin de l'initialisation.
 
Quelques [propriétés](#serveur-1) sont à personnaliser pour finaliser l'installation.


###  Client
- Du fait de la version non compatible de nodejs sur les versions courantes de Sarah, installez [nodejs](https://nodejs.org/en) sur la plateforme du client Sarah de votre multi-room.
	- Acceptez le répertoire par défaut où sélectionnez un répertoire d'installation de votre choix en dehors de Sarah.
- Récupérez le #ServerManager#/client_install/clientManager.zip et copiez-le dans le répertoire SARAH/plugins du client Sarah de votre multi-room.
- Dézippez le fichier.
- Supprimez le fichier SARAH/plugins/clientManager.zip après l'extraction.
- Ouvrez un gestionnaire de fichiers et déplacez-vous dans le répertoire SARAH/plugins/clientManager.	
- Localisez et double-cliquez sur le fichier 'install_npm_modules.bat'
- Attendez quelques secondes pendant l'installation des modules npm nécessaires à l'application.
- Répetez l'opération pour tous les Sarah de votre multi-room.

Quelques [propriétés](#client-1) sont à personnaliser pour finaliser l'installation.
	
	
## paramètres

### Serveur
Les propriétés sont définies dans le fichier #ServerManager#/ServerManager.prop

#### http#port (v:Integer)
Port HTTP pour la communication entre le ServerManager et les Sarah clientManager.

#### http#ip (v:String)
Adresse réseau du serveur.

#### root#folders (v:String)
Répertoires synchronisés par le ServerManager. Toutes les modifications faites dans les fichiers/répertoires de ces répertoires seront automatiquement reproduites sur les clients.
##### Important:
- Ces répertoires doivent être dans le même file system que l'application ServerManager.
- Les chemins doivent être absolus et au format Unix (un slash ('/') en début de chemin).
- Les chemins sont séparés par des points-virgules (';').

Exemple pour 2 répertoires 'c:\Apps\working\plugins' et 'c:\Apps\working\script' :
```text
"root" : {
		"folders"  : "/Apps/working/plugins;/Apps/working/script",	
		....
```

#### root#ignored (v:String)
Fichiers non synchronisés par le ServerManager dans les répertoires définis dans le paramètre root.folders.

Format :
- Chemin en absolu pour définir un fichier spécifique.
- Chemin en relatif pour définir une extention de fichier à ignorer globalement. 

##### Important:
- Les chemins en absolus doivent être au format Unix (un slash ('/') en début de chemin).
- Les Fichiers sont séparés par des points-virgules (';').

Exemple pour 'c:\Apps\working\plugins\tvSchedule\portlet.html' et un type de fichier 'css' à ignorer :
```text
"root" : {
		....	
		"ignored"  : "/Apps/working/plugins/tvSchedule/portlet.html;*.css"
		....
```
	
#### notification#sendType (v:String)
Type de notification lors d'une déconnexion d'un client.

Par défaut, 2 types sont possibles:
- pushover
- free

Le type défini dans cette propriété est le nom du fichier js associé dans le répertoire #ServerManager#/notify qui envoie la notification. Par exemple, 'pushover' est le nom du fichier js 'pushover.js' dans le répertoire.

2 paramètres  d'identification associés sont définis par défaut:
- "pushoverUser" et "pushoverToken" pour pushover.
- "SMSuser" et "SMStoken" pour free SMS.

Pour créer un autre type d'envoi:
- Copiez 1 des 2 fichiers js du répertoire #ServerManager#/notify avec le nom que vous voulez et modifiez-le pour votre type d'envoi.
- Utilisez les paramètres d'identification par défaut où ajoutez les votres.
- Aucune autre modification n'est requise, le fichier js est automatiquement chargé par la valeur de la propriété 'sendType'. 
	
### Client
Les propriétés sont définies dans le fichier clientManager.prop du plugin.

#### client (v:String)
Le nom du client dans le multi-room.

Exemple pour un client Sarah 'Salon' :
```text
"client" : "Salon",
		....
```

#### http#local#ip#client (v:String)
Adresse réseau du client micro Sarah.

#### http#local#ip#server (v:String)
Adresse réseau du serveur Sarah.

#### http#serverManager#port (v:Integer)
Port HTTP pour la communication entre le ServerManager et les Sarah clientManager. Doit être le même que défini dans la propriété http#port du ServerManager.prop

#### http#serverManager#ip (v:String)
Adresse réseau du ServerManager. Doit être le même que défini dans la propriété http#ip du ServerManager.prop

#### root#watch (v:String)
Fichiers synchronisés par le clientManager. Toutes les modifications/suppressions faites sur ces fichiers seront automatiquement reproduites sur le ServerManager.

##### Important:
- Le clientManager ne synchronise que des fichiers, ne pas mettre de répertoires.
- Les chemins des fichiers doivent être en relatif à partir du répertoire principal de Sarah et au format Unix (un slash ('/') en début de chemin).
- Les fichiers sont séparés par des points-virgules (';').

Exemple pour 2 fichiers 'SARAH/plugins/scenariz/lib/db/ScenariznoCron.db' et 'SARAH/plugins/tvSchedule/lib/db/tvSchedule.db' :
```text
"root" : {
		"watch"  : "plugins/scenariz/lib/db/ScenariznoCron.db;plugins/scenariz/lib/db/Scenariz.db",	
		....
```

#### root#deleteIgnored (v:String)
Fichiers ignorés par la synchronisation lors de leurs suppressions. 
Utile par exemple pour les fichiers de bases nedb qui sont d'abord supprimés puis ensuite recréés lors de leurs modification, ce qui posent quelques problèmes de synchronisation. 

##### Important:
- Le clientManager ne synchronise que des fichiers, ne pas mettre de répertoires.
- Les chemins des fichiers doivent être en relatif à partir du répertoire principal de SARAH et au format Unix (un slash ('/') en début de chemin).
- Les fichiers sont séparés par des points-virgules (';').


Exemple pour 2 fichiers 'SARAH/plugins/scenariz/lib/db/ScenariznoCron.db' et 'SARAH/plugins/tvSchedule/lib/db/tvSchedule.db' :
```text
"root" : {
		....
		"deleteIgnored"  : "plugins/scenariz/lib/db/ScenariznoCron.db;plugins/scenariz/lib/db/Scenariz.db",	
		....
```

#### root#folders (v:String)
Répertoires à scanner lors de l'initialisation du plugin. Si un fichier inclut dans ces répertoires n'est pas identique à celui du ServerManager, il est mis à jour automatiquement.

##### Important:
- Les répertoires doivent être en relatif à partir du répertoire principal de SARAH.
- Normalement, les répertoires définis ici sont identiques aux répertoires définis dans la propriétés root#folders du fichier ServerManager.prop (mais en relatif).
 
Exemple pour 2 répertoires 'SARAH/plugins' et 'SARAH/macros'(SARAH V3) :
```text
"root" : {
		....
		"folders"  : "plugins;macros"
		....
```
 



