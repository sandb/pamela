/*
    Copyright 2010 Pieter Iserbyt

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

var context;
var width;
var height;

// Class Pamela
function Pamela(canvas) {
  context = canvas.getContext("2d");
  width = context.canvas.clientWidth;
  height = context.canvas.clientHeight;
  
  this.norbertNode = new NorbertNode();
  this.nodes = [this.norbertNode];
  
  this.mouse = {
    x: 0,
    y: 0
  };
  
  this.buttons = new IFaceButtons();
  this.downloadScriptButton = new DownloadScriptButton(); 
  this.buttons.add(this.downloadScriptButton);
  this.resize();

  this.m = new Matrix();
  this.startTime = this.millis();
  
  var self = this;
  canvas.onmousemove = function(event) { self.mousemove(event); };
  canvas.onmouseup = function(event) { self.mouseclick(event); };
  $(window).resize(function () { self.resize(); });
}

Pamela.prototype.updateNodes = function(entities) {

  // copy current nodes
  var curN = this.nodes;
  
  // reset current nodes
  this.nodes = [];

  while (curN.length > 0) {
    var n = curN.pop();
    
    // remove dead nodes
    if (n.isDead)
      continue;
    
    // keep norbert around always
    if (n == this.norbertNode) {
      this.nodes.push(n);
      continue;
    }

    // was around and keep around?
    var found = false;    
    for (var i = 0; i < entities.length; i++) {

      if (entities[i] != n.name)
        continue;

      this.nodes.push(n);
      entities[i] = null;
      found = true;
      break; 
    }   
    
    // no longer around
    if (!found) {
      n.setMode("dying");
      this.nodes.push(n);
    }
  }
  
  // wasn't around before
  for (var i = 0; i < entities.length; i++) {
    if (entities[i] == null)
      continue;
    this.nodes.push(new Node(entities[i]));
  }
};

Pamela.prototype.millis = function() { 
  return (new Date).getTime(); 
};

Pamela.prototype.animate = function(secs) {
  return -0.5 + (this.millis() % secs) / secs;
};

Pamela.prototype.start = function() {
  if (this.play) return;
  this.play = true;
  this.updateEntries();
  this.fire();
};

Pamela.prototype.mousemove = function(event) {
  this.buttons.mousemove(event);
  this.mouse.x = event.clientX;
  this.mouse.y = event.clientY;
};

Pamela.prototype.mouseclick = function(event) {
  this.buttons.mouseclick(event);
};

Pamela.prototype.fire = function() {
  if (!this.play) return;
  var self = this;
  this.timer = setTimeout(function() { self.draw(); }, 50);
};

Pamela.prototype.stop = function() {
  clearTimeout(this.timer);
  clearTimeout(this.entriesTimer);
  this.play = false;
};

Pamela.prototype.draw = function() {
  
  if (!this.play)
    return;
    
  var m = this.m;
    
  m.resetMatrix();
  var startAnimation = 1 - ((this.millis() - this.startTime) / 3000);
  if (startAnimation > 0) { 
    startAnimation *= startAnimation;
    m.translate((width / 4) * startAnimation, 0 ,0);
    m.translate(0, 0, Math.PI * startAnimation);
  }
  
  m.translate(0, 0, -width / 5);
  m.rotateY(this.animate(7000) * 2 * Math.PI);
    m.rotateX(this.animate(12000) * 2 * Math.PI);
  
  m.rotateY((this.mouse.x % width) / width * Math.PI);
  m.rotateX((this.mouse.y % height) / height * Math.PI);
  
  for (var i = 0; i < this.nodes.length; i++) {
    this.nodes[i].project(m);
  }
  
  this.nodes.sort(function(a, b) {
    return a.projection.z - b.projection.z;
  });   

  context.save();
  context.fillStyle = config.bgcolor;
  context.fillRect( 0, 0, width, height );
  context.translate(width / 2, height / 2);
  for (var i = 0; i < this.nodes.length; i++) {
    this.nodes[i].draw();
  }
  context.restore();

  if (config.buttonShow)
    this.buttons.draw();

  this.fire();
};

Pamela.prototype.resize = function() {
  var canvas = $("#pamela")[0];
  var windowWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
  var windowHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
  canvas.width = windowWidth - 10;
  canvas.height = windowHeight - 10;
  width = context.canvas.clientWidth;
  height = context.canvas.clientHeight;
  this.buttons.reposition();
};

Pamela.prototype.updateEntries = function() {
  var self = this;
  $.getJSON("data.php", function(data) { 
    self.updateNodes(data); 
  });
  self.entriesTimer = setTimeout(function() { self.updateEntries(); }, 20000);
};

$(document).ready(function() {
  var canvas = $("#pamela")[0];
  var pamela = new Pamela(canvas);
  pamela.start();
});
