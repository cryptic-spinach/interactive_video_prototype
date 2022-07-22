import { canvasConfig, sliderConfig, axisConfig, palette, trendlineConfig, stepperButtonConfig, sliderLabelConfig, trendlineLabelConfig, styles } from "./configs.js";
import { controlsInit } from "./controls.js";
import { formatTableAsJson, showValue, showValues, sliderInit, buttonsInit, positionButton} from "./helpers.js"
import { Point, Segment, Axes, PointCloud } from "./components.js";
import { getTrendlineDisplay, getTrendlineLabelDisplay } from "./stepper.js"
import { generatePlotPoints, generateErrorCurvePoints } from "./point-factory.js";

export let sketch_1DoF = p5 => {
  let sound;
  let table;
  let slider;
  let plotPoints;
  let errorCurvePoints;
  let data;
  p5.buttons;
  p5.stepper;

  p5.preload = () => {
    sound = p5.loadSound('content/1DoF/assets/sepia-sky.mp3');
    data = p5.loadTable('content/1DoF/assets/mouse-recording.csv', 'csv', 'header');
  }

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth - canvasConfig.trimX, p5.windowHeight - canvasConfig.trimY);
  
    controlsInit();
    p5.buttons = buttonsInit(p5);
    slider = sliderInit(p5);
  
    table = formatTableAsJson(data);

    plotPoints = generatePlotPoints(p5, 10);
    errorCurvePoints = generateErrorCurvePoints();

    p5.stepper = 1;
  };

  p5.draw = () => {
    p5.background(palette.backgroundFill);
    p5.translate((p5.windowWidth - canvasConfig.trimX)/2, (p5.windowHeight - canvasConfig.trimY)/2);
    p5.scale(1, -1);
    p5.angleMode(p5.RADIANS);

    // Calculation
    let sliderLabel = new Point(sliderLabelConfig.x, sliderLabelConfig.y, "b")
    let trendlineLabel = new Point(trendlineLabelConfig.x, trendlineLabelConfig.y, "y = bx")

    let axes = new Axes(axisConfig.x, axisConfig.y, axisConfig.w, axisConfig.h, "x", "y");

    let trendlineStart = new Point(- axisConfig.w/2 + axisConfig.x - trendlineConfig.extraX, - axisConfig.h/2 + trendlineConfig.bInit + axisConfig.y - trendlineConfig.extraY);
    let trendlineEnd   = new Point(  axisConfig.w/2 + axisConfig.x + trendlineConfig.extraX,   axisConfig.h/2 + trendlineConfig.bInit + axisConfig.y + trendlineConfig.extraX);
    let trendline = new Segment(trendlineStart, trendlineEnd);

    let rotateAbout = new Point(axisConfig.x, trendlineConfig.bInit + axisConfig.y);
    
    trendline.rotateSegment(p5, slider.value(), rotateAbout);

    let errorCurve = new PointCloud(errorCurvePoints);
    errorCurve.getCurve(p5)

    // Display
    axes.show(p5);
    trendline.showAsSegment(p5, "#ffffff", 1.5, styles.segmentOpacity);

    plotPoints.forEach(p => {
      getTrendlineDisplay(p5, p5.stepper, trendline, p)
    });

    plotPoints.forEach(p => {
      p.show(p5);
    });

    sliderLabel.showLabel(p5, sliderLabelConfig.labelFill);
    getTrendlineLabelDisplay(p5, p5.stepper, trendlineLabel)
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth - canvasConfig.trimX, p5.windowHeight - canvasConfig.trimY);
    slider.position((p5.windowWidth - canvasConfig.trimX)/2 + sliderConfig.x, (p5.windowHeight - canvasConfig.trimY)/2 + sliderConfig.y);
    let i = 0;
    p5.buttons.forEach(b => {
      positionButton(p5, b, i);
      i++;
    })
  }


};

export let part_1DoF = new p5(sketch_1DoF, document.querySelector(".part-1DoF"));