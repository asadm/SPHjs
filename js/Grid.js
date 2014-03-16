var Grid = function() {
    this.particles = [];
    this.numParticles = 0;
};

Grid.prototype = {
    clear: function () {
        this.numParticles = 0;
    },
    add: function(p) {
        this.particles[this.numParticles++] = p;
    }
};