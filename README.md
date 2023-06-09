SUPSI 2022-23  
Corso d’interaction design, CV427.01  
Docenti: A. Gysin, G. Profeta  

Elaborato 1: Marionetta digitale

# Kirby’s Webcam Bonanza
Autore: Lauro Gianella  
[Kirby’s Webcam Bonanza](https://moodyl.github.io/Kirby-s-Webcam-Bonanza/)

Il progetto consiste in un minigioco multigiocatore di agilità e precisione dove ogni giocatore dovrà maneggiare la propria marionetta e mangiare i propri pallini per guadagnare punti e vincere.

https://github.com/Moodyl/Kirby-s-Webcam-Bonanza/assets/101795037/e4082030-1534-49bf-9d6e-fb3ff41630df

## Riferimenti progettuali
La marionetta è basata su Kirby, un personaggio della serie di videogiochi “Kirby“ prodotta da Nintendo.
Kirby nel suo canon ha il potere di aspirare e mangiare qualsiasi cosa, quindi ecco perché il minigioco è incentrato sul mangiare pallini.
![image](https://github.com/Moodyl/Kirby-s-Webcam-Bonanza/assets/101795037/57642b77-39c1-4f2e-8c5e-42481b5dd4ec)


## Design dell’interfaccia e modalità di interazione
L’interfaccia è ridotta a 3 elementi principali: il canvas al centro della pagina, il titolo del progetto e descrizione sopra il canvas ed il bottone Index nell’angolo in alto a sinistra.
Per controllare la propria marionetta è sufficente che la mano sia visibile nel campo della telecamera.
Per mangiare i pallini basta aprire il palmo della mano per aprire la bocca del proprio Kirby e passare con la bocca su un pallino. Il pallino verrà “mangiato“ conferendo al giocatore un punto.
Ad ogni pallino mangiato il proprio Kirby crescerà.
La sfida sta nell’essere più veloci ma anche più precisi dell’altro giocatore, la bocca è relativamente piccola e quindi il margine di errore nel mancare il pallino nella fretta è abbastanza elevato.
Il gioco finisce quando uno dei due giocatori raggiunge i 50 punti. Premendo spazio una volta finito il minigioco ti permette di riavviarlo.

<img width="500" alt="Screen-1" src="https://github.com/Moodyl/Kirby-s-Webcam-Bonanza/assets/101795037/e280e9da-ee41-47dc-bb4b-9736de9ab639">
<img width="500" alt="Screen-2" src="https://github.com/Moodyl/Kirby-s-Webcam-Bonanza/assets/101795037/59bff371-fee5-4b99-9655-e3c7ec4745df">
<img width="500" alt="Screen-3" src="https://github.com/Moodyl/Kirby-s-Webcam-Bonanza/assets/101795037/b7780a30-0771-4fe7-8b49-75f1538422a5">


## Tecnologia utilizzata
Il progetto si focalizza all’utilizzo della libreria MediaPipe per il tracciamento delle mani tramite la webcam del dispositivo.
Il programma utilizza primariamente due classi per produrre i pallini ed i giocatori, questo facilita la scalabilità del progetto per il numero di giocatori.

```js
class Player {
	constructor(color, handedness) {
		this.x = mappedPalmX;
		this.y = mappedPalmY;
		this.d = 100;
		this.handedness = handedness;
		this.color = color;
		this.score = 0;
	}

	display() {

		noStroke()

		//face
		fill(this.color)
		ellipse(this.x, this.y, this.d + inc * this.score, this.d + inc * this.score)

		if(this.handedness == "Left"){
			fill(255, 30, 100)
		} else {
			fill(0, 200, 172)
		}
		ellipse(this.x - 30, this.y + 10, this.d - 75, this.d - 85)
		ellipse(this.x + 30, this.y + 10, this.d - 75, this.d - 85)
		

		//eyes
		fill(0)
		ellipse(this.x - 15, this.y - 10, this.d - 85, this.d - 65)
		fill(255)
		ellipse(this.x - 15, this.y - 17, this.d - 95, this.d - 87)

		fill(0)
		ellipse(this.x + 15, this.y - 10, this.d - 85, this.d - 65)
		fill(255)
		ellipse(this.x + 15, this.y - 17, this.d - 95, this.d - 87)

		//mouth
		if (distI > 40 && distM > 40 && distR > 40 && distP > 40) {
			fill(0)
			ellipse(this.x, this.y + 20, this.d - 70, this.d - 70)
		}
	}

}
```



I pallini sono contenuti in un array di modo da restare memorizzati nella posizione data e, utilizzando `push()` e `splice()`, l’array viene modificato.
La classe Dot contiene il metodo `collide()` che permette il trigger dello splicing e l’aumento del punteggio del giocatore.



```js
class Dot {
	constructor(color, playerdot) {
		this.d = 15;
		this.x = random(0 + this.d, width - this.d);
		this.y = random(0 + this.d, height - this.d);
		this.stroke = 0;
		this.color = color;
		this.playerdot = playerdot
	}

	display() {
		fill(this.color)
		stroke(this.stroke)
		ellipse(this.x, this.y, this.d); // mostra il Dot
	}

	collide(player) {
		const distCenter = dist(this.x, this.y, player.x, player.y + 20);
		const sumRadius = this.d / 2 + (player.d - 70) / 2; // raggio della bocca
		if ((distCenter < sumRadius) && (this.playerdot == player.handedness) && (distI > 40 && distM > 40 && distR > 40 && distP > 40)) {
			return true;
		} else {
			return false;
		}
	}
}
```



## Target e contesto d’uso
Essendo un prodotto a scopo ludico, il target è piuttosto ampio (ma specialmente adatto ad un pubblico giovane) ed il contesto d’uso può essere per spazi interattivi touchless.
