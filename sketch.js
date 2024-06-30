let img, classifier, classifyButton, clearButton, label, isDrawing;

let imageModelURL = "https://teachablemachine.withgoogle.com/models/wx1ChNS_g/";
// imageModelURL = "https://teachablemachine.withgoogle.com/models/IE1bVtHjU/";

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  let myCanvas = createCanvas(320, 260);
  myCanvas.parent("inputCanvas");

  const link = document.getElementById("classify");
  link.addEventListener("click", function (event) {
    event.preventDefault();
    classifyImage();
  });

  const link2 = document.getElementById("clear");
  link2.addEventListener("click", function (event) {
    event.preventDefault();
    clearImage();
  });

  const modelSelector = document.getElementById("modelSelector");
  modelSelector.addEventListener("change", function () {
    const selectedModelURL = modelSelector.value;
    if (selectedModelURL) {
      classifier = ml5.imageClassifier(selectedModelURL + "model.json");
    }
  });

  background(0);
}

function mousePressed() {
  stroke(255);
  strokeWeight(10);
  isDrawing = true;
  line(mouseX, mouseY, mouseX, mouseY);
}

function mouseDragged() {
  stroke(255);
  strokeWeight(10);
  if (isDrawing) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function mouseReleased() {
  isDrawing = false;
}

function classifyImage() {
  img = get();
  copiedImg = createImage(img.width, img.height);
  copiedImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  copiedImg.resize(28, 28);

  classifier.classify(img, drawBars);
}

function clearImage() {
  background(0);
}

let barHeight = 20;
let barMargin = 3;
let barWidthMultiplier = 300;

function drawBars(confidenceData) {
  background(255);

  let totalBars = confidenceData.length;
  let totalHeight = totalBars * (barHeight + barMargin);

  let startX = width / 2 - barWidthMultiplier / 2;
  let startY = height / 2 - totalHeight / 2;

  for (let i = 0; i < totalBars; i++) {
    let data = confidenceData[i];

    let x = startX;
    let y = startY + i * (barHeight + barMargin);
    let barWidth = data.confidence * barWidthMultiplier;
    strokeWeight(0);

    textAlign(LEFT, CENTER);
    stroke(255);
    textSize(12);
    fill(0, 150, 255);
    rect(x, y, barWidth, barHeight);
    fill(0);

    text(
      data.label + " (" + nf(data.confidence, 0, 2) + ")",
      x + 5,
      y + barHeight / 2
    );
  }
}
