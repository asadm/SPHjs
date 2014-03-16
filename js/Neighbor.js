var Neighbor = function (SPH) {
    this.SPH = SPH;
    this.p1 = null;
    this.p2 = null;
    this.distance = 0;
    this.nx = 0;
    this.ny = 0;
    this.weight = 0;
};
Neighbor.prototype = {
    setParticle: function (p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.nx = p1.x - p2.x;
        this.ny = p1.y - p2.y;
        this.distance = Math.sqrt(this.nx * this.nx + this.ny * this.ny);
        this.weight = 1 - this.distance / this.SPH.RANGE;
        var temp = this.weight * this.weight * this.weight;
        p1.density += temp;
        p2.density += temp;
        temp = 1 / this.distance;
        this.nx *= temp;
        this.ny *= temp;
    },
    calcForce: function () {
        var p1 = this.p1;
        var p2 = this.p2;
        var pressureWeight = this.weight * (p1.pressure + p2.pressure) / (p1.density + p2.density) * this.SPH.PRESSURE;
        var viscosityWeight = this.weight / (p1.density + p2.density) * this.SPH.VISCOSITY ;
        p1.fx += this.nx * pressureWeight;
        p1.fy += this.ny * pressureWeight;
        p2.fx -= this.nx * pressureWeight;
        p2.fy -= this.ny * pressureWeight;
        var rvx = p2.vx - p1.vx;
        var rvy = p2.vy - p1.vy;
        p1.fx += rvx * viscosityWeight;
        p1.fy += rvy * viscosityWeight;
        p2.fx -= rvx * viscosityWeight;
        p2.fy -= rvy * viscosityWeight;
    }
};