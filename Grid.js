class Grid {

    constructor(elem) {
        this.elements = elem;
        this.start = new Array(2);
        this.end = new Array(2);
        this.ready = false;
        this.stack = new Array();
        this.searched = new Array();
        this.path = new Array();
        this.numSearched = 0;
        this.prevTop;
    } 
    
    makeGrid() {

        /*
        var g = new Array(numBoxes)
        for (let i = 0; i < numBoxes; i++) {
            g[i] = new Array(numBoxes); 
        }

        for (let i = 0; i < numBoxes; i++) {
            for (let j = 0; j < numBoxes; j++) {

            }
        }*/
        var newArr = new Array(numBoxes);
        for (var i = 0; i < numBoxes; i++) {
            var temp  = new Array(numBoxes);
            for (var j = 0; j < numBoxes; j++) {
                temp[j] = "n";
            }
            newArr[i] = temp;    
        }

        this.elements = newArr;
    }

    showGrid() {
        let x = 0;
        let y = 0;
        //console.log("Showing Grid");
        for (let i = 0; i < numBoxes; i++) {
            y = 0;
            for (let j = 0; j < numBoxes; j++) {
    
                if (this.elements[i][j] === "n") {
                    fill(255, 255, 255)
                } else if (this.elements[i][j] === "s") {
                    fill(0, 0, 255);
                } else if (this.elements[i][j] === "e") {
                    fill(255, 0, 0);
                } else if (this.elements[i][j] === "w") {
                    fill(0, 0, 0);
                } else if (this.elements[i][j] === "c") {
                    fill(0, 180, 180);
                } else if (this.elements[i][j] === "p") {
                    fill(0, 240, 0);
                }

                rect(x, y, sideLength, sideLength);
                y = y + sideLength// + gap;
            }
            x = x + sideLength// + gap;
        }
    }

    setBox (x, y, role) {
        //console.log("updating");
        if ((x > -1) && (x < totalSide) && (y > -1) && (y < totalSide)) { //checking that it is in the grid

            let calcedXCord = Math.floor(mouseX/(sideLength));
            let calcedYCord = Math.floor(mouseY/(sideLength));

            if ((role === "s") || (role === "e")) {
                this.replaceDuplicates(this.elements, role);
            }            

            if ((role == "c") || (role == "p")) {
                this.elements[x][y] = role;
            } else {
                this.elements[calcedXCord][calcedYCord] = role;
            }

            if (role === "s") {
                this.start[0] = calcedXCord;
                this.start[1] = calcedYCord;
            } else if (role === "e") {
                this.end[0] = calcedXCord;
                this.end[1] = calcedYCord;
            }
            //console.log(this.elements);
        }
    }

    replaceDuplicates (array, elem) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].includes(elem)) {
                var j = array[i].indexOf(elem);
                array[i][j] = "n";
            }
        }
    }

    checkReady () {
        let readyStart = false;
        let readyEnd = false;
        for (let i = 0; i < this.elements.length; i++) {
            for (let j = 0; j < this.elements[i].length; j++) {
                if (this.elements[i][j] == "s") {
                    readyStart = true;
                }
                if (this.elements[i][j] == "e") {
                    readyEnd = true;
                }
            } 
        }
        if ((readyStart) && (readyEnd)) {
            this.ready = true;
        } else {
            this.ready = false;
        }
    }

    search(x, y) {
        return this.elements[x][y];
    }

    //A* SOLVER
    solveWithAStar () {
        let temp = [this.start[0], this.start[1], this.distanceToEnd(this.start)];
        this.stack.push(temp);
        this.updateStack();
    }

    updateStack() {
        let stackTopX = this.stack[0][0];
        let stackTopY = this.stack[0][1];

        //Check Left
        if (stackTopX != 0) {
            if ((this.search(stackTopX - 1, stackTopY)) === "n") {
                let temp = [stackTopX - 1, stackTopY, this.distanceFromStart([stackTopX - 1, stackTopY]) + this.distanceToEnd([stackTopX - 1, stackTopY])];
                this.stack.push(temp);
                this.setBox(stackTopX - 1, stackTopY, "c");
            }
        }
        //Check Up
        if (stackTopY != 0) {
            if ((this.search(stackTopX, stackTopY - 1)) == "n") {
                let temp = [stackTopX, stackTopY - 1, this.distanceFromStart([stackTopX, stackTopY - 1]) + this.distanceToEnd([stackTopX, stackTopY - 1])];
                this.stack.push(temp);
                this.setBox(stackTopX, stackTopY - 1, "c");
            }
        }
        //Check Right
        if (stackTopX < numBoxes - 1) {
            if ((this.search(stackTopX + 1, stackTopY)) == "n") {
                let temp = [stackTopX + 1, stackTopY, this.distanceFromStart([stackTopX + 1, stackTopY]) + this.distanceToEnd([stackTopX + 1, stackTopY])];
                this.stack.push(temp);
                this.setBox(stackTopX + 1, stackTopY, "c");
            }
        }
        //Check Down
        if (stackTopY < numBoxes) {
            if ((this.search(stackTopX, stackTopY + 1)) == "n") {
                let temp = [stackTopX, stackTopY + 1, this.distanceFromStart([stackTopX, stackTopY + 1]) + this.distanceToEnd([stackTopX, stackTopY + 1])];
                this.stack.push(temp);
                this.setBox(stackTopX, stackTopY + 1, "c");
            }
        }

        if (this.numSearched > 1) {
            let temp = this.stack.shift();
            this.searched.push(temp);
            
            /*
            if (this.prevTop != this.stack[0]) {
                this.path.push(this.stack[0]);
            }
            */
        }

        for (let i = 0; i < this.stack.length; i++) {
            if (this.searched.includes(this.stack[i])) {
                this.stack.splice(i, 1);
            }
        }
        
        //draw();
        //await sleep(2000);
        this.prevTop = this.stack[0];
        this.selectionSort();
    }
    
    selectionSort() {
        var len = this.stack.length;
        for (var i = 0; i < len - 1; i = i + 1) {
            var j_min = i;
            for (var j = i + 1; j < len; j = j + 1) {
                if (this.stack[j][2] < this.stack[j_min][2]) {
                    j_min = j;
                }
            }
            if (j_min !== i) {
                var temp = this.stack[i];
                this.stack[i] = this.stack[j_min];
                this.stack[j_min] = temp;
            }
        }
        let tem = [this.stack[0][0], this.stack[0][1]];
        this.numSearched = this.numSearched + 1;
        this.searched.push(tem);
        this.stackCheckGoalReached();
    }

/*    arrangeStack() {
        //accending sort
        let smol;
        let j;
        let temp;
        for (let i = 0; i < this.stack.length; i++) {
            smol = this.stack[i];
            for (j = i + 1; j < this.stack.length; j++) {
                if (this.stack[j][2] < smol[2]) {
                    smol = this.stack[j];
                }
            }
            if (smol != this.stack[i]) {
                temp = this.stack[i];
                this.stack[i] = smol;
                this.stack[j] = temp;
            }
        }
        console.log("stack sorted:");
        console.log(this.stack);
    }*/
    
    stackCheckGoalReached() {
        //console.log(this.distanceToEnd(this.stack[0]));
        if (this.distanceToEnd(this.stack[0]) == 1) {
            console.log("end");
            this.showPath();
        } else {
            //this.showGrid();
            this.updateStack();
        }
    }

    showPath() {
        for (let i = 4; i < this.searched.length; i++) {
            this.setBox(this.searched[i][0], this.searched[i][1], "p");
        }
        this.showGrid();
    }

    distanceFromStart (a) {
        let pythagX = Math.pow((this.start[0] - a[0]), 2 );
        let pythagY = Math.pow((this.start[1] - a[1]), 2 );
        let ans = Math.pow((pythagX + pythagY), 0.5);
        return ans;
    }

    distanceToEnd(a) {
        let pythagX = Math.pow((this.end[0] - a[0]), 2 );
        let pythagY = Math.pow((this.end[1] - a[1]), 2 );
        let ans = Math.pow((pythagX + pythagY), 0.5);
        return ans;
    }
}