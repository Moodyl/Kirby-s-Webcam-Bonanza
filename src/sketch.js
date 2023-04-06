//general variables
let capture, detector
const canvasSize = 1200

//hand variables
let mappedPalmX, mappedPalmY
let distI, distM, distR, distP

//player variables
let players = []
let playerLeft, playerRight


const inc = 2

//pallini variable
let pallini = []


async function setup() {

	createCanvas(canvasSize, canvasSize / 640 * 480)

	capture = createCapture(VIDEO)
	capture.hide()

	console.log("Carico modello...")
	detector = await createDetector()
	console.log("Modello caricato.")

	playerLeft = new Player(color(255, 123, 172), "Left")
	playerRight = new Player(color(0, 255, 172), "Right")

	players.push(playerLeft, playerRight);

}

async function draw() {

	background(255)

	tint(255, 30)
	scale(-1, 1); // flip the x-axis
	image(capture, -width, 0, width, width / 640 * 480);
	scale(-1, 1)

	if (detector && capture.loadedmetadata) {
		const hands = await detector.estimateHands(capture.elt, { flipHorizontal: true })

		for (let j = 0; j < hands.length; j++) {
			const hand = hands[j]
			const handedness = hand.handedness // Left : Right

			const pinky = hand.keypoints[20];
			const pinkyB = hand.keypoints[17];
			const ring = hand.keypoints[16];
			const ringB = hand.keypoints[13];
			const middle = hand.keypoints[12];
			const middleB = hand.keypoints[9];
			const index = hand.keypoints[8];
			const indexB = hand.keypoints[5];

			distI = dist(index.x, index.y, indexB.x, indexB.y)
			distM = dist(middle.x, middle.y, middleB.x, middleB.y)
			distR = dist(ring.x, ring.y, ringB.x, ringB.y)
			distP = dist(pinky.x, pinky.y, pinkyB.x, pinkyB.y)

			let palmX = (pinkyB.x + indexB.x) / 2;
			let palmY = (pinkyB.y + indexB.y) / 2;
			mappedPalmX = map(palmX, 0, capture.width, 0, canvasSize)
			mappedPalmY = map(palmY, 0, capture.height, 0, canvasSize / 640 * 480)

			if (hand.handedness === 'Left') {
				playerLeft.x = mappedPalmX;
				playerLeft.y = mappedPalmY;
				playerLeft.display()
			}
			
			if (hand.handedness === 'Right') {
				playerRight.x = mappedPalmX;
				playerRight.y = mappedPalmY;
				playerRight.display()
			}

			//console.log("PLeft X is " + playerLeft.x, "PLeft Y is " + playerLeft.y)
			//console.log("PRight X is " + playerRight.x, "PRight Y is " + playerRight.y)

		}
	}

	for (let i = 0; i < pallini.length; i++) {

		pallini[i].display(); // mostra tutti i pallini nell'array

		if (pallini[i].collide(playerLeft)) {
			console.log("Collided")
			//if(pallini[i].color === playerLeft.color){
				pallini.splice(i, 1);
				playerLeft.foodEaten += 1;
				console.log("Left score is " + playerLeft.foodEaten)
			//}
		}

		if (pallini[i].collide(playerRight)) {
			console.log("Collided")
			//if(pallini[i].color === playerRight.color){
				pallini.splice(i, 1);
				playerRight.foodEaten += 1;
				console.log("Right score is " + playerRight.foodEaten)
			//}
		}
	}
	
}

function keyPressed() {
	if (keyCode === 32) { // spazio per creare un nuovo pallino
		for (let i = 0; i < 40; i++) {
			let newPallino = new Pallino(); // crea una nuova istanza della classe Pallino
			pallini.push(newPallino); // aggiungi il nuovo pallino all'array
		}
	}
}

function windowResized() {
	resizeCanvas(canvasSize, canvasSize / 640 * 480)
	image(capture, -width, 0, width, width / 640 * 480)
}

class Pallino {
	constructor() {
		this.x = random(width);
		this.y = random(height);
		this.d = 20;
		this.stroke = 0;
		if (random(1) < 0.5) {
			this.color = color(255, 123, 172);
		} else {
			this.color = color(0, 255, 172);
		}
	}

	display() {
		fill(this.color)
		stroke(this.stroke)
		ellipse(this.x, this.y, this.d); // mostra il pallino

	}

	collide(player) {
		const distCentri = dist(this.x, this.y, player.x, player.y + 20);
		const sommaRaggi = this.d / 2 + (player.d - 70) / 2; // raggio della bocca
		if (distCentri < sommaRaggi){
			return true;
		} else {
			return false;
		}
	}
}

class Player {
	constructor(color, handedness = "") {
		this.x;
		this.y;
		this.d = 100;
		this.handedness = handedness;
		this.color = color;
		this.foodEaten = 0;
		this.trigger = false;
	}

	display() {

		noStroke()

		//face
		fill(this.color)
		ellipse(this.x, this.y, this.d + inc * this.foodEaten, this.d + inc * this.foodEaten)

		//eyes
		fill(0)
		ellipse(this.x - 15, this.y - 10, this.d - 85, this.d - 65)
		ellipse(this.x + 15, this.y - 10, this.d - 85, this.d - 65)

		//mouth
		if (distI && distM && distR && distP > 40) {
			this.setTrigger()

			fill(0)
			ellipse(this.x, this.y + 20, this.d - 70, this.d - 70)

			this.resetTrigger()
		}
	}

	// Method to set the trigger to true
	setTrigger() {
		this.trigger = true;
	}

	// Method to reset the trigger to false
	resetTrigger() {
		this.trigger = false;
	}

}

async function createDetector() {
	// Configurazione Media Pipe
	// https://google.github.io/mediapipe/solutions/hands
	const mediaPipeConfig = {
		runtime: "mediapipe",
		modelType: "full",
		maxHands: 2,
		solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands`,
	}
	return window.handPoseDetection.createDetector(window.handPoseDetection.SupportedModels.MediaPipeHands, mediaPipeConfig)
}
