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
	var distancePerHalfScreen = (pj.z / pj.w) / (width / 2);
	pj.x /= distancePerHalfScreen;
	pj.y /= distancePerHalfScreen;
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

Matrix.prototype.clone = function() {
	return new Matrix(this.m.slice());
}

