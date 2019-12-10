const numBoxes = 20;
const sideLength = 42;

var totalSide = numBoxes * sideLength;
var g;

function setup() {
    canvas = createCanvas(totalSide, totalSide);
    canvas.style('z-index', '-1');
    g = new Grid();
    g.makeGrid();
    noLoop();
    //console.log(g.elements);
}

function draw() {
    background(200);
    g.checkReady();
    g.showGrid();
}

function mousePressed() {
    if (keyIsDown(81)) {
        g.setBox(mouseX, mouseY, "s");
        g.home = true;
        draw();
    } else if (keyIsDown(69)) {
        g.setBox(mouseX, mouseY, "e");
        g.home = true;
        draw();
    } else if (keyIsDown(87)) {
        g.setBox(mouseX, mouseY, "n");
        g.home = true;
        draw();
    } else {
        g.setBox(mouseX, mouseY, "w");
        g.home = true;
        draw();
    }
}

function keyPressed() {
    if ((g.ready) && (keyCode === 32)) {
        console.log("Starting A*");
        //console.log(g.start);
        //console.log(g.end);
        g.solveWithAStar();
        draw();
    }
}
