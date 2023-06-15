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

class Dot {
	constructor(color, playerdot) {
		this.d = 15;
		this.x = random(0 + this.d, width - this.d);
		this.y = random(0 + this.d, height - this.d);
		this.stroke = 0;
		this.color = color;
		this.playerdot = playerdot;
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

		if (this.handedness == "Left") {
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


async function setup() {

	createCanvas(canvasSize, ratio)

	capture = createCapture(VIDEO)
	capture.hide()

	console.log("Carico modello...")
	detector = await createDetector()
	console.log("Modello caricato.")

	playerLeft = new Player(color(255, 123, 172), "Left")
	playerRight = new Player(color(0, 255, 172), "Right")

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

			if (handedness === 'Left') {
				playerLeft.x = mappedPalmX;
				playerLeft.y = mappedPalmY;
				playerLeft.display()
			}

			if (handedness === 'Right') {
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

	scoreboardDisplay()

	if (playerLeft.score == 50 || playerRight.score == 50) {

		textSize(40)

		if (playerLeft.score == 50) {
			background(255, 123, 172)

			fill(0)
			text("Game over!", width / 2, height / 2 - 22)

			fill(255)
			text("Player 1 won", width / 2, height / 2 + 22)


		} else {
			background(0, 255, 172)

			fill(0)
			text("Game over!", width / 2, height / 2 - 22)

			fill(255)
			text("Player 2 won", width / 2, height / 2 + 22)
		}

		textSize(20)
		fill(0)
		text("Press spacebar to restart", width / 2, height / 2 + 30 * 2)
		noLoop()

	}

}

function scoreboardDisplay() {
	textSize(40)
	textAlign(CENTER)

	fill(255, 123, 172)
	rectMode(CENTER)
	noStroke()
	rect(width / 2 - 40, 50, 80, 70, 5, 0, 0, 5)
	fill(255)
	text(playerLeft.score, width / 2 - 40, 55)
	textSize(15)
	text("Player 1", width / 2 - 40, 75)

	textSize(40)
	fill(255, 123, 172)
	rectMode(CENTER)
	noStroke()
	fill(0, 255, 172)
	rect(width / 2 + 40, 50, 80, 70, 0, 5, 5, 0)
	fill(255)
	text(playerRight.score, width / 2 + 40, 55)
	textSize(15)
	text("Player 2", width / 2 + 40, 75)
}

function windowResized() {
	resizeCanvas(canvasSize, ratio)
	image(capture, -width, 0, width, ratio)
}

function keyPressed() {
	if (keyCode == 32) {
		location.reload();
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
