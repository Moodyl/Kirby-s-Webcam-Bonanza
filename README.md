# Documentazione - Kirby’s Webcam Bonanza
Il progetto consiste in un minigioco multigiocatore di agilità e precisione dove ogni giocatore dovrà maneggiare la propria marionetta e mangiare i propri pallini per guadagnare punti e vincere.

## Riferimenti progettuali
La marionetta è basata su Kirby, un personaggio della serie di videogiochi “Kirby“ prodotta da Nintendo.
Kirby nel suo canon ha il potere di aspirare e mangiare qualsiasi cosa, quindi ecco perché il minigioco è incentrato sul mangiare pallini.

## Design dell’interfaccia e modalità di interazione
L’interfaccia è ridotta a 3 elementi principali: il canvas al centro della pagina, il titolo del progetto e descrizione sopra il canvas ed il bottone Index nell’angolo in alto a sinistra.
Per controllare la propria marionetta è sufficente che la mano sia visibile nel campo della telecamera.
Per mangiare i pallini basta aprire il palmo della mano per aprire la bocca del proprio Kirby e passare con la bocca su un pallino. Il pallino verrà “mangiato“ conferendo al giocatore un punto.
Ad ogni pallino mangiato il proprio Kirby crescerà.
La sfida sta nell’essere più veloci ma anche più precisi dell’altro giocatore, la bocca è relativamente piccola e quindi il margine di errore nel mancare il pallino nella fretta è abbastanza elevato.
Il gioco finisce quando uno dei due giocatori raggiunge i 50 punti. Premendo spazio una volta finito il minigioco ti permette di riavviarlo.

## Tecnologia utilizzata
Il progetto si focalizza all’utilizzo della libreria MediaPipe per il tracciamento delle mani tramite la webcam del dispositivo.
Il programma utilizza primariamente due classi per produrre i pallini ed i giocatori, questo facilita la scalabilità del progetto per il numero di giocatori.
I pallini sono contenuti in un array di modo da restare memorizzati nella posizione data e, utilizzando push() e splice(), l’array viene modificato.
La classe Dot contiene il metodo collide() che permette il trigger dello splicing e l’aumento del punteggio del giocatore.

```
function test() {
  console.log("notice the blank line before this function?");
}
```

## Target e contesto d’uso
Essendo un prodotto a scopo ludico, il target è piuttosto ampio (ma specialmente adatto ad un pubblico giovane) ed il contesto d’uso può essere per spazi interattivi touchless.
