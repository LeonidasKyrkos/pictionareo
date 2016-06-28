import React, { Component, PropTypes } from 'react';
import debounce from 'debounce';

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
		this.ctx.lineJoin = "round";
  		this.ctx.lineWidth = 5;
  		this.numProps = Object.keys(this.scope.defaultDrawState).length;
  		this.player = this.props.player;

  		this.redraw();
	}

	// start
	startDrawing(e) {
		this.painting = true;
		this.current = this.points.length || 0;
		this.setupCurrent();
		this.addToArray(this.getX(e),this.getY(e));
	}

	// drag
	dragBrush(e) {
		if(this.painting) {
			let prevArr = this.points[this.current];

			if(prevArr.length > 50) {
				this.current++;
				this.setupCurrent();
				
				let obj = prevArr[prevArr.length - 1];
				let newObj = {};
				
				for(var prop in obj) {
					newObj[prop] = obj[prop];
				}

				newObj.joined = true;

				this.points[this.current][0] = newObj;
			}

			this.addToArray(this.getX(e),this.getY(e));

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
	addToArray(mx,my) {		
		this.points[this.current].push({
			x: mx, 
			y: my, 
			color: this.ctx.strokeStyle, 
			size: this.ctx.lineWidth,
			joined: false
		})

		this.scope.pushDrawState(this.points);
	}

	// client redraw function
	redraw() {
		this.clearContext(this.ctx);
		for(var i = 0; i < this.points.length; i++) {
			let val = this.points[i];

			this.ctx.beginPath();
			this.ctx.moveTo(val[0].x,val[0].y);

			let item = val;

			this.renderPath(item);
		}
	}

	// player redraw function
	playerDraw() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.points[this.current][0].x,this.points[this.current][0].y);

		this.renderPath(this.points[this.current]);
	}

	// path renderer
	renderPath(path) {
		let first = path[0];
		let length = path.length;

		for(var i = 0; i < path.length; i++) {
			let val = path[i];

			if(i > 0 && i < length - 2) {
				if(val.joined = true) {
					
					let x = (val.x + path[i + 1].x) / 2;
					let y = (val.y + path[i + 1].y) / 2;
				} else {
					let x = (val.x + path[i + 1].x) / 2;
					let y = (val.y + path[i + 1].y) / 2;
				}
				
				this.ctx.quadraticCurveTo(val.x, val.y, x, y);					
			}

			this.ctx.lineWidth = first.size;
			this.ctx.strokeStyle = first.color;
			this.ctx.stroke();
		}
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
		let small = 3;
		let medium = 5;
		let large = 7;
		let huge = 12;

		this.setupArrays();

		if(this.canvas && !this.scope.state.player) {
			this.redraw();
		}

		return (
			<div className="canvas__wrap">
				<span className="canvas__title beta" id="word">{this.props.puzzle}</span>
				<ul className="canvas__settings">
					<li>
						<button className="btn--primary" onClick={this.fullClear.bind(this)} >Reset</button>
					</li>
					<li className="canvas__brush-sizes">
						<ul>
							<li className="ib">
								<span className="canvas__brush-size-wrap" data-size={small} onClick={this.changeBrushSize.bind(this)}>
									<span className="canvas__brush-size" style={{width: small + 'px', height: small + 'px'}}></span>
								</span>
							</li>
							<li className="ib">
								<span className="canvas__brush-size-wrap" data-size={medium} onClick={this.changeBrushSize.bind(this)}>
									<span className="canvas__brush-size" style={{width: medium + 'px', height: medium + 'px'}}></span>
								</span>
							</li>
							<li className="ib">
								<span className="canvas__brush-size-wrap" data-size={large} onClick={this.changeBrushSize.bind(this)}>
									<span className="canvas__brush-size" style={{width: large + 'px', height: large + 'px'}}></span>
								</span>
							</li>
							<li className="ib">
								<span className="canvas__brush-size-wrap" data-size={huge} onClick={this.changeBrushSize.bind(this)}>
									<span className="canvas__brush-size" style={{width: huge + 'px', height: huge + 'px'}}></span>
								</span>
							</li>
						</ul>
					</li>
					<li className="canvas__colours">
						<ul>
							<li className="ib"><span data-color="#FFFFFF" style={{backgroundColor: '#FFFFFF'}} className="canvas__colour" onClick={this.updateColor.bind(this)}></span></li>
							<li className="ib"><span data-color="#d15d0a" style={{backgroundColor: '#d15d0a'}} className="canvas__colour" onClick={this.updateColor.bind(this)}></span></li>
							<li className="ib"><span data-color="#FFFB21" style={{backgroundColor: '#FFFB21'}} className="canvas__colour" onClick={this.updateColor.bind(this)}></span></li>
							<li className="ib"><span data-color="#363CFF" style={{backgroundColor: '#363CFF'}} className="canvas__colour" onClick={this.updateColor.bind(this)}></span></li>
						</ul>
					</li>
				</ul>
				<canvas width="100" height="600px" className="canvas" id="canvas" 
						onMouseDown={this.startDrawing.bind(this)} 
						onMouseUp={this.stopDrawing.bind(this)} 
						onMouseLeave={this.stopDrawing.bind(this)} 
						onMouseMove={this.dragBrush.bind(this)} 
				>				
				</canvas>
			</div>
		)
	}
}

Canvas.propTypes = {
	puzzle: PropTypes.string,
	scope: PropTypes.object.isRequired,
	drawState: PropTypes.array,
	player: PropTypes.bool.isRequired
}