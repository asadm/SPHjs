
var Particle = function(x, y, SPH) {
    this.SPH = SPH;
    this.x = x;
    this.y = y;
    this.gx = 0;
    this.gy = 0;
    this.vx = 0;
    this.vy = 0;
    this.fx = 0;
    this.fy = 0;
    this.density = 0;
    this.pressure = 0;
};
Particle.prototype = {
    move: function(tdelta) {
        var time = tdelta/0.064;
        
        //touch checks

        for (var i in this.SPH.touches)
        {
            var t = this.SPH.touches[i];
            if (t.down)
            {
                var dist = Math.abs(this.x-t.x)*Math.abs(this.x-t.x) + 
                        Math.abs(this.y-t.y)*Math.abs(this.y-t.y);

                if (dist<this.SPH.touchradius*2)
                {
                    
                    //now add the forces
                    var dx=this.x-t.x;
                    var dy=this.y-t.y; //calc distance from particle

                    var fx = 1.0 - Math.abs(dx)/this.SPH.touchradius2;
                    var fy = 1.0 - Math.abs(dy)/this.SPH.touchradius2; //the closer the stronger the repulsive force
//console.log(dx);
                    if (fx>0 && fx<=1)
                    {

                        fx *= (dx<0)?-1:1;
                        
                        this.vx = (0.8*fx*5) + this.vx*0.3;

                    }

                    if (fy>0 && fy<=1)
                    {
                        fy *= (dy<0)?-1:1;
                        this.vy = (0.5*fy*5) + this.vy*0.5;

                    }

                }
                
            }
            
        }

        this.vy += this.SPH.GRAVITYY;
        this.vx += this.SPH.GRAVITYX;
        this.vx += this.fx;
        this.vy += this.fy;
        this.x += this.vx *time;
        this.y += this.vy *time;
        if (this.x < 5)
            this.vx += (5 - this.x) * 0.5 - this.vx * 0.5;
        if (this.y < 5)
            this.vy += (5 - this.y) * 0.5 - this.vy * 0.5;
        if (this.x > this.SPH.CanvasWidth)
            this.vx += (this.SPH.CanvasWidth - this.x) * 0.5 - this.vx * 0.5;
        if (this.y > this.SPH.CanvasHeight)
            this.vy += (this.SPH.CanvasHeight - this.y) * 0.5 - this.vy * 0.5;

    }
};