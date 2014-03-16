var SPH = function(canvas){
    this.GRAVITYX= 0;
    this.GRAVITYY= 0.5;
    this.RANGE= 50;
    this.RANGE2= this.RANGE * this.RANGE; //range square
    this.PRESSURE= 0.25;
    this.VISCOSITY= 0.16;
    this.PARTICLESIZE=40;
    this.DENSITY= 0.2;
    this.NUM_GRIDS= 24;
    this.CanvasWidth= canvas.width;
    this.CanvasHeight= canvas.height;
    this.INV_GRID_SIZE= 1 / (this.CanvasHeight / this.NUM_GRIDS);

    this.mouseX=0;
    this.mouseY=0;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');


    this.particles = [];
    this.numParticles = 0;
    this.neighbors = [];
    this.numNeighbors = 0;
    this.count = 0;
    this.press = false;
    this.grids = [];
    this.first = 0;

    this.threshold = 160;
    this.colors = { r: 135, g: 206, b: 235 }; 
    this.cycle = 0;

    this.img = new Image();
    this.img.src = 'circle.png';


    for (var i = 0; i < this.NUM_GRIDS; i++) {
            this.grids[i] = new Array(this.NUM_GRIDS);
            for (var j = 0; j < this.NUM_GRIDS; j++)
                this.grids[i][j] = new Grid();
    }

    this.touches = [{x:140,y:00,down:false}]; //needs obj type of {x:10,y:10,down:true}
    this.touchradius = 1000;
    this.touchradius2 = this.touchradius*this.touchradius;


}


//add more water at mouse position
SPH.prototype.pour = function() {
    //if (1)
        for (var i = -4; i <= 4; i++) {
            var p = new Particle(this.mouseX + i * 8, this.mouseY, this);
            p.vy = 3;
            this.particles[this.numParticles++] = p;
            //alert(mouseX);
        }
}

//calculations for SPH
SPH.prototype.move = function() {


    this.count++;
    //var i;
    //var p;
    this.updateGrids();
    this.findNeighbors();
    this.calcPressure();
    this.calcForce();
    for (var i = 0; i < this.numParticles; i++) {
        var p = this.particles[i];
        p.move(0.06);
    }
}

//calculate p.gx (position on mini grid) from p.x(position on canvas)
SPH.prototype.updateGrids = function() {
    //clear grid
    var i;
    var j;
    for (i = 0; i < this.NUM_GRIDS; i++)
        for (j = 0; j < this.NUM_GRIDS; j++)
            this.grids[i][j].clear();


    for (i = 0; i < this.numParticles; i++) {
        var p = this.particles[i];
        p.fx = p.fy = p.density = 0;
        p.gx = Math.floor(p.x * this.INV_GRID_SIZE); //reduce x to grid/canvas scale ratio to find gx
        p.gy = Math.floor(p.y * this.INV_GRID_SIZE);

        //check limits
        if (p.gx < 0)
            p.gx = 0;
        if (p.gy < 0)
            p.gy = 0;
        if (p.gx > this.NUM_GRIDS - 1)
            p.gx = this.NUM_GRIDS - 1;
        if (p.gy > this.NUM_GRIDS - 1)
            p.gy = this.NUM_GRIDS - 1;

        //add particle to grids
        this.grids[p.gx][p.gy].add(p);
    }
}


SPH.prototype.findNeighbors = function() {
    this.numNeighbors = 0;
    for (var i = 0; i < this.numParticles; i++) {
        var p = this.particles[i];

        this.findNeighborsInGrid(p, this.grids[p.gx][p.gy]);
    }
}

SPH.prototype.findNeighborsInGrid = function(pi, g) {
    for (var j = 0; j < g.numParticles; j++) {
        var pj = g.particles[j];
        if (pi == pj)
            continue;
        var distance  = Math.abs(pi.x-pj.x) + Math.abs(pi.y-pj.y);//(pi.x - pj.x) * (pi.x - pj.x) + (pi.y - pj.y) * (pi.y - pj.y);
        if (distance < this.RANGE) {
            if (this.neighbors.length == this.numNeighbors)
                this.neighbors[this.numNeighbors] = new Neighbor(this);
            this.neighbors[this.numNeighbors++].setParticle(pi, pj);
        }
    }
}
SPH.prototype.calcPressure = function() {
    for (var i = 0; i < this.numParticles; i++) {
        var p = this.particles[i];
        if (p.density < this.DENSITY)
            p.density = this.DENSITY;
        p.pressure = p.density - this.DENSITY;
    }
}
SPH.prototype.calcForce = function() {
    for (var i = 0; i < this.numNeighbors; i++) {
        var n = this.neighbors[i];
        n.calcForce();
    }
}