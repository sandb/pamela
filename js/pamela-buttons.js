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

// Class IFace button
function IFaceButton(x, y, width, height) {
	this.width = width;
	this.height = height;
	this.moveTo(x, y);
}

IFaceButton.prototype.moveTo = function(x, y) {
	this.x = x;
	this.y = y;
};

IFaceButton.prototype.execute = function() {
};

IFaceButton.prototype.draw = function() {
};

IFaceButton.prototype.isHovered = function(x, y) {
	return (this.x <= x) && (this.y <= y) && (this.x + this.width >= x) && (this.y + this.height >= y);
};

// Class fullscreen button
jQuery.extend(FullScreenButton.prototype, IFaceButton.prototype);
function FullScreenButton(x, y) {

	this.width = 64;
	this.height = 64;
	
	this.isFullScreen = false;
	this.isHover = false;
	
	this.minCol = new Image();
	this.minCol.src = "img/min-col.png";
	this.maxCol = new Image();
	this.maxCol.src = "img/max-col.png";
	this.min = new Image();
	this.min.src = "img/min.png";
	this.max = new Image();
	this.max.src = "img/max.png";
};

FullScreenButton.prototype.draw = function() {
	if (this.isFullScreen) {
		if (this.isHover) {
			context.drawImage(this.minCol, this.x, this.y);
		} else {
			context.drawImage(this.min, this.x, this.y);
		}		
	} else {
		if (this.isHover) {
			context.drawImage(this.maxCol, this.x, this.y);
		} else {
			context.drawImage(this.max, this.x, this.y);
		}
	}
};

FullScreenButton.prototype.execute = function() {
	this.isFullScreen = !this.isFullScreen;
	//TODO: do somth 
};

// Class DownloadScriptButton

jQuery.extend(DownloadScriptButton.prototype, IFaceButton.prototype);
function DownloadScriptButton(x, y) {

	this.width = 64;
	this.height = 64;
	
	this.isHover = false;
	
	this.dlCol = new Image();
	this.dlCol.src = "img/dl-col.png";
	this.dl = new Image();
	this.dl.src = "img/dl.png";
};

DownloadScriptButton.prototype.draw = function() {
	if (this.isHover) {
		context.fillStyle = config.buttonColor;
		context.font = "18pt sans-serif";
		context.fillText("Download pamela scanner script", this.x, this.y - 10);
		context.drawImage(this.dlCol, this.x, this.y);
	} else {
		context.drawImage(this.dl, this.x, this.y);
	}		
};

DownloadScriptButton.prototype.execute = function() {
	location.href = config.scannerDownloadLink;
};

// Class IFace buttons
function IFaceButtons() {
	this.buttons = [];
};	

IFaceButtons.prototype.add = function(button) {
	this.buttons[this.buttons.length] = button;
	this.reposition();
};

IFaceButtons.prototype.reposition = function() {
	var x = 20;
	var y = height - 64;
	for (var i = 0; i < this.buttons.length; i++) { 
		this.buttons[i].moveTo(x, y);
		x += 64;
	}
};

IFaceButtons.prototype.draw = function() {
	for (var i = 0; i < this.buttons.length; i++) 
		this.buttons[i].draw();
};

IFaceButtons.prototype.mousemove = function(event) {
	for (var i =0; i < this.buttons.length; i++) {
		var b = this.buttons[i];
		b.isHover = b.isHovered(event.clientX, event.clientY);
	}
};

IFaceButtons.prototype.mouseclick = function(event) {
	for (var i =0; i < this.buttons.length; i++) {
		var b = this.buttons[i];
		if (b.isHovered(event.clientX, event.clientY))
			b.execute();
	}
};
