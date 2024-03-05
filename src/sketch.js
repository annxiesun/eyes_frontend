import { createParamGui } from "./utilities";
// import PREDICTIONS from "./predictions.json";

export const OPTIONS = {
  agentNum: 20,
  phase: 0
}


// Exporting a p.called 'mySketch'
export const mySketch = (p) => {
  // the model
  p.facemesh;
  // latest model predictions
  p.predictions = []
  // video capture
  p.video;
  
  p.preload = () => {}
  
  p.setup = () => {
    p.createCanvas(640, 480);
  
    video = p.createCapture(p.VIDEO);
    video.size(p.width, p.height);
  
  
    // initialize the model
    const options = {
      // flipHorizontal: true, // seems to be a bug?
      maxFaces: 1,
      detectionConfidence: 0.5,
    };
    p.facemesh = ml5.facemesh(video, options, p.modelReady);
  
    // This sets up an event that fills the global variable "predictions"
    // with an array every time new predictions are made
    p.facemesh.on("predict", (results) => {
      p.predictions = results;
    });
  
    // Hide the video element, and just show the canvas
    video.hide();
  }
  
  p.modelReady= () => {
    console.log("Model ready!");
  }
  
  p.draw= () => {
    p.background("#0000aa");
    p.image(video, 0, 0, p.width, p.height);
  
    // different visualizations
    p.drawBoundingBoxes();
  
    // if (p.predictions.length > 0) {
    //   drawAnnotation(p.predictions[0], "silhouette")
    // }
  
    // debug info
    p.drawFps();
  }
  
  // draw the bounding box for first face
  p.drawBoundingBoxes= () => {
    let c = "#ff0000";
    for (let predict of p.predictions) {
      const bb = predict.boundingBox;
      // get bb coordinates
      const x = bb.topLeft[0][0];
      const y = bb.topLeft[0][1];
      const w = bb.bottomRight[0][0] - x;
      const h = bb.bottomRight[0][1] - y;
  
      // draw the bounding box
      p.stroke(c);
      p.strokeWeight(2);
      p.noFill();
      p.rect(x, y, w, h);
      // draw the confidence
      p.noStroke();
      p.fill(c);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.textSize(20.0);
      p.text(predict.faceInViewConfidence.toFixed(2), x, y - 10);
    }
  }
  
  let upperEyeLeft = [];
  let upperEyeRight = [];
  
  p.drawEyeliner = (array, name) => {
    if (array.length < 1) return;
    let [px, py] = array[0];
    let thickness = 4;
    const [wingX, wingY] =
      name === "right" ? [px - 10, py - 5] : [px + 10, py - 5];
  
    noStroke();
    fill(0,0,0,80);
    beginShape();
    vertex(px, py);
    vertex(wingX, wingY);
    vertex(array[2][0], array[2][1]);
    endShape();
  
    for (let i = 1; i < array.length; i++) {
      const [x, y] = array[i];
  
      stroke(0,0,0,80);
      strokeWeight(thickness);
      line(px, py, x, y);
      px = x;
      py = y;
      if (thickness > 1) thickness -= 0.5;
    }
  
  }
  
  const lips = [
    "lipsLowerOuter",
    "lipsUpperOuter",
    "lipsUpperInner",
    "lipsLowerInner",
  ];
  p.drawAnnotation = (
    prediction,
    name,
    color = "#0000ff",
    addLabel = p.labels
  ) => {
    let pts = prediction.annotations[name];
    if (pts.length == 1) {
      // const [x, y] = pts[0]
      // noStroke()
      // fill("black")
      // ellipse(x, y, 8)
    } else if (lips.includes(name)) {
      let [px, py] = pts[0];
      noStroke();
      fill(153, 15,0, 50);
      beginShape();
      for (let i = 1; i < pts.length; i++) {
        const [x, y] = pts[i];
        vertex(px, py);
        vertex(x, y);
        px = x;
        py = y;
      }
      endShape();
    } else if (name === "rightEyeUpper0") {
      upperEyeRight = pts;
    } else if (name === "leftEyeUpper0") {
      upperEyeLeft = pts;
    } else if (name === "leftEyebrowLower" || name === "rightEyebrowLower") {
      let [px, py] = pts[2];
      let thickness = 0;
      for (let i = 3; i < pts.length; i++) {
        const [x, y] = pts[i];
  
        let mid_x = px + (x - px) / 2;
        let mid_y = py + (y - py) / 2;
  
        stroke(66, 53, 52, 100);
        strokeWeight(thickness);
        line(px, py, mid_x, mid_y);
  
        thickness += 1;
  
        strokeWeight(thickness);
        line(mid_x, mid_y, x, y);
        px = x;
        py = y;
        thickness += 1;
      }
    } else if (name === "rightEyeLower1" || name === "leftEyeLower1") {
      blendMode(DODGE);
      let [px, py] = pts[3];
      for (let i = 4; i < pts.length - 3; i++) {
        const [x, y] = pts[i];
        stroke(255, 241, 227,100);
        strokeWeight(1);
        line(px, py, x, y);
        px = x;
        py = y;
      }
      blendMode(BLEND);
    } else if (name === "rightEyeUpper1" || name === "leftEyeUpper1") {
      let [px, py] = pts[0];
      // fill("red");
      // noStroke();
      // beginShape();
  
      // for (let i = 1; i < pts.length; i++) {
      //   const [x, y] = pts[i];
      //   vertex(px, py);
      //   vertex(x, y);
      //   px = x;
      //   py = y;
      // }
  
      // endShape();
  
      /* eye liner */
      drawEyeliner(upperEyeLeft, "left");
      drawEyeliner(upperEyeRight, "right");
    } else if (name === "silhouette") {
      let [px, py] = pts[0];
      blendMode(SCREEN);
      fill(227, 203, 193,20);
      beginShape();
      for (let i = 1; i < pts.length; i++) {
        const [x, y] = pts[i];
        vertex(px, py);
        vertex(x, y);
        px = x;
        py = y;
      }
      endShape();
      blendMode(BLEND);
    } else {
      // let [px, py] = pts[0]
      // for (let i = 1; i < pts.length; i++) {
      //   const [x, y] = pts[i]
      //   stroke("black")
      //   strokeWeight(1)
      //   line(px, py, x, y)
      //   px = x
      //   py = y
      // }
    }
  
    if (addLabel) {
      const [x, y] = pts[0];
      p.noStroke();
      p.fill(color);
      p.textSize(10);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(name, x + 8, y - 8);
    }
  }
  
  p.drawAllAnnotations= () => {
    for (let prediction of p.predictions) {
      let keyNum = Object.keys(p.annotations).length;
      let i = 0;
      drawingContext.filter = 'blur(5px)';
      for (let n in prediction.annotations) {
        // make a rainbow
        let hue = map(i++, 0, keyNum, 0, 360);
        let c = color(`hsb(${hue}, 100%, 100%)`);
        // draw the annotation
        drawAnnotation(p, n, c);
      }
    }
    drawingContext.filter = 'none';
  }
  
  p.keyPressed= () => {
    if (key == "?") {
      if (predictions) print(JSON.stringify(predictions, null, 2));
    } else if (key === "a") {
      drawAnnotations();
    }
  }
  
  p.mousePressed= () => {}
  
  p.windowResized= () => {}
  
  p.fps = 0;
  
  p.drawFps= () => {
    let a = 0.01;
    p.fps = a * p.frameRate() + (1 - a) * p.fps;
    p.stroke(255);
    p.strokeWeight(0.5);
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(20.0);
    p.text(p.fps.toFixed(1), 10, 10);
  }
  
}
