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

  p.video;

  p.eyeVideoImages = [];

  p.windowSections = 10;

  p.currVideoTime = 0;

  p.preload = () => {
    for (i = 1; i <= FRAME_NUM; i++) {
      let fn = 'eye_video/' + "ezgif-frame-" + String(i).padStart(3, '0') + ".jpg"
      p.eyeVideoImages.push(p.loadImage(fn))
    }
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.noLoop();
    p.windowSectionWidth = p.width / p.windowSections;

    p.video = p.createCapture(p.VIDEO);
    p.video.size(p.width, p.height);
    p.video.hide();
  
    // initialize the model
    p.posenet = ml5.poseNet(p.video, p.modelReady);
    p.posenet.on("pose", (results) => {
      p.predictions = results;
    });

    //Hide the video element, and just show the canvas


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
    p.background("#0000aa");
    // draw the vdieo
    p.image(p.eyeVideoImages[p.currVideoTime],0,0, p.width, p.height)

    p.predictions.forEach((prediction) => {
      let a = prediction.pose["nose"];
      const x = a.x;
      const y = a.y;
      p.noStroke();
      p.fill('red');
      p.ellipse(x, y, 12);
    })

    // debug info
    // p.drawFps();
  };

  // draw the bounding box for first face
  p.mousePressed = () => {
  }

  p.mouseMoved = () => {
    // const diff = p.prevMouseX - p.mouseX
    // p.currVideoTime = Math.floor(p.mouseX/p.width * FRAME_NUM)
    // p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1)
    // p.currVideoTime = Math.max(p.currVideoTime, 0)

    // p.draw()
    // p.prevMouseX = p.mouseX
    // // console.log(diff)
    // p.lock = false;
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
