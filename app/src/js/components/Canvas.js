import React, { Component, PropTypes } from 'react';

import CanvasSettings from './CanvasSettings';

export default class Canvas extends Component {
	constructor(props) {
		super(props);

		this.painting = false;
		this.scope = this.props.scope;
		this.setupArrays();
	}

	componentDidMount() {
		this.setupCanvas();

		if(this.player) {
			this.props.base.fetch('/rooms/' + this.scope.roomId + '/drawState',{
				context: this,
				then: this.redraw
			});
		}
	}

	setupCanvas() {
		this.canvas = document.querySelector('#canvas');
		this.canvas.setAttribute('width',this.canvas.parentElement.offsetWidth);
		this.ctx = this.canvas.getContext('2d');
		this.canvasX = this.canvas.offsetLeft;
		this.canvasY = this.canvas.offsetTop;
		this.ctx.strokeStyle = "#FFFFFF";
		this.ctx.shadowColor = "#FFFFFF";
		this.ctx.shadowBlur = 0;
		this.ctx.lineJoin = "round";
  		this.ctx.lineWidth = 5;
  		this.ctx.translate(0.5, 0.5);
  		this.numProps = Object.keys(this.scope.defaultDrawState).length;
  		this.player = this.props.player;

  		this.redraw();
	}

	// start
	startDrawing(e) {
		this.painting = true;
		this.current = this.points.length || 0;
		this.setupCurrent();
		this.addToArray(this.getX(e),this.getY(e),false);

		this.renderDot(this.points[this.current]);
	}

	// drag
	dragBrush(e) {
		if(this.painting) {
			if(this.points[this.current].length > 30) {
				let prevArr = this.points[this.current];
				this.current++;
				this.setupCurrent();
				
				let obj = prevArr[prevArr.length - 1];
				let counter = 0;

				for(let i = prevArr.length - 8; i < prevArr.length -1; i++) {
					this.points[this.current][counter] = prevArr[i];
					counter++;
				}
			}

			this.addToArray(this.getX(e),this.getY(e),true);

			if(this.player) {
				this.playerDraw();
			}
		}
	}

	// finish
	stopDrawing() {
		this.painting = false;
	}


	// UTILITIES

	// setup latest (current) path item

	setupCurrent() {
		
		this.points[this.current] = [];	
	}	

	// get x coordinate
	getX(e) {
		return e.pageX - this.canvasX;
	}

	// get y coordinate
	getY(e) {
		return e.pageY - this.canvasY;
	}

	// add to points array
	addToArray(mx,my,dragStatus) {		
		this.points[this.current].push({
			x: mx, 
			y: my, 
			color: this.ctx.strokeStyle, 
			size: this.ctx.lineWidth,
			dragging: dragStatus
		})

		this.scope.pushDrawState(this.points);
	}

	// client redraw function
	redraw() {
		this.clearContext(this.ctx);

		for(var i = 0; i < this.points.length; i++) {
			let path = this.points[i];

			this.ctx.beginPath();
			this.ctx.moveTo(path[0].x,path[0].y);

			if(path.length > 6 && path[0].dragging || path[1] && path[1].dragging) {
				this.renderPath(path);			
			} else {
				this.renderDot(path);
			}
		}
	}

	// player redraw function
	playerDraw() {
		this.ctx.beginPath();
		let path = this.points[this.current];
		let item = path[0];
		var startX = item.x;
		var startY = item.y;
		
		this.ctx.moveTo(startX,startY);

		if(item.length > 4 && path[0].dragging || path[1].dragging) {
			this.renderPath(path);
		}
	}

	// path renderer
	renderPath(path) {
		let first = path[0];
		let length = path.length;

		for(var i = 0; i < path.length; i++) {
			let val = path[i];

			if(i > 0 && i < length - 2) {
				if(val.joined) {
					var x = (val.x + path[i + 1].x) / 2;
					var y = (val.y + path[i + 1].y) / 2;


				} else {
					var x = (val.x + path[i + 1].x) / 2;
					var y = (val.y + path[i + 1].y) / 2;
				}
				
				this.ctx.quadraticCurveTo(val.x, val.y, x, y);					
			}

			this.ctx.lineWidth = first.size;
			this.ctx.strokeStyle = first.color;
			this.ctx.stroke();
		}
	}

	// line renderer

	renderDot(path) {
		let obj = path[0];

		this.ctx.beginPath();
		this.ctx.arc(obj.x, obj.y, obj.size / 2, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = obj.color;
		this.ctx.fill();
		this.ctx.closePath();
	}

	// clear the supplied context
	clearContext(ctx) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	// empty points array
	clearArrays() {
		this.points = [];

		this.scope.pushDrawState(this.points);
	}

	// empty contexts and points
	fullClear() {
		this.clearContext(this.ctx);
		this.clearArrays();
	}


	// change the current stroke colour
	updateColor(e) {
		let newColor = e.target.getAttribute('data-color');

		this.ctx.strokeStyle = newColor;
		this.ctx.shadowColor = newColor;
	}


	// change brush size
	changeBrushSize(e) {
		let newSize = e.target.getAttribute('data-size');
		this.ctx.lineWidth = newSize;
	}

	// setup default arrays to avoid errors. Should be handled better really.
	setupArrays() {
		if(Object.keys(this.props.drawState).length) {
			this.points = this.props.drawState;
		} else {
			this.points = [];
		}
	}

	render() {
		this.setupArrays();

		if(this.canvas && !this.props.player) {
			this.redraw();
		}

		if (this.props.player) {
			var canvasSettings = <CanvasSettings scope={this} fullClear={this.fullClear} changeBrushSize={this.changeBrushSize} updateColor={this.updateColor} />;
			var canvas = ( 
				<canvas width="100" height="600px" className="canvas" id="canvas" 
						onMouseDown={this.startDrawing.bind(this)} 
						onMouseUp={this.stopDrawing.bind(this)} 
						onMouseLeave={this.stopDrawing.bind(this)} 
						onMouseMove={this.dragBrush.bind(this)} 
				>				
				</canvas>
			)
		} else {
			var canvasSettings = '';
			var canvas = (
				<canvas width="100" height="600px" className="canvas" id="canvas"></canvas>
			)
		}

		return (
			<div className="canvas__wrap">
				{canvasSettings}
				{canvas}
			</div>
		)
	}
}

Canvas.propTypes = {
	scope: PropTypes.object.isRequired,
	drawState: PropTypes.array,
	player: PropTypes.bool.isRequired
}