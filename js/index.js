


var initialize = function(){

    //var canvas = document.getElementById('canvas');
	var canvas;
	if (navigator.isCocoonJS)
	{
		canvas= document.createElement('screencanvas');
		
	}
	else
	{ 
		canvas = document.createElement('canvas');
	}
	
	canvas.width = window.innerWidth/2 ;
	canvas.height = window.innerHeight/2 ;
	document.body.appendChild(canvas);


    console.log("canvas added");

    var ctx = canvas.getContext('2d');

    ctx.fillStyle = '#DDDDDD';
    ctx.fillRect(0,0,canvas.width, canvas.height);


    //Meta ball variables
    tempcanvas = document.createElement("canvas");
    tempcanvas.width = canvas.width;
    tempcanvas.height = canvas.height;
    tempctx = tempcanvas.getContext("2d");

    var Water = new SPH(canvas);
    var press=0;


    //LOOP
    function frame(e) {

        if (press)
            Water.pour();
        Water.move();
        draw();
        window.requestAnimationFrame(frame);
//        window.setTimeout(frame, 1000/60);
	
    }


    //clear the canvas, draw on tempcanvas, apply threshold, draw on actual canvas and draw lines (obstacles)
    function draw() {
        //ctx.clearRect(0, 0, SPH.CanvasWidth, SPH.CanvasHeight);
		//ctx.fillStyle = '#DDDDDD';
		//ctx.fillRect(0,0,canvas.width,canvas.height);
		
		
        tempctx.clearRect(0, 0, Water.CanvasWidth, Water.CanvasHeight);
		//tempctx.fillStyle = '#DDDDDD';
		//tempctx.fillRect(0,0,canvas.width,canvas.height);
        for (var i = 0; i < Water.numParticles; i++) {
            var p = Water.particles[i];

            tempctx.drawImage(Water.img, p.x, p.y, Water.PARTICLESIZE, Water.PARTICLESIZE);
            
        }


        //metaballize

        var imageData = tempctx.getImageData(0, 0, Water.CanvasWidth, Water.CanvasHeight);
    

        pix = imageData.data;
        
        for (var i = 0, n = pix.length; i < n; i += 4) {
            if (pix[i + 3] < Water.threshold) { //threshold and remove blobs with less alpha than thresh.
                pix[i + 3] = 0;
            }
        }
        /**/
        ctx.putImageData(imageData, 0, 0);

    }



        
        //window.addEventListener('mousedown', function(e) {mouseX = e.layerX; mouseY = e.layerY;press = true;}, false);
        //window.addEventListener('mousemove', function (e) { mouseX = e.layerX; mouseY = e.layerY; document.title = "Particles: " + numParticles+ " Mouse Coords:"+mouseX + "," + mouseY; }, false);
        //window.addEventListener('mouseup', function(e) {press = false;}, false);
		var c = canvas;
	c.addEventListener('pointerdown', function(e) 
        {console.log(e);
            Water.mouseX = e.layerX; Water.mouseY = e.layerY;
            if (e.button==0) press = true;
            else Water.touches[0].down = true;
        }, false);
    c.addEventListener('pointermove', function (e) 
        { Water.mouseX = e.layerX; Water.mouseY = e.layerY; 
            Water.touches[0].x = e.layerX;Water.touches[0].y = e.layerY;

            document.title = "Particles: " + Water.numParticles+ " Mouse Coords:"+Water.mouseX + "," + Water.mouseY; 
        }, false);


    c.addEventListener('pointerup', function(e) {press = false;Water.touches[0].down=false;}, false);
	
	//touch specific
	c.addEventListener('touchstart', function(touchEvent) {var e= touchEvent.targetTouches[0]; Water.mouseX = e.pageX; Water.mouseY = e.pageY;press = true;}, false);
    c.addEventListener('touchmove', function (touchEvent) { var e= touchEvent.targetTouches[0]; Water.mouseX = e.pageX; Water.mouseY = e.pageY; console.log( "Particles: " + Water.numParticles+ " Mouse Coords:"+Water.mouseX + "," + Water.mouseY); }, false);
    c.addEventListener('touchend', function(touchEvent) {press = false;}, false);
    frame();



};



document.body.onload = initialize();
