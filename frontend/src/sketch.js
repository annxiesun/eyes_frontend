import { createParamGui } from "./utilities";
// import PREDICTIONS from "./predictions.json";


export const OPTIONS = {
  agentNum: 20,
  phase: 0,
};
const FRAME_NUM = 78;

// Exporting a p.called 'mySketch'
export const mySketch = (p) => {
  // the model
  p.poseNet;
  // latest model predictions
  p.predictions = [];
  // video capture
  p.video;

  p.eyeVideoImages = [];

  p.windowSections = 10;

  p.currVideoTime = 0;
  // p.desiredVideoTime = 3;
  p.loaded = false;

  p.prevMouseX = 0;

  p.lock = false;

  p.preload = () => {};

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.noLoop();
    p.windowSectionWidth = p.width / p.windowSections;

    // p.video = p.createCapture(p.VIDEO);
    // p.video.size(p.width, p.height);

  
    // // initialize the model
    // p.posenet = ml5.poseNet(video, p.modelReady);
    // p.posenet.on("pose", (results) => {
    //   predictions = results;
    // });

    // Hide the video element, and just show the canvas
    // p.video.hide();
  
    for (i = 1; i <= FRAME_NUM; i++) {
      let fn = 'eye_video/' + "ezgif-frame-" + String(i).padStart(3, '0') + ".jpg"
      p.eyeVideoImages.push(p.loadImage(fn))
    }


    const moveAround = setInterval(() => {

      p.currVideoTime += 1

      p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1)
      p.currVideoTime = Math.max(p.currVideoTime, 0)
      p.draw()

      setTimeout(() => {
        p.currVideoTime += 1

        p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1)
        p.currVideoTime = Math.max(p.currVideoTime, 0)
        p.draw()
      }, 100)

      setTimeout(() => {
        p.currVideoTime -= 1

        p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1)
        p.currVideoTime = Math.max(p.currVideoTime, 0)
        p.draw()
      }, 200)


      setTimeout(() => {
        p.currVideoTime -= 1

        p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1)
        p.currVideoTime = Math.max(p.currVideoTime, 0)
        p.draw()
      }, 300)
    
    }, 400)

  };
  p.modelReady = () => {
    console.log("Model ready!");
  };

  p.draw = () => {
    // console.log("draw")
    // if (!p.loaded) return;
    p.background("#0000aa");
    // draw the vdieo
    p.image(p.eyeVideoImages[p.currVideoTime],0,0, p.width, p.height)

    // predictions.forEach((pred) => {
    //   const landmarks = pred.pose.keypoints;
  
    //   landmarks.forEach((k) => {
    //     const x = k.position.x;
    //     const y = k.position.y;
  
    //     stroke(128);
    //     strokeWeight(1);
    //     fill(255);
    //     ellipse(x, y, 10, 10);
    //   });
    // });
    // p.image(video, 0, 0, p.width, p.height);

    // different visualizations
    // p.drawBoundingBoxes();

    // if (p.predictions.length > 0) {
    //   drawAnnotation(p.predictions[0], "silhouette")
    // }

    // debug info
    // p.drawFps();
  };

  // draw the bounding box for first face
  p.drawBoundingBoxes = () => {
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
  };

  let upperEyeLeft = [];
  let upperEyeRight = [];

  p.drawAllAnnotations = () => {
    for (let prediction of p.predictions) {
      let keyNum = Object.keys(p.annotations).length;
      let i = 0;
      for (let n in prediction.annotations) {
        // make a rainbow
        let hue = map(i++, 0, keyNum, 0, 360);
        let c = color(`hsb(${hue}, 100%, 100%)`);
        // draw the annotation
        drawAnnotation(p, n, c);
      }
    }
  };
  p.mousePressed = () => {
  }

  p.mouseMoved = () => {
    const diff = p.prevMouseX - p.mouseX
    p.currVideoTime = Math.floor(p.mouseX/p.width * FRAME_NUM)
    p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1)
    p.currVideoTime = Math.max(p.currVideoTime, 0)

    p.draw()
    p.prevMouseX = p.mouseX
    // console.log(diff)
    p.lock = false;
  };

  p.windowResized = () => {};

  p.fps = 0;

  p.drawFps = () => {
    let a = 0.01;
    p.fps = a * p.frameRate() + (1 - a) * p.fps;
    p.stroke(255);
    p.strokeWeight(0.5);
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(20.0);
    p.text(p.fps.toFixed(1), 10, 10);
  };
};
