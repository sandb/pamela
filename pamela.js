var context;
var width;
var height;

// Class Vector 
function Vector(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = 1;
}

Vector.prototype.add = function(v) {
	this.x += v.x;
	this.y += v.y;
	this.z += v.z;
};

Vector.prototype.subtract = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	this.z -= v.z;
};

Vector.prototype.scale = function(s) {
	this.x *= s;
	this.y *= s;
	this.z *= s;
};

Vector.prototype.rotateX = function(a) {
	var c = Math.cos(a);
	var s = Math.sin(a);
	this.y = this.y * c + this.z * s;
	this.z = this.z * c - this.y * s;
};

Vector.prototype.rotateY = function(a) {
	var c = Math.cos(a);
	var s = Math.sin(a);
	this.x = this.x * c + this.z * s;
	this.z = this.z * c - this.x * s;
};

Vector.prototype.rotateZ = function(a) {
	var c = Math.cos(a);
	var s = Math.sin(a);
	this.x = this.x * c + this.y * s;
	this.y = this.y * c - this.x * s;
};

Vector.prototype.distance = function(v) {
	if (typeof v == "undefined") {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	var xd = this.x - v.x;
	var yd = this.y - v.y;
	var zd = this.z - v.z;
	return Math.sqrt(xd * xd + yd * yd + zd * zd);
};

Vector.prototype.clone = function() {
	return new Vector(this.x, this.y, this.z);
};

Vector.prototype.project = function(cam) {
	var d = this.clone();
	d.subtract(cam);
	if (d.z < 0) return false;
	var s = (width / 2) / d.distance();
	return { x: d.x * s, y: d.y * s, scale: s };
};

// Class Matrix
function Matrix(m) {
	if (typeof m == "undefined")
		m = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
	this.m = m;
}

Matrix.prototype.multiplyVector = function(v) {

	// Initialize the result vector.
	var result = new Vector();
	var m = this.m;

	// Perform the multiplication
	result.x = m[0][0]*v.x + m[0][1]*v.y + m[0][2]*v.z + m[0][3];
	result.y = m[1][0]*v.x + m[1][1]*v.y + m[1][2]*v.z + m[1][3];
	result.z = m[2][0]*v.x + m[2][1]*v.y + m[2][2]*v.z + m[2][3];
	result.w = m[3][0]*v.x + m[3][1]*v.y + m[3][2]*v.z + m[3][3]; 
	
	return result;
};

Matrix.prototype.multiplyMatrix = function(m) {
	this.m = this._mult(m);
	return this;
};

Matrix.prototype.resetMatrix = function() {
	// identity and translate the axes to the center of the canvas.
	this.m = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
};

Matrix.prototype.rotateX = function(angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	this.m = this._mult([[1, 0, 0, 0],[0, c, -s, 0],[0, s, c, 0],[0, 0, 0, 1]]);
	return this;
};

Matrix.prototype.rotateY = function(angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	this.m = this._mult([[c, 0, s, 0],[0, 1, 0, 0],[-s, 0, c, 0],[0, 0, 0, 1]]);
	return this;
};

Matrix.prototype.rotateZ = function(angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	this.m = this._mult([[c, -s, 0, 0],[s, c, 0, 0],[0, 0, 1, 0],[0, 0, 0, 1]]);
	return this;
};

Matrix.prototype.scale = function(scaleX, scaleY, scaleZ) {
	this.m = this._mult([[scaleX,0,0,0],[0,scaleY,0,0],[0,0,scaleZ,0],[0,0,0,1]]);
	return this;
};

Matrix.prototype.translate = function(dX, dY, dZ) {
	this.m = this._mult([[1,0,0,dX],[0,1,0,dY],[0,0,1,dZ],[0,0,0,1]]);
	return this;
};

Matrix.prototype.project = function(v) {
	var pj = this.multiplyVector(v);
	pj.x /= pj.z / (width / 2);
	pj.y /= pj.z / (width / 2);
	return pj;
};

Matrix.prototype._mult = function(m) {
	var m1 = this.m;
	var m2 = m;
	var result = [[],[],[],[]]; 
	for(var i = 0; i < 4; i++){
		result[i][0] = m1[i][0] * m2[0][0] + m1[i][1] * m2[1][0] + m1[i][2] * m2[2][0] + m1[i][3] * m2[3][0];
		result[i][1] = m1[i][0] * m2[0][1] + m1[i][1] * m2[1][1] + m1[i][2] * m2[2][1] + m1[i][3] * m2[3][1];
		result[i][2] = m1[i][0] * m2[0][2] + m1[i][1] * m2[1][2] + m1[i][2] * m2[2][2] + m1[i][3] * m2[3][2];
		result[i][3] = m1[i][0] * m2[0][3] + m1[i][1] * m2[1][3] + m1[i][2] * m2[2][3] + m1[i][3] * m2[3][3];
	}
	return result;
};


// Class Node 
function Node(name) {
	this.name = name;
	var size = Math.min(width, height);	
	this.position = new Vector(
		(Math.random() * size) - (size / 2), 
		(Math.random() * size) - (size / 2), 
		(Math.random() * size) - (size / 2));
	this.position.scale(0.5);
}

Node.prototype.alphaForDepth = function(d, start, cutoff) {
	d = d < cutoff ? cutoff : d > start ? start : d;
	return 1 - (d - start) / (cutoff - start);
};

Node.prototype.project = function(m) {
	this.projection = m.project(this.position);
	this.alpha = 255 * this.alphaForDepth(this.projection.z, 0, -200);
};

Node.prototype.draw = function() {
	var scale = 5000 / -this.projection.z;
	var color = (164 + this.alpha  * 0.25);
	context.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
	context.arc(this.projection.x, this.projection.y, scale, 0, Math.PI * 2, false);
	context.fill();
	context.font = scale / 2 + "pt sans-serif";
	var textColor = (192 + this.alpha * 0.25);
	context.fillStyle = 'rgb(164,' + textColor + ',164)';
	context.fillText(this.name, this.projection.x + scale, this.projection.y + scale / 2);
};

Node.prototype.update = function() {
};


// Class NorbertNode 
jQuery.extend(NorbertNode.prototype, Node.prototype);
function NorbertNode() {
	this.norbert = new Image();
	this.norbert.src = "norbert.png";
	this.position = new Vector(0, 0, 0);
}

NorbertNode.prototype.draw = function() {
	var s = Math.abs(this.projection.z / (width / 2));
	s *= 2;
	var x = Math.floor(this.projection.x - (186 / s));
	var y = Math.floor(this.projection.y - (50 / s));
	context.drawImage(this.norbert, x, y);
};	

// Class Pamela

Pamela.prototype.millis = function() { 
	return (new Date).getTime(); 
};

var ooo = 2;

$(document).ready(function() {
	new Pamela();
});


function Pamela() {
	
	var p = Processing("pamela");
	context = p.context;
	width = context.canvas.clientWidth;
	height = context.canvas.clientHeight;

	var entities = ["sandb", "fs111", "tazo", "wouter", "unknown", "unknown", "unknown", "unknown"];
	var m = new Matrix();
	
	p.play = true;
	
	p.startTime = p.millis();
	
	p.setup = function() {
		//p.noStroke();
		var count = 0;
		this.nodes = [];
		this.nodes[count++] = new NorbertNode();
		for (var i = 0; i < entities.length; i++) {
			this.nodes[count++] = new Node(entities[i]);
		}
	};
	
	p.animate = function(secs) {
		return -0.5 + (this.millis() % secs) / secs;
	};
	
	p.mousePressed = function() {
		this.play = !this.play;
	};
	
	p.draw = function() {
		
		if (!this.play)
			return;
			
		m.resetMatrix();
		var startAnimation = 1 - ((p.millis() - p.startTime) / 3000);
		if (startAnimation > 0) { 
			startAnimation *= startAnimation;
			m.translate((width / 4) * startAnimation, 0 ,0);
			m.translate(0, 0, Math.PI * startAnimation);
		}
		
		m.translate(0, 0, -width / 6);
		m.rotateY(this.animate(7000) * 2 * Math.PI);
		
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].project(m);
		}
		
		this.nodes.sort(function(a, b) {
			return a.projection.z - b.projection.z;
		});		

		context.clearRect(0,0,width,height);
		context.save();
		context.translate(width / 2, height / 2);
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].draw();
		}
		context.restore();
	};
	
	p.init();
}

function loadImage(name) {
	var img = new Image();     
	img.src = name;
	return img;
}