# Bankin challenge : web scrapping
Ce petit projet utilise le site mis à disposition de manière astucieuse. En effet, les instructions du challenge ne précisent pas comment on doit charger les résultats. J'ai donc utilisé le code client (le JS obfusqué) disponible sur la page pendant l'exécution du scraper pour générer les résultats.

Ce projet répond malgré tout à la problématique du challenge. Dans la vie réelle, si un site que l'on souhaite scrapper est très mal codé mais qu'on remarque qu'il consomme une API publique, je pense que consommer cette API serait un meilleur choix sur le long terme que de maintenir un scraper qui doit gérer les erreurs du site. Mieux vaut mettre à profit les avantages à notre disposition que de se focaliser sur les problèmes apparents.

Résultat : 
- Un codebase lisible et court (< 60 lignes)
- Un temps de scrapping de ~2,5 secondes pour les 4999 lignes (une fois la page chargée).

Instructions du challenge disponibles ici : https://blog.bankin.com/challenge-engineering-web-scrapping-dc5839543117

### Technology
Casperjs 1.1.4 and Phantomjs 2.1.7

### Requirements
Node >= 4.0.0 and npm >= 3.0.0 installed on the system.

#### How to use the app 
- install the dependancies : `npm install`
- start the app : `npm run start`
- debug mode for timers and STDOUT : `npm run debug`
- if more than 4999 transactions when testing, just change the `for` loop condition

### Results

Each time you launch the app, results are saved in the project directory under `/json/bankin-${timestamp}.json`. 
Average execution duration after page load is around 2,5s for the 4999 transactions.
Tested on MacOS 10.12.6 with Node.js 4.6.0 (heard that casper might work differently on Windows) 