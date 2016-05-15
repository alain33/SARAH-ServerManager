Multi-room Server Manager
=========================

This application is an add-on for the framework [S.A.R.A.H.](http://encausse.net/s-a-r-a-h), an Home Automation project built 
on top of:
* C# (Kinect) client for Voice, Gesture, Face, QRCode recognition. 
* NodeJS (ExpressJS) server for Internet of Things communication

## Pourquoi ?
- Pour que chaque SARAH (client/serveur) dans le multi-room soit vu comme un client d'un système global.
- Pour avoir un système multi-room toujours opérationnel même en cas de plantage d'un client ou de ce qui a été défini comme "Serveur".
- Pour populer les informations (plugins, mise à jour, etc...) sans se connecter sur chaque système.
- Pour que tous les clients soient synchronisés, puissent communiquer et partager des informations avec les autres clients.		
- Pour simplifier la communication de tous les clients avec une box domotique en centralisant les actions.
- Pour supprimer les latences réseaux dû au montage de répertoires.
	
## Comment ?
- L'application est en 2 parties:
	- Une première partie "ServerManager", application nodejs indépendante, qui gère le multi-room, les clients Sarah qui se connectent et envoie/recoit des informations du/vers les clients.
	- Une seconde partie "clientManager", plugin dans chaque client Sarah, qui envoie/recoit des informations du/vers le ServerManager.
- Communication synchrone entre le ServerManager et tous les clientManager.
- Gestion des fichiers:
	- Création, Modification, Suppression d'un fichier ou d'un répertoire:
		- Sur le ServerManager:
			- Sera automatiquement mis à jour sur tous les clients. Si un client est déconnecté, la modification sera envoyée lors de sa prochaine connexion.
			- Vous pouvez copier/modifier un fichier, un répertoire entier ou tous vos plugins, ils seront envoyés/modifiés vers tous les clients en une seule fois.
		- Sur un client: 
			- Sera automatiquement mis à jour sur le ServerManager qui l'enverra à son tour vers tous les autres clients.
- Gestion des versions de fichiers:
	- Permet de gérer une version différente de fichier en fonction de chaque client.
	- Chaque client peut avoir des plugins, des xml, des js et des fichiers de propriétés différents.
- Gestion de requètes HTTP:
	- Le ServerManager peut recevoir et centraliser des requètes HTTP.
- Gestion de l'application des modifications:
	- Si nécessaire, redémarrage automatique du serveur et/ou du client Sarah de chaque client de ServerManager pour enregistrer des modifications de fichiers en fonction du type (js,xml,prop,etc...).
- Alerte de déconnexion:
	- Un message d'alerte est envoyé lorsqu'un client ou le ServerManager se déconnecte afin d'avertir d'un problème de fonctionnement.
- Mode inter-comm:
	- Permet d'envoyer un message vocale depuis un client vers un autre client ou tous les clients via le ServerManager.
- Evolutif:
	- Répertoire plugins sur le ServerManager pour développer ses propres actions pour le ServerManager, par exemple pour ajouter des requètes HTTP, gérer et modifier des fichiers, lancer une règle sur un client et l'exécuter sur tous les autres clients, etc...
		
## Table des matières		
- [Compatibilité](#compatibilité)	
- [Installation](#installation)		
	- [Serveur](#serveur)
	- [Client](#client)
- [Propriétés](#propriétés)
	- [Serveur](#serveur-1)
	- [Client](#client-1)
- [Gestion de la version des fichiers](#gestion-de-la-version-des-fichiers)	
- [Règles client](#Règles-client)
- [Développement](#développement)
	- [Règle client exécutée sur le ServerManager](#règle-exécutée-sur-le-servermanager)
	- [API](#api)
	- [Exemples](#exemples)
	- [HTTP format](#http-format)
- [Versions](#versions)

## Compatibilité
- Le ServerManager peut être installé sur Windows ou Unix.
- Le clientManager est compatible Sarah V3 et Sarah V4.
	
## Installation

### Serveur

- Installez [nodejs](https://nodejs.org/en) sur la plateforme où sera installé ServerManager.
	- Le programme d'installation est aussi disponible dans le 'SARAH-ServerManager-master.zip' et sous ServerManager/client_install/nodejs
	- Sélectionnez un répertoire d'installation de votre choix.
- Créez un répertoire parent pour ServerManager, par exemple c:/Apps/multi-room.	
	- Important: N'utilisez pas de caractères d'espacements dans le nom du répertoire.
- Téléchargez et dézippez le fichier 'SARAH-ServerManager-master.zip' dans le répertoire créé.
	- Supprimer le dernier répertoire du chemin proposé pour ne pas avoir de doublon de répertoire.
- Renommez le répertoire créé en 'ServerManager'.
- Ouvrez un shell (commande cmd) et déplacez-vous dans le répertoire ServerManager.
- Entrez la commande: install_npm_modules
- Attendez quelques secondes pendant l'installation d'un module npm nécessaire à l'application.

##### Test d'installation
Localisez et double-cliquez sur le fichier de lancement 'ServerManager.bat'.
Le message 'info: multi-room Server Manager ready [X.XXX secs] doit apparaitre sans erreurs à la fin de l'initialisation.
 
Quelques [propriétés](#serveur-1) sont à personnaliser pour finaliser l'installation.


###  Client
- Du fait des versions anciennes de nodejs sur les versions courantes de Sarah, installez [nodejs](https://nodejs.org/en) sur la plateforme du client Sarah de votre multi-room.
	- Le programme d'installation est aussi disponible dans le 'SARAH-ServerManager-master.zip' et sous ServerManager/client_install/nodejs
	- Sélectionnez un répertoire d'installation de votre choix en dehors des répertoires de Sarah.
- Récupérez le #ServerManager#/client_install/clientManager.zip et copiez-le dans le répertoire SARAH/plugins du client Sarah de votre multi-room.
- Dézippez le fichier.
	- Supprimer le dernier répertoire du chemin proposé pour ne pas avoir de doublon de répertoire.
- Supprimez le fichier SARAH/plugins/clientManager.zip après l'extraction.
- Ouvrez un shell (commande cmd) et déplacez-vous dans le répertoire SARAH/plugins/clientManager.
- Entrez la commande: install_npm_modules
- Attendez quelques secondes pendant l'installation du module npm nécessaire à l'application.
- Répetez ensuite l'opération pour toutes les Sarah de votre multi-room.

Quelques [propriétés](#client-1) sont à personnaliser pour finaliser l'installation.
	
	
## Propriétés

### Serveur
Les propriétés sont définies dans le fichier #ServerManager#/ServerManager.prop

#### http#port (v:Integer)
Port HTTP pour la communication entre le ServerManager et les Sarah clientManager.

#### http#ip (v:String)
Adresse réseau du serveur.

#### root#folders (v:String)
Répertoires synchronisés par le ServerManager. 
Toutes les modifications faites dans les fichiers/sous-répertoires de ces répertoires seront automatiquement reproduites sur les clients.

Par exemple, le répertoire plugins peut être synchronisé pour que toutes les modifications apportées sur ce répertoire soient mises à jour sur chacun des clients:
- Ajout, suppression d'un plugin.
- Mise à jour d'un fichier dans un plugin.
- Fichier(s) devant être synchrone(s) dans tous les clients.
- etc...

##### Important:
- Ces répertoires doivent être dans le même file système que l'application ServerManager.
- Les chemins doivent être absolus et au format Unix (un slash ('/') en début de chemin).
- Les noms sont case-sensitives donc faites attention aux majuscules, minuscules.
- Les chemins sont séparés par des points-virgules (';').

Exemple pour 2 répertoires à synchroniser 'c:\Apps\working\plugins' et 'c:\Apps\working\macros' :
```text
"root" : {
		"folders"  : "/Apps/working/plugins;/Apps/working/macros",	
		....
```

#### root#ignored (v:String)
Fichiers non synchronisés par le ServerManager dans les répertoires définis dans le paramètre root.folders.

Format, soit :
- Un chemin en absolu pour définir un fichier spécifique à ignorer.
- Une extention de fichier à ignorer globalement. 

##### Important:
- Les chemins en absolus doivent être au format Unix (un slash ('/') en début de chemin).
- Les noms sont case-sensitives donc faites attention aux majuscules, minuscules.
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

2 paramêtres  d'identification associés sont définis par défaut:
- "pushoverUser" et "pushoverToken" pour pushover.
- "SMSuser" et "SMStoken" pour free SMS.

Pour créer un autre type d'envoi:
- Copiez 1 des 2 fichiers js du répertoire #ServerManager#/notify avec le nom que vous voulez et modifiez-le pour votre type d'envoi.
- Utilisez les paramètres d'identification par défaut où ajoutez les votres dans le #ServerManager#/ServerManager.prop.
- Changer la valeur de la propriété 'sendType' par le nom de votre fichier js.
- Aucune autre modification n'est requise, le fichier js est automatiquement chargé par la valeur de la propriété 'sendType'. 
	
	
### Client
Les propriétés sont définies dans le fichier clientManager.prop du plugin clientManager.

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
Port HTTP pour la communication entre le ServerManager et le clientManager. Doit être le même que défini dans la propriété http#port du ServerManager.prop

#### http#serverManager#ip (v:String)
Adresse réseau du ServerManager. Doit être le même que défini dans la propriété http#ip du ServerManager.prop

#### root#watch (v:String)
Fichiers synchronisés par le clientManager. Toutes les modifications/suppressions faites sur ces fichiers seront automatiquement reproduites sur le ServerManager.

Tous les fichiers de tous les répertoires de Sarah peuvent être synchronisés. 
Bien sûr, pour que le ServerManager tienne compte de la synchronisation, le répertoire principal parent du fichier doit être défini aussi dans le ServerManager.prop, 
par exemple pour un fichier d'un plugin, le répertoire principal parent est "plugins".
"plugins" doit donc être un répertoire défini dans la propriété root#folders du ServerManager.

##### Important:
- Le clientManager ne synchronise que des fichiers, ne pas mettre de répertoires.
- Les chemins des fichiers doivent être en relatif à partir du répertoire principal de Sarah et au format Unix (un slash ('/') en début de chemin).
- Les noms sont case-sensitives donc faites attention aux majuscules, minuscules.
- Les fichiers sont séparés par des points-virgules (';').

Exemple pour 2 fichiers 'SARAH/plugins/scenariz/lib/db/ScenariznoCron.db' et 'SARAH/plugins/tvSchedule/lib/db/tvSchedule.db' :
```text
"root" : {
		"watch"  : "plugins/scenariz/lib/db/ScenariznoCron.db;plugins/scenariz/lib/db/Scenariz.db",	
		....
```

#### root#deleteIgnored (v:String)
Fichiers ignorés par la synchronisation lors de leurs suppressions. 
Utile par exemple pour des fichiers qui peuvent poser quelques problèmes de synchronisation lors de leurs modifications,
comme par exemple les fichiers de base nedb qui sont supprimés avant d'être modifiés ou
certains fichiers qui ne necessitent pas de synchronisation lors de leurs suppressions. 

##### Important:
- Le clientManager ne synchronise que des fichiers, ne pas mettre de répertoires.
- Les chemins des fichiers doivent être en relatif à partir du répertoire principal de SARAH et au format Unix (un slash ('/') en début de chemin).
- Les noms sont case-sensitives donc faites attention aux majuscules, minuscules.
- Les fichiers sont séparés par des points-virgules (';').


Exemple pour 2 fichiers 'SARAH/plugins/scenariz/lib/db/ScenariznoCron.db' et 'SARAH/plugins/tvSchedule/lib/db/tvSchedule.db' :
```text
"root" : {
		....
		"deleteIgnored"  : "plugins/scenariz/lib/db/ScenariznoCron.db;plugins/scenariz/lib/db/Scenariz.db",	
		....
```

#### root#folders (v:String)
Répertoires à scanner lors de l'initialisation du plugin. 
Si un fichier inclut dans ces répertoires n'est pas identique à celui du repertoire synchronisé du ServerManager, il est mis à jour automatiquement.

##### Important:
- Les répertoires doivent être en relatif à partir du répertoire principal de SARAH.
- Les noms sont case-sensitives donc faites attention aux majuscules, minuscules.
- Normalement, les répertoires définis ici sont identiques aux répertoires définis dans la propriétés root#folders du fichier ServerManager.prop (mais en relatif).
 
Exemple pour 2 répertoires 'SARAH/plugins' et 'SARAH/macros'(SARAH V3) :
```text
"root" : {
		....
		"folders"  : "plugins;macros"
		....
```
 
#### interval#watch (v:Integer)
Interval de temps en ms avant d'envoyer l'action si un fichier synchronisé est modifié ou supprimé. 
Ne modifiez pas cette valeur.

#### interval#stream (v:Integer)
Interval de temps en ms avant de réactiver la synchronisation d'un fichier après sa copie si il a été modifié ou supprimé.
Ne modifiez pas cette valeur.

#### restart#server (v:String)
Fichiers et types de fichiers qui necessitent un redémarrage du serveur SARAH.

Des caractères de remplacements peuvent être définis dans les chemins ou les noms de fichiers.

##### Important:
- Les répertoires doivent être en relatif à partir du répertoire principal de SARAH.
- Les noms sont case-sensitives donc faites attention aux majuscules, minuscules.
 
Exemple pour que tous les fichiers js de tous les plugins fassent redémarrer le serveur si ils sont modifiés:
```text
"restart" : {
	"server": "plugins/*/*.js",
	....
```

Exemple pour que tous les fichiers js des sous-répertoires 'lib' fassent redémarrer le serveur si ils sont modifiés:
```text
"restart" : {
	"server": "plugins/*/lib/*/*.js",
	....
```


#### restart#client (v:String)
Fichiers et types de fichiers qui necessitent un redémarrage du client SARAH.

Des caractères de remplacements peuvent être définis dans les chemins ou les noms de fichiers.
Fonctionne aussi en précisant des noms de répertoires ou de fichiers complets.

##### Important:
- Les répertoires doivent être en relatifs à partir du répertoire principal de SARAH.
- Les noms sont case-sensitives donc faites attention aux majuscules, minuscules.
 
Exemple pour que tous les fichiers .prop de tous les plugins fassent redémarrer le client si ils sont modifiés:
```text
"restart" : {
	"client": "plugins/*/*.prop",
	....
```

#### restart#stopGracefully (v:Boolean)
Ferme le client micro SARAH par l'icône de tâche du menu démarrer lors d'un redémarrage.

#### restart#timeBeforeKill (v:Integer)
Délais en ms pour tuer le process si le client micro SARAH ne s'est pas fermé correctement lors d'un redémarrage. 

#### restart#useKinect (v:Boolean)
Si une Kinect est utilisée (SARAH V3 uniquement).
```text
"restart" : {
	....
	"useKinect": true,
	ou
	"useKinect": false,
	....
```

#### restart#useKinectAudio (v:Boolean)
Si l'audio Kinect est utilisé (SARAH V3 uniquement).
```text
"restart" : {
	....
	"useKinectAudio": true,
	ou
	"useKinectAudio": false,
	....
```

#### restart#waitForClient (v:Integer)
Délais d'attente en ms pour démarrer le serveur SARAH après le démarrage du client micro.

#### restart#minimizeClient (v:Boolean)
Pour minimiser le client lors d'un redémarrage (non utilisé).

#### restart#hideClient (v:Boolean)
Pour cacher l'icône de tâche du client dans le menu démarrer lors d'un redémarrage.

#### restart#minimizeServer (v:Boolean)
Pour minimiser la fenêtre du serveur lors d'un redémarrage.

#### restart#hideServer (v:Boolean)
Pour cacher la fenêtre du serveur lors d'un redémarrage.


#### notification#sendNotif (v:Boolean)
Défini si une notification est envoyée si le ServerManager se déconnecte.


#### notification#sendType (v:String)
Type de notification lors d'une déconnexion du ServerManager.

Par défaut, 2 types sont possibles:
- pushover
- free

Le type défini dans cette propriété est le nom du fichier js associé dans le répertoire #clientManager#/manager qui envoie la notification. Par exemple, 'pushover' est le nom du fichier js 'pushover.js' dans le répertoire.

2 paramêtres  d'identification associés sont définis par défaut:
- "pushoverUser" et "pushoverToken" pour pushover.
- "SMSuser" et "SMStoken" pour free SMS.

Pour créer un autre type d'envoi:
- Copiez 1 des 2 fichiers js du répertoire #clientManager#/manager avec le nom que vous voulez et modifiez-le pour votre type d'envoi (attention aux noms de fonctions).
- Utilisez les paramètres d'identification par défaut où ajoutez les votres dans le #clientManager#/clientManager.prop.
- Changez la valeur de la propriété 'sendType' par le nom de votre fichier js.
- Aucune autre modification n'est requise, le fichier js est automatiquement chargé par la valeur de la propriété 'sendType'. 
	
	
#### intercom#sox (v:String)	
Chemin d'accès à l'application sox pour le mode inter-com.

Installez l'application [sox](http://sourceforge.net/projects/sox/files/sox/14.4.2),
disponible aussi dans le répertoire #clientManager#/install.

Exemple pour un répertoire d'installation C:\\Apps\\sox-14-4-2 : 
```text
	"intercom" : {
		"sox" : "C:\\Apps\\sox-14-4-2",
		.....
```

#### intercom#params (v:String)
Paramètres d'exécution de l'application Sox.

Référez-vous à la documentation de Sox pour le détail.

Les paramètres de silence peuvent changer avec le micro utilisé.

Par exemple, ce qui convient bien pour un micro normal:
```text
	sox -q -r 16000 -b 16 -t waveaudio 0 -t wav <FileName> silence 1 0.5 3% 1 2.0 3%
```
- silence 1 0.5 3% 1 2.0 3% où:
	- 0.5 3% correspond à 1 seconde de silence pour signifier un début d'enregistrement avec 3% de bruit sonore.
	- 2.0 3% correspond à 2 secondes de silence après un message pour intérrompre l'enregistrement avec 3% de bruit sonore.
	
Autre exemple qui convient pour d'autres micros ou une Kinect (chez moi... à voir):
```text
	sox -q -r 16000 -b 16 -t waveaudio 0 -t wav <FileName> silence 1 0.1 0.8% 1 1.0 0.8%
```

##### Important:
- Ces valeurs de paramètres 'silence' ont été faites dans mon environement et ne reflètent pas forcément ce qui fonctionne le mieux chez vous. Faites des tests et si l'enregistrement ne s'intérrompt pas automatiquement après un silence, changez les valeurs.
- Ne modifiez que ce qui il y après 'silence'.

#### intercom#timeRecord (v:Integer)
Délais maximal d'enregistrement du message vocale, après ce délais, l'action est intérrompu et le message n'est pas envoyé.


## Gestion de la version des fichiers

Par défaut, un fichier placé directement dans son répertoire est synchronisé avec tous les clients.

Pour synchroniser des fichiers différents pour chaque client, créez un répertoire 'clients' dans le répertoire des fichiers puis créez des répertoires dessous du nom des clients en y plaçant leurs versions de fichiers.
##### Attention:
Lorsqu'un répertoire 'clients' est créé, les fichiers du même nom placés dans le répertoires d'origine sont ignorés. 

##### Par exemple:
Dans le répertoire synchronisé 'plugins' (voir la propriété [root#folders](#rootfolders-vstring))

Supposons qu'on veuille un fichier plugins/monplugin/monplugin.prop pour le client Salon et un autre différent pour le client Chambre:
```text
plugins
	monplugin
		fichier1.xxx
		fichier2.xxx
		....
		clients
			Salon
				monplugin.prop
			Chambre
				monplugin.prop
```

##### Autre exemple:
Supposons qu'on veuille un répertoire plugins/monplugin/sousrepertoire avec des contenus différents pour le client Salon et le client Chambre:
```text
plugins
	monplugin
		fichier1.xxx
		fichier2.xxx
		....
		clients
			Salon
				sousrepertoire
					monfichier1
					monfichier2
					...
			Chambre
				sousrepertoire
					monautrefichier1
					...
```

##### Autre exemple:
Supposons qu'on veuille un répertoire plugins/monplugin uniquement que pour le client Salon (Aucun autre fichier dans le répertoire d'origine du plugin sinon ils seront copiés dans les autres clients):
```text
plugins
	monplugin
		clients
			Salon
				monfichier1
				monfichier2
				...
```

##### Pour information:
Il est préférable de créer une arborescence de répertoires et fichiers avant de connecter les clients au ServerManager afin d'éviter une synchronisation sur un trop grand nombre d'évenements systèmes simultanément sur ces fichiers (création, modification, renommage, suppression, etc...) ou de réaliser cette arborescence en dehors des répertoires synchronisés puis de la copier ensuite.


## Règles client
Quelques règles sont définies pour gérer la connexion avec le ServerManager

#### SARAH ferme la connexion avec le serveur
Coupe la connexion avec le ServerManager pour le client.

#### SARAH connecte-toi au serveur
Etabli une connexion avec le ServerManager pour le client.

Normalement cette connexion est automatique si le client est démarré après le ServerManager mais il peut arriver dans certains cas d'avoir à gérer cette connexion.

Faites donc attention à l'ordre de chargement du ServerManager (1) et des clients SARAH (2).

#### SARAH tu es connectée au serveur ?
Retourne l'état de connexion avec le ServerManager.

#### SARAH Ferme la connexion...
Ferme la connexion des clients définis pendant la commande. A savoir:
- commande sans client: ferme la connexion avec le ServerManager pour tous les clients.
- commande avec un client: le message est envoyé pour ce client uniquement, exemple:
	- SARAH Ferme la connexion de la chambre

#### SARAH redémarre...
Redémarre le server et le client SARAH des clients définis pendant la commande. A savoir:
- commande sans client: redémarre tous les clients.
- commande avec un client: redémarre ce client uniquement, exemple:
	- SARAH redémarre la chambre.


#### SARAH intercom (ou "SARAH mode communication")
Déclenche le mode inter-com avec un autre client.

Vous disposez du délais de la propriété "intercom#timeRecord" pour enregistrer un message afin d'éviter et annuler les faux positifs. 
Après un silence, l'enregistrement est automatiqument coupé et le message est envoyé.

##### Important:
Habituez-vous à réduire au maximum le volume du fond sonore lors d'un mode inter-com sinon l'enregistrement ne sera pas arrêté.

Ce message est ensuite envoyé aux clients définis pendant la commande. A savoir:
- commande sans client: Tous les clients recoivent le message.
- commande avec un client: le message est envoyé pour ce client uniquement, exemple:
	- SARAH intercom avec la chambre

Retrouvez et modifiez à votre convenance les commandes dans le fichier clientManager.xml du plugin.


## Développement
Les développements sont à réaliser dans le répertoire plugins du ServerManager.

Le développement d'un plugin est identique au développement d'un plugin pour SARAH. Ils sont automatiquement chargés lors de l'initialisation de ServerManager et rechargés lors d'une modification.

### Fonctions
2 fonctions principales sont à définir:
- exports.init
	- Exécutée à l'initialisation du plugin 
- exports.action
	- Recoit les actions à exécuter.

#### exports.init
```javascript
exports.init = function(app, logger){
	// exécuté à l'initialisation du plugin
}
```

- app:  Objet global de l'application ServerManager
- logger: Objet de gestion des logs. Les messages sont enregistrés dans le fichier logs/log du jour de ServerManager.

Déclaré à l'initialisation du module [winston](https://github.com/winstonjs/winston).

3 niveaux de log sont possibles:
- logger.info : Pour afficher un message d'information
- logger.error : Pour afficher un message d'erreur
- logger.warn : Pour afficher un message de warning


#### exports.action
```javascript
exports.action = function (data, logger, app) {
	
	// exécute les actions HTTP
	
}	
```
- data: objet HTTP pour l'action
- app:  Objet global de l'application ServerManager
- logger: Objet de gestion des logs. Les messages sont enregistrés dans le fichier logs/log du jour de ServerManager.


### Règle exécutée sur le ServerManager
Pour lancer une règle sur un client et l'exécuter sur le ServerManager:
- Créer une règle dans le fichier clientManager.xml des clients (ou d'un seul) sous la forme suivante:
```xml	
	<item>REGLE<tag>out.action.command="doAction";out.action.jsaction="NOM_DU_PLUGIN_SERVERMANAGER";....;....;.....</tag></item>
```	
où :
- out.action.command="doAction"	
	- Attribut d'exécution de la règle, doit toujours être présent.
- out.action.jsaction="NOM_DU_PLUGIN_SERVERMANAGER"
	- Le nom du fichier js dans le répertoire plugin de ServerManager.

Tous les autres tags ajoutés dans une règle sont directement liés à la commande développée dans un plugin de ServerManager.

Voir l'exemple N°3 [action.js](#exemples) plus bas.

### Trigger

Pour arrêter l'écoute de fichier(s) le temps d'une commande sur ce fichier:
```javascript
	SARAH.trigger('clientManager',{key:'unwatch', files: [file1, file2]});
```

Pour remettre l'écoute sur un fichier(s) après un trigger 'unwatch':
```javascript
  client.SARAH.trigger('clientManager',{key:'watch', files: [file1,file2], done : callback});
```

- files: un tableau de fichier(s)
- done: une fonction qui sera exécutée après la re-synchronisation du/des fichier(s), par exemple, une sauvegarde du fichier pour l'envoyer sur le ServerManager

##### exemple:
```javascript
SARAH.trigger('clientManager',{key:'unwatch', files: [__dirname + '/lib/db/tvSchedule.db']});

SARAH.trigger('clientManager',{key:'watch', files: [__dirname + '/tvSchedule.db'], done : (callback) ? callback : null });
```

### API
```javascript
var clients = app.Socket.getClients();
```
Retourne un tableau des clients connectés au multi-room où pour chaque objet 'client':
- id: Le nom du client
- server_ip: L'adresse IP du server SARAH du client
- server_port: Le port HTTP du server SARAH du client
- client_ip: L'adresse IP du client SARAH du client
- loopback: Le port HTTP du client SARAH du client
- Obj: L'objet socket ouvert pour la communication entre le client et le ServerManager

```javascript
var config = app.Config.getConfig();
```
Retourne un tableau des [propriétés](#serveur-1) de ServerManager.


### Exemples
3 exemples de plugins sont dans le répertoire plugins de ServerManager:
- speakTo.js : 
	- Exemple de HTTP GET provenant d'une source (box domotique) pour envoyer un tts vers le(s) client(s) SARAH de votre choix.
- tvSchedule.js: 
	- Exemple de HTTP GET provenant d'une source (box domotique) sur l'état d'un capteur de présence pour modifier un fichier synchronisé.
	- Prenons un exemple simple et supposons que vous désirez que SARAH vous prévienne si l'heure d'un programme TV qui vous interesse est arrivé. Le problème est qu'il faut savoir où envoyer le message de SARAH sinon tous les clients vont se mettre à vous prévenir dans toutes les pièces... Ce qui est plutôt embêtant dans un mode multi-room qui se respecte. Il faut donc des capteurs de présences qui va envoyer (via une box domotique) la pièce où il y a du monde. Il suffira ensuite d'écrire cette valeur dans un fichier qui se trouve dans un répertoire synchronisé pour qu'il soit envoyé automatiquement vers tous les clients. Ne reste plus qu'au plugin SARAH concerné de lire ce fichier et executer ou ignorer l'action dans chaque client.
- action.js:
	- Exemple illustrant la possibilité d'avoir une règle lancée sur un client et exécutée sur le ServerManager.
	- Prenons par exemple une nouvelle règle qui doit fermer la connexion avec le ServerManager pour tous les clients simultanément.
	- La règle [SARAH ferme la connexion avec le serveur](#sarah-ferme-la-connexion-avec-le-serveur) existe dans le clientManager.xml et est associée au client qui exécute la commande. Cette commande peut être envoyée à tous les clients par le ServerManager, il suffit de créer une nouvelle règle "SARAH ferme la connexion..."(#sarah-ferme-la-connexion) dans le clientManager.xml.
	
	- Détail de la règle (que vous pouvez retrouver dans le clientManager.xml):
		- out.action.command="doAction" et out.action.jsaction 
			- Obligatoire, voir [Règle exécutée sur le ServerManager](#règle-exécutée-sur-le-servermanager)
		
		Les tags suivants sont liés au développement de l'action dans le plugin:
		- out.action.plugin="clientManager" 
			- Attribut nom du plugin SARAH à exécuter.
		- out.action.remoteCmd="unicode"
			- Attribut commande à exécuter dans le plugin 'actions'
		- out.action.room="all" ou out.action.room="Salon" 
			- Attribut des clients qui exécutent la commande ('all' ou un client spécifique)
		- out.action.options="command=closeSocket~_attributes.tts=D'accord."
			- Attributs de la commande à exécuter dans le plugin 'clientManager' où chaque paire d'attribut(attribut=valeur) est séparé par un tilde (~).
			- _attributes. pour les attributs exécutés par le client SARAH (exemple, un _attributes.tts).
			
	- Cet exemple est fonctionnel (vous pouvez l'utiliser) et générique, elle peut très bien être utilisée pour d'autres règles de votre multi-room.
	

### HTTP format
HTTP GET pour ServerManager.

Page http:
- http://IP adress ServerManager:Port/SM/plugin_name

Format:
- http://IP adress ServerManager:Port/SM/plugin?param1=valeur&param2=valeur

Exemple avec un plugin tvSchedule:
- http://192.168.1.67:3000/SM/tvSchedule?command=setConfig&room=Salon


Versions
--------
1.0 (08-05-2016)
- Première version
