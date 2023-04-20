//general variables
let capture, detector
const canvasSize = 1100
const ratio = canvasSize / 640 * 480

//hand variables
let mappedPalmX, mappedPalmY
let distI, distM, distR, distP

//player variables
let playerLeft, playerRight
const inc = 3

//dots variable
let dots = []

async function setup() {

	createCanvas(canvasSize, ratio)

	capture = createCapture(VIDEO)
	capture.hide()

	console.log("Carico modello...")
	detector = await createDetector()
	console.log("Modello caricato.")

	playerLeft = new Player(color(255, 123, 172), "Left", 0)
	playerRight = new Player(color(0, 255, 172), "Right", 0)

	for (let i = 0; i < 70; i++) {
		let dotsLeft = new Dot(color(255, 123, 172), "Left");
		dots.push(dotsLeft); 

		let dotsRight = new Dot(color(0, 255, 172), "Right");
		dots.push(dotsRight);
	}

}

async function draw() {

	background(255)

	tint(255, 20)
	scale(-1, 1); // flip the x-axis
	image(capture, -width, 0, width, ratio);
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
			mappedPalmY = map(palmY, 0, capture.height, 0, ratio)

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
		}
	}

	for (let i = 0; i < dots.length; i++) {

		dots[i].display(); // mostra tutti i dots nell'array

		if (dots[i].collide(playerLeft)) {

			dots.splice(i, 1);
			playerLeft.score += 1;
		}

		if (dots[i].collide(playerRight)) {
			dots.splice(i, 1);
			playerRight.score += 1;
		}
	}

	textSize(40)
	textAlign(CENTER)

	fill(255, 123, 172)
	rectMode(CENTER)
	noStroke()
	square(40, 40, 60, 5)
	fill(255)
	text(playerLeft.score, 40, 55)

	fill(255, 123, 172)
	rectMode(CENTER)
	noStroke()
	fill(0, 255, 172)
	square(width - 40, 40, 60, 5)
	fill(255)
	text(playerRight.score, width - 40, 55)

	if (playerLeft.score == 50 || playerRight.score == 50) {

		fill(0, 0, 0)
		textSize(70)
		text("Game over!", width / 2, height / 2 - 45)

		if (playerLeft.score == 50) {
			fill(255, 123, 172)
			text("Player 1 won", width / 2, height / 2 + 45)
			noLoop()

		} else {
			fill(0, 255, 172)
			text("Player 2 won", width / 2, height / 2 + 45)
			noLoop()
		}
	}

}

function windowResized() {
	resizeCanvas(canvasSize, ratio)
	image(capture, -width, 0, width, ratio)
}

class Dot {
	constructor(color, playerdot) {
		this.x = random(width);
		this.y = random(height);
		this.d = 15;
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
		if (distCenter < sumRadius && this.playerdot == player.handedness && distI && distM && distR && distP > 40) {
			return true;
		} else {
			return false;
		}
	}
}

class Player {
	constructor(color, handedness, score) {
		this.x;
		this.y;
		this.d = 100;
		this.handedness = handedness;
		this.color = color;
		this.score = score;
	}

	display() {

		noStroke()

		//face
		fill(this.color)
		ellipse(this.x, this.y, this.d + inc * this.score, this.d + inc * this.score)

		//eyes
		fill(0)
		ellipse(this.x - 15, this.y - 10, this.d - 85, this.d - 65)
		ellipse(this.x + 15, this.y - 10, this.d - 85, this.d - 65)

		//mouth
		if (distI && distM && distR && distP > 40) {
			fill(0)
			ellipse(this.x, this.y + 20, this.d - 70, this.d - 70)
		}
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
