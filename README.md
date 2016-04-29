Multi-room Server Manager
=========================

Pourquoi ?
----------
- Pour que chaque Sarah install�e (client et serveur) dans un multi-room soit vue comme un client unique d'un syst�me global.
- Pour que chaque client Sarah puisse communiquer et partager des informations avec les autres clients.
- Pour avoir un syst�me multi-room toujours op�rationnel (e.g. un client que ne fonctionne plus d� � un plantage system/harware d'un client).
- Pour supprimer les latences r�seaux d� au montage de r�pertoires (e.g. plugins).
		
Comment ?
---------
L'application est en 2 parties:
- Une premi�re partie "ServerManager", application nodejs ind�pendante, qui g�re le multiroom et les clients Sarah qui se connectent.
- Une seconde partie "clientManager", plugin dans chaque client Sarah, qui envoie/recoit des informations du/vers le Server Manager.
	
- Communication synchrone entre le Server Manager et tous les client Manager.
- Gestion des fichiers:
	- Cr�ation/Modification/Suppression d'un fichier/r�pertoire:
		- Sur le server Manager sera automatiquement envoy� sur tous les clients. Si un client est d�connect�, la modification sera envoy� lors de sa prochaine connexion.
		- Sur un client sera automatiquement envoy� sur le Server Manager qui l'enverra � son tour sur tous les autres clients.
- Gestion des versions de fichiers:
	- Permet de g�rer pour chaque client une version diff�rente de fichier.
	- Chaque client peut avoir des plugins, des xml, des js, des fichiers de propri�t�s diff�rents.
- Gestion de requ�tes HTTP:
	- Le Server Manager recoit et centralise des requ�tes HTTP (e.g. provenant d'une box domotique) qui sont envoy�s automatiquement vers tous les clients ou un client d�di�.
- Gestion de l'application des modifications:
	- Si necessaire, red�marrage automatique du serveur et/ou du client de chaque client Sarah pour enregistrer des modifications de fichiers en fonction du type (js,xml,prop,etc...).
- Alerte de d�connexion:
	- Un message d'alerte est envoy� lorsqu'un client ou le Server Manager se d�connecte afin d'avertir des probl�mes syst�me/hardware.
- Mode inter-comm:
	- Permet d'envoyer un message vocale depuis un client vers un autre client ou tous les clients via le Server Manager.
- Evolutif:
	- R�pertoire plugins sur le Server Manager pour d�velopper ses propres actions pour le Server Manager, par exemple pour ajouter des requ�tes HTTP, g�rer et modifier des fichiers, etc...
		
Compatibilit�
-------------
- Le ServerManager peut �tre install� sur Windows ou Unix.
- Le clientManager est compatible Sarah V3 et Sarah V4.
	
Installation
------------

## Serveur
- Installez [nodejs](https://nodejs.org/en) sur la plateforme o� sera install� ServerManager.
- Cr�ez un r�pertoire parent pour ServerManager, par exemple c:/Apps/multiroom.	
	- Important: N'utilisez pas de caract�res d'espacements dans le nom du r�pertoire.
- T�l�chargez et d�zippez le fichier 'SARAH-ServerManager-master.zip' dans le r�pertoire cr��.
- Renommez le r�pertoire cr�� en 'ServerManager'.
- Ouvrez un gestionnaire de fichiers et d�placez-vous dans le r�pertoire ServerManager.
- Localisez et double-cliquez sur le fichier 'install_npm_modules.bat'
- Attendez quelques secondes pendant l'installation des modules npm n�cessaires � l'application.

##### Test d'installation
Localisez et double-cliquez sur le fichier 'ServerManager.bat'.
Le message 'info: Multiroom Server Manager ready [X.XXX secs] doit appara�tre sans erreurs � la fin de l'initialisation.

Quelques param�tres sont � personnaliser pour finaliser l'installation.


##  Client
- R�cup�rez le <ServerManager>/client_install/clientManager.zip et copiez-le dans le r�pertoire <Sarah>/plugins du client Sarah de votre multi-room.
- D�zippez le fichier.
- Supprimez le fichier <Sarah>/plugins/clientManager.zip apr�s l'extraction.
- Ouvrez un gestionnaire de fichiers et d�placez-vous dans le r�pertoire <Sarah>/plugins/clientManager.	
- Localisez et double-cliquez sur le fichier 'install_npm_modules.bat'
- Attendez quelques secondes pendant l'installation des modules npm n�cessaires � l'application.

Quelques param�tres sont � personnaliser pour finaliser l'installation.	
	
Propri�t�s
----------

## Serveur
	

## Client




