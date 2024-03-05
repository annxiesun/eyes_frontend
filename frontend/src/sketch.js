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
    p.createCanvas(window.innerWidth, window.innerHeight);
  
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
  
    // draw the vdieo
    // p.image(video, 0, 0, p.width, p.height);
  
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
