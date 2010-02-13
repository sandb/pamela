/*
    Copyright 2009 Pieter Iserbyt

    This file is part of Pamela.

    Pamela is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Pamela is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Pamela.  If not, see <http://www.gnu.org/licenses/>.
*/


// Class color generator 

function ColorGenerator() {
	this.colors = [
		[255,   0,   0],
		[255, 255,   0],
		[  0, 255,   0],
		[  0, 255, 255],
		[  0,   0, 255],
		[255,   0, 255]
	]; 
	this.colorGeneratorValue = 0;
}

ColorGenerator.prototype.generate = function() {
	if (this.colorGeneratorValue > this.colors.length)
		this.colorGeneratorValue = 0;

	// weirdo fix for chrome bug where the colors get
	// garbage collected. I think.
	var c = this.colors[this.colorGeneratorValue++];
	return [c[0], c[1], c[2]];
};

var colorGenerator = new ColorGenerator();

// Class Node 
function Node(name) {

	this.name = name;
	this.modeTime = (new Date).getTime();
	this.setMode("newNode");
	
	var size = Math.min(width, height);
	//this.color = [
	//	Math.random() * 128, 
	//	Math.random() * 128, 
	//	Math.random() * 128];	
	this.color = colorGenerator.generate();
	this.position = new Vector(
		(Math.random() * size) - (size / 2), 
		(Math.random() * size) - (size / 2), 
		(Math.random() * size) - (size / 2));
	this.position.scale(0.5);
}

Node.prototype.setMode = function(mode) {
	this.modeTime = (new Date).getTime();
	if (mode == "newNode") {
		jQuery.extend(this, Node.prototype.newNode);
	} else if (mode == "dying") {
		jQuery.extend(this, Node.prototype.dying);
	} else if (mode == "dead") {
		jQuery.extend(this, Node.prototype.dead);
		this.isDead = true;
	} else {
		jQuery.extend(this, Node.prototype.normal);
	} 
};

Node.prototype.alphaForDepth = function(d, start, cutoff) {
	d = d < cutoff ? cutoff : d > start ? start : d;
	return 1 - (d - start) / (cutoff - start);
};


//Normal mode
Node.prototype.normal = {

	project: function(m) {
		this.projection = m.project(this.position);
		this.alpha = 255 * this.alphaForDepth(this.projection.z, 0, -400);
	},

	draw: function() {
		if (this.projection.z > -1) return;
		var scale = width * 3 / -this.projection.z;
		var alphaScale = 0.5 + this.alpha / 128;
		var invAlphaScale = 1 - alphaScale;
		var col = 
		/* [
			Math.round(this.color[0]),
			Math.round(this.color[1]),
			Math.round(this.color[2]),
		]; */
		[
			Math.round(128 * invAlphaScale + this.color[0] * alphaScale),
			Math.round(128 * invAlphaScale + this.color[1] * alphaScale),
			Math.round(128 * invAlphaScale + this.color[2] * alphaScale),
		]; 
		context.fillStyle = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')';
		//context.globalAlpha = this.alpha / 255; 
		context.beginPath();
		context.arc(this.projection.x, this.projection.y, scale, 0, Math.PI * 2, false);
		context.fill();
		context.font = scale + "pt sans-serif";
		context.fillText(this.name, this.projection.x + (scale * 1.5), this.projection.y + (scale / 1.5));
		context.closePath();
		context.globalAlpha = 1; 
	}
};

//New mode
Node.prototype.newNode = {
	
	project: function(m) {
		
		var newTime = (new Date).getTime() - this.modeTime;
		if (newTime > 1000) {
			this.setMode("normal");
			this.project(m);
			return;
		}
		
		var scale = Math.sqrt(1000 / Math.max(newTime, 1)); 
		this.projection = m.clone().scale(scale, scale, scale).project(this.position);
		this.alpha = 255 * this.alphaForDepth(this.projection.z, 0, -500);
	}

};

//Dying mode
Node.prototype.dying = {
	
	project: function(m) {
		var dyingTime = (new Date).getTime() - this.modeTime;
		if (dyingTime > 1000) {
			this.setMode("dead");
			return;
		}
		
		var scale = Math.sqrt(1000 / Math.max(1000 - dyingTime, 1)); 
		this.projection = m.clone().scale(scale, scale, scale).project(this.position);
		this.alpha = 255 * this.alphaForDepth(this.projection.z, 0, -500);
	}

};

//Dead mode
Node.prototype.dead = {
	
	project: function(m) {
	},

	draw: function() {
	}
	
};

// For inheriting classes
Node.prototype.project = Node.prototype.normal.project;
Node.prototype.draw = Node.prototype.normal.draw;

// Class NorbertNode 
jQuery.extend(NorbertNode.prototype, Node.prototype);
function NorbertNode() {
	this.norbert = new Image();
	this.norbert.src = "img/norbert-8bit.png";
	self = this;
	this.norbertLoaded = false;
	this.norbert.onload=function() { self.norbertLoaded = true; }
	this.position = new Vector(0, 0, 0);
}

NorbertNode.prototype.draw = function() {
	var s = Math.abs(this.projection.z / (width / 2));
	s *= 2;
	var x = Math.floor(this.projection.x - (186 / s));
	var y = Math.floor(this.projection.y - (50 / s));
	//var x = Math.floor(this.projection.x - (192 / s));
	//var y = Math.floor(this.projection.y - (180 / s));
	if (this.norbertLoaded)
		context.drawImage(this.norbert, x, y);
};

