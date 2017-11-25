*Voor vragen kun je contact met mij opnemen op jsterken@quintor.nl*
*[Voorbeeld van hoe het eindresultaat eruit moet zien](https://github.com/johnsterken/kubernetes-class/tree/complete-version)*

# Voordat je begint
Er zijn een aantal applicaties die geïnstalleerd moeten zijn voordat je kunt beginnen met het uitrollen van het Kubernetes cluster
* [Docker](https://store.docker.com/search?type=edition&offering=community)
* [Minikube](https://kubernetes.io/docs/tasks/tools/install-minikube/)
* [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/#before-you-begin)
* [NodeJS 6.9.0 & NPM 3 of hoger](https://nodejs.org/en/download/)
* [Angular CLI](https://github.com/angular/angular-cli#prerequisites)

# Minikube opzetten
Je kunt Minikube opstarten door het commando `minikube start` uit te voeren. Minikube gaat een image van zijn VM downloaden en de VM opstarten. De output zou vergelijkbaar moeten zijn met onderstaande code block.

```
➜  ~ minikube start
Starting local Kubernetes v1.8.0 cluster...
Starting VM...
Downloading Minikube ISO
 140.01 MB / 140.01 MB [============================================] 100.00% 0s
Getting VM IP address...
Moving files into cluster...
Downloading localkube binary
 148.56 MB / 148.56 MB [============================================] 100.00% 0s
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
```



Nadat de VM is opgestart. Je hebt voor het configureren van de omgeving nog een addon nodig voor minikube, hiervoor voer je het commando `minikube addons enable ingress`. Daarna kun je met het commando `minikube ip` het IP-adres van het Kubernetes cluster opvragen. Dit heb je nodig bij het opzetten van de Angular applicatie.

# Lokaal testen applicaties
Je kunt de applicaties eerst proberen lokaal te draaien voordat je de applicaties in het cluster gaat draaien. Dit kun je doen door de volgende commando's uit te voeren in twee aparte terminal-vensters

In het eerste venster
```
cd api/
npm install
node main.js
```

In het tweede venster
```
cd frontend/
npm install
ng serve
```

Als je nu in je browser naar http://localhost:4200/ gaat, zou je *Connection with API succeeded!* moeten zien.

# Opzetten Angular applicatie
In het bestand *frontend/src/environments/environment.prod.ts* vind je een placeholder *MINIKUBE_IP*. Vervang dit met het IP-adres dat je hebt gekregen met het `minikube ip` commando. 

Ga in de map *frontend* en bouw vervolgens de Angular applicatie met `ng build -prod`. Als het bouwen van de applicatie is gelukt heb je een *dist* map gekregen met daarin de geoptimaliseerde versie van de Angular applicatie. Deze applicatie is nu klaar om in een Docker image geplaatst te worden.

# Docker images bouwen
Voordat je de docker images gaat bouwen, moet je eerst je docker in de context van minikube laten werken. Dit kun je doen door het commando `eval $(minikube docker-env)` uit te voeren. Hierdoor kan minikube de Docker images die je bouwt vinden in de locale repository.

Nu kun je de Docker images bouwen door de volgende commando's uit te voeren vanuit de root map van het project:
```
docker build -t kubernetes-class-frontend:1.0 frontend
docker build -t kubernetes-class-api:1.0 api
```
Als je zelf geen docker op je laptop hebt staan, kun je ook dit binnen de minikube VM draaien door `minikube ssh` uit te voeren.

De output van de commando's zou vergelijkbaar moeten zijn met het volgende code block:
```
➜  kubernetes-class git:(master) ✗ docker build -t kubernetes-class-frontend:1.0 frontend
Sending build context to Docker daemon  522.2kB
Step 1/2 : FROM nginx@sha256:dc5f67a48da730d67bf4bfb8824ea8a51be26711de090d6d5a1ffff2723168a3
sha256:dc5f67a48da730d67bf4bfb8824ea8a51be26711de090d6d5a1ffff2723168a3: Pulling from library/nginx
b1f00a6a160c: Pull complete
ec6f7dec8de2: Pull complete
a803070bff46: Pull complete
3871f3a05be4: Pull complete
Digest: sha256:dc5f67a48da730d67bf4bfb8824ea8a51be26711de090d6d5a1ffff2723168a3
Status: Downloaded newer image for nginx@sha256:dc5f67a48da730d67bf4bfb8824ea8a51be26711de090d6d5a1ffff2723168a3
 ---> 5c6da346e3d6
Step 2/2 : COPY dist /usr/share/nginx/html
 ---> 4dbd2f8df6c6
Removing intermediate container ad66876c4601
Successfully built 4dbd2f8df6c6
Successfully tagged kubernetes-class-frontend:1.0
Tagging nginx@sha256:dc5f67a48da730d67bf4bfb8824ea8a51be26711de090d6d5a1ffff2723168a3 as nginx:1-alpine
➜  kubernetes-class git:(master) ✗ docker build -t kubernetes-class-api:1.0 api
Sending build context to Docker daemon  27.14kB
Step 1/8 : FROM node@sha256:b5f561c53495f4dd66144645d36089ab50a30accae51ecf8b7920178a517ae48
sha256:b5f561c53495f4dd66144645d36089ab50a30accae51ecf8b7920178a517ae48: Pulling from library/node
b56ae66c2937: Pull complete
327e64e394fc: Pull complete
a52c21ec8ada: Pull complete
Digest: sha256:b5f561c53495f4dd66144645d36089ab50a30accae51ecf8b7920178a517ae48
Status: Downloaded newer image for node@sha256:b5f561c53495f4dd66144645d36089ab50a30accae51ecf8b7920178a517ae48
 ---> a69d60cce896
Step 2/8 : EXPOSE 1337
 ---> Running in e9d9fb82bd1b
 ---> 9847cf652000
Removing intermediate container e9d9fb82bd1b
Step 3/8 : WORKDIR /app
 ---> 34d7afaaa929
Removing intermediate container 707b0a35f5e3
Step 4/8 : COPY main.js ./
 ---> 4eebc319796e
Removing intermediate container 5ed0a0eb38aa
Step 5/8 : COPY package.json ./
 ---> efb4086961dc
Removing intermediate container 43c3a963ded2
Step 6/8 : COPY package-lock.json ./
 ---> 5702affd8aa9
Removing intermediate container 36e496fb099b
Step 7/8 : RUN npm install
 ---> Running in ee2ef3a2e4f2
added 48 packages in 1.498s
 ---> ea7c92696806
Removing intermediate container ee2ef3a2e4f2
Step 8/8 : CMD node main.js
 ---> Running in 89f493479b5b
 ---> 45f4e3236645
Removing intermediate container 89f493479b5b
Successfully built 45f4e3236645
Successfully tagged kubernetes-class-api:1.0
Tagging node@sha256:b5f561c53495f4dd66144645d36089ab50a30accae51ecf8b7920178a517ae48 as node:9-alpine
```
Nu ben je klaar om het Kubernetes cluster op te zetten.

# Opzetten Kubernetes cluster
Het opzetten van het Kubernetes cluster gaat in meerdere fasen: Het opzetten van de applicatie (deployment), Het intern beschikbaar maken van de applicatie (service) en het openstellen van de applicatie naar buiten (ingress).

## Deployment
In Kubernetes is een deployment een beschrijving van hoe je applicatie (pod) neergezet moet worden neergezet. Deze beschrijving wordt geschreven in YAML. Een voorbeeld van hoe de structuur van een deployment eruit ziet kun je zien in de [API documentatie](http://v1-8.docs.kubernetes.io/docs/api-reference/v1.6/#deployment-v1beta1-apps).

Allereerst maak je een bestand aan in beide projecten genaamd *deployment.yaml*. Daarin schrijf je een specificatie van het deployment, zoals weergegeven in onderstaand code block.
```YAML
apiVersion: apps/v1beta1 # Versie van de Kubernetes API die wordt gebruikt
kind: Deployment # Het soort resource in Kubernetes dat wordt aangemaakt
metadata:
  labels:
    foo: bar # Voorbeeld van een label die je kunt geven aan de deployment
  name: foobar-app # De naam die de deployment zal hebben in het cluster
spec:
  revisionHistoryLimit: 1 # Hoeveel vorige versies bijgehouden moet worden om rollback te kunnen doen
  replicas: 2 # Hoeveel pods tegelijkertijd gedraaid moeten worden van deze applicatie
  selector: # Dit geeft aan op welke pods deze deployment betrekking heeft (pods met dit label)
    matchLabels:
      foo: bar 
  strategy: # Welke deployment strategie wordt toegepast
    rollingUpdate: # Parameters voor de rollingUpdate strategie
      maxSurge: 1 # Hoeveel pods meer dan het aantal replica's tegelijkertijd gedraaid mogen worden
      maxUnavailable: 1 # Hoeveel pods tegelijkertijd offline mogen zijn
    type: RollingUpdate/Recreate # Het type deployment strategie
  template:
    metadata:
      labels:
        foo: bar
    spec: # Specificatie voor de pod die wordt gemaakt
      containers: # Een array van containers in de pod
      - image: repository/docker-image:version # De image die wordt gebruikt
        imagePullPolicy: Always/IfNotPresent/Never # Wanneer de image binnengehaald moet worden
        name: docker-app # De naam van de container
        livenessProbe: # Een check om te kijken of een pod nog beschikbaar is. Als deze faalt wordt de pod opnieuw opgestart
          httpGet:
            path: /
            port: 80
```

## Service
Een service wordt in Kubernetes doorgaans gebruikt om een bepaalde pod beschikbaar te maken binnen het cluster, zodat een service, zoals een API, aangeroepen kan worden door andere pods binnen het cluster. Een voorbeeld van hoe een service eruit ziet kun je vinden in de [API documentatie](http://v1-8.docs.kubernetes.io/docs/api-reference/v1.6/#service-v1-core).

Vergelijkbaar met het deployment bestand, maak je eerst een *service.yaml* bestand in beide projecten. Veel van de velden zijn hetzelfde als de deployment. De verschillen beginnen bij het spec veld, hier wordt een specificatie gemaakt van hoe de service zich gedraagt. De API, die intern op de poort 1337 draait, moet op poort 80 op het cluster beschikbaar worden gemaakt. 
```YAML
apiVersion: v1 # Deze versie is anders dan de deployment
kind: Service 
metadata:
  labels:
    foo: bar
  name: foobar-app # De naam die de service zal hebben in het cluster
spec:
  ports: # Een array van poorten die opengezet worden door de service
  - name: http
    port: 80 # Poort zoals deze wordt opengezet naar buiten
    protocol: TCP
    targetPort: 80 # De interne poort van de container
  selector:
    foo: bar # Een labelselector om de service te matchen aan een pod
  sessionAffinity: None/ClientIP # Geeft aan of clients naar dezelfde pod doorgestuurd moeten worden als eerder, bijvoorbeeld als er een sessie openstaat op die pod
  type: ExternalName/ClusterIP/NodePort/LoadBalancer # Geeft aan welk type service dit moet zijn, ClusterIP is de standaard
```

## Ingress
In tegenstelling tot de deployment en service, hoef je een ingress slechts één keer te maken. Het begin is vergelijkbaar met de deployment en service, met de uitzondering dat je een ingress class annotatie meegeeft in de metadata. Vervolgens maak je een specificatie voor de ingress. Je kunt een ingress op meerdere criteria matchen naar een service, bijvoorbeeld op hostname of op request-pad. In dit geval gaan we alleen matchen op basis van pad. Bedenk hierbij welke zaken je moet openzetten naar het internet om de applicatie correct te laten werken. Welke interne services moeten op welke paden worden opengezet?
```YAML
apiVersion: extensions/v1beta1 # API versie voor ingress
kind: Ingress 
metadata:
  annotations:
    kubernetes.io/ingress.class: nginx # Dit zorgt ervoor dat een nginx proxy wordt opgezet om als ingress te dienen
  name: ingress-name # De naam van de ingress
spec:
  rules: # Regels van de ingress
  - http:
      paths: # Een array van paden om door te linken naar interne services
      - backend: # Een backend server specificatie
          serviceName: foobar-app # Naam van de interne service om naar door te linken
          servicePort: 80 # Welke poort van de service aangeroepen moet worden
        path: / # Een matcher om aan te geven dat dit pad aan bovenstaande backend service moet worden gekoppeld
```

# Uitrollen applicaties
Als je yaml bestanden klaar zijn kun je deze uitrollen op het cluster door onderstaande commando's uit te voeren vanuit de root folder van het project. 
```
kubectl apply -f api/deployment.yaml
kubectl apply -f api/service.yaml

kubectl apply -f frontend/deployment.yaml
kubectl apply -f frontend/service.yaml

kubectl apply -f ingress.yaml
```

Mocht het niet lukken om het succesvol te draaien, vergelijk jouw versie dan met mijn versie op Github.
* [API deployment](https://github.com/johnsterken/kubernetes-class/blob/complete-version/api/deployment.yaml)
* [API service](https://github.com/johnsterken/kubernetes-class/blob/complete-version/api/service.yaml)
* [Frontend deployment](https://github.com/johnsterken/kubernetes-class/blob/complete-version/frontend/deployment.yaml) 
* [Frontend service](https://github.com/johnsterken/kubernetes-class/blob/complete-version/frontend/service.yaml) 
* [Ingress](https://github.com/johnsterken/kubernetes-class/blob/complete-version/ingress.yaml)
