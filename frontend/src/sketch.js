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

  p.currTint = null;
  p.tintOpacity = null;

  p.setTint = (t) => {

    p.currTint = t;

    p.tintOpacity = 0;
    const interval = setInterval(() => {
      p.tintOpacity += 10;

      if (p.tintOpacity >= 100) {
        clearInterval(interval);

        const intervalDown = setInterval(() => {
          p.tintOpacity -= 10;
          if (p.tintOpacity <= 100) {
            p.currTint = null;
            clearInterval(intervalDown)
            const intervalUpNormal = setInterval(() => {
              p.tintOpacity += 10;
              if (p.tintOpacity >= 100) {
                clearInterval(intervalUpNormal);
                p.tintOpacity = null;
              }
            }, 500);
          }
        }, 500);
      }
    }, 500);
  };

  p.preload = () => {
    for (i = 1; i <= FRAME_NUM; i++) {
      let fn =
        "eye_video/" + "ezgif-frame-" + String(i).padStart(3, "0") + ".jpg";
      p.eyeVideoImages.push(p.loadImage(fn));
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
      p.currVideoTime += 1;

      p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1);
      p.currVideoTime = Math.max(p.currVideoTime, 0);
      p.draw();

      setTimeout(() => {
        p.currVideoTime += 1;

        p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1);
        p.currVideoTime = Math.max(p.currVideoTime, 0);
        p.draw();
      }, 100);

      setTimeout(() => {
        p.currVideoTime -= 1;

        p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1);
        p.currVideoTime = Math.max(p.currVideoTime, 0);
        p.draw();
      }, 200);

      setTimeout(() => {
        p.currVideoTime -= 1;

        p.currVideoTime = Math.min(p.currVideoTime, FRAME_NUM - 1);
        p.currVideoTime = Math.max(p.currVideoTime, 0);
        p.draw();
      }, 300);
    }, 400);
  };
  p.modelReady = () => {
    console.log("Model ready!");
  };

  p.draw = () => {
    // p.background("#0000aa");
    // draw the vdieo
    if (p.predictions.length > 1) return;

    if (p.currTint != null) {
      const [r, g, b] = p.currTint;
      p.tint(r, g, b, p.tintOpacity);
    } else if (p.tintOpacity != null) {
      p.tint(255, p.tintOpacity);
    } else {
      p.noTint();
    }

    p.image(p.eyeVideoImages[p.currVideoTime], 0, 0, p.width, p.height);

    p.predictions.forEach((prediction) => {
      let a = prediction.pose["nose"];

      const x = p.width - a.x;
      p.currVideoTime = p.getCorrespondingFrame(x);
      const y = a.y;
      p.noStroke();
      p.fill("red");
      p.ellipse(x, y, 12);
    });

    // debug info
    // p.drawFps();
  };

  // draw the bounding box for first face
  p.mousePressed = () => {
    p.setTint([255, 0, 0]);
  };

  p.getCorrespondingFrame = (x) => {
    let newVideoTime = Math.floor((x / p.width) * FRAME_NUM);
    newVideoTime = Math.min(newVideoTime, FRAME_NUM - 1);
    newVideoTime = Math.max(newVideoTime, 0);

    return newVideoTime;
  };

  p.windowResized = () => {
    p.width = window.innerWidth;
  };

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
