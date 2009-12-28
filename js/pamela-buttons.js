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

// Class IFace buttons
function IFaceButtons() {
	this.buttons = [];
};	

IFaceButtons.prototype.add = function(button) {
	this.buttons[this.buttons.length] = button;
	this.reposition();
};

IFaceButtons.prototype.reposition = function() {
	var x = width - 64;
	var y = height - 64;
	for (var i = 0; i < this.buttons.length; i++) { 
		this.buttons[i].moveTo(x, y);
		x -= 64;
	}
};

IFaceButtons.prototype.draw = function() {
	for (var i = 0; i < this.buttons.length; i++) 
		this.buttons[i].draw();
};

