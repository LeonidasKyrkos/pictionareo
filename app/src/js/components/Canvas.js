import React, { Component, PropTypes } from 'react';

export default class Canvas extends Component {
	constructor(props) {
		super(props);

		this.painting = false;
	}

	componentDidMount() {
		this.setupCanvas();
	}

	setupCanvas() {
		this.canvas = document.querySelector('#canvas');
		this.context = this.canvas.getContext('2d');
		this.canvasX = this.canvas.offsetLeft;
		this.canvasY = this.canvas.offsetTop;
		this.context.strokeStyle = "#FFFFFF";
		this.context.lineJoin = "round";
  		this.context.lineWidth = 5;
		this.arrayX = [];
		this.arrayY = [];
		this.arrayDrag = [];
		this.arrayColor = [];
		this.arraySize = [];

		this.canvas.addEventListener('mousedown',this.startDrawing.bind(this));
		this.canvas.addEventListener('mouseup',this.stopDrawing.bind(this));
		this.canvas.addEventListener('mouseleave',this.stopDrawing.bind(this));
		this.canvas.addEventListener('mousemove',this.dragBrush.bind(this));
	}

	startDrawing(e) {
		this.painting = true;
		let mouseX = e.pageX - this.canvasX;
		let mouseY = e.pageY - this.canvasY;

		this.addToArray(mouseX,mouseY,false);
		this.draw();
	}

	dragBrush(e) {
		let mouseX = e.pageX - this.canvasX;
		let mouseY = e.pageY - this.canvasY;

		if(this.painting) {
			this.addToArray(mouseX,mouseY,true);
			this.draw();
		}
	}

	addToArray(mx,my,drag) {
		this.arrayX.push(mx);
		this.arrayY.push(my);
		this.arrayDrag.push(drag);
		this.arrayColor.push(this.context.strokeStyle);
		this.arraySize.push(this.context.lineWidth);
	}

	stopDrawing() {
		this.painting = false;
	}

	draw() {
		this.clearCanvas();

		this.arrayX.forEach((val,i)=>{
			
			this.context.beginPath();

		    if(this.arrayDrag[i] && i){
				this.context.moveTo(this.arrayX[i-1], this.arrayY[i-1]);
			} else {
				this.context.moveTo(this.arrayX[i]-1, this.arrayY[i]);
			}

			this.context.lineWidth = this.arraySize[i];
			this.context.lineTo(this.arrayX[i], this.arrayY[i]);
			this.context.closePath();
			this.context.strokeStyle = this.arrayColor[i];
			this.context.stroke();
		});
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	}

	clearArrays() {
		this.arrayX = [];
		this.arrayY = [];
		this.arrayDrag = [];
	}

	fullClear() {
		this.clearCanvas();
		this.clearArrays();
	}

	updateColor(e) {
		let newColor = e.target.getAttribute('data-color');

		this.context.strokeStyle = newColor;
	}

	changeBrushSize(e) {
		let newSize = e.target.getAttribute('data-size');
		this.context.lineWidth = newSize;
	}

	render() {
		let small = 3;
		let medium = 5;
		let large = 7;
		let huge = 12;

		return (
			<div>
				<ul className="canvas__brush-sizes">
					<li>
						<span className="canvas__brush-size-wrap" data-size={small} onClick={this.changeBrushSize.bind(this)}>
							<span className="canvas__brush-size" style={{width: small + 'px', height: small + 'px'}}></span>
						</span>
					</li>
					<li>
						<span className="canvas__brush-size-wrap" data-size={medium} onClick={this.changeBrushSize.bind(this)}>
							<span className="canvas__brush-size" style={{width: medium + 'px', height: medium + 'px'}}></span>
						</span>
					</li>
					<li>
						<span className="canvas__brush-size-wrap" data-size={large} onClick={this.changeBrushSize.bind(this)}>
							<span className="canvas__brush-size" style={{width: large + 'px', height: large + 'px'}}></span>
						</span>
					</li>
					<li>
						<span className="canvas__brush-size-wrap" data-size={huge} onClick={this.changeBrushSize.bind(this)}>
							<span className="canvas__brush-size" style={{width: huge + 'px', height: huge + 'px'}}></span>
						</span>
					</li>
				</ul>
				<ul className="canvas__colours">
					<li><span data-color="#FFFFFF" style={{backgroundColor: '#FFFFFF'}} className="canvas__colour" onClick={this.updateColor.bind(this)}></span></li>
					<li><span data-color="#d15d0a" style={{backgroundColor: '#d15d0a'}} className="canvas__colour" onClick={this.updateColor.bind(this)}></span></li>
					<li><span data-color="#FFFB21" style={{backgroundColor: '#FFFB21'}} className="canvas__colour" onClick={this.updateColor.bind(this)}></span></li>
					<li><span data-color="#363CFF" style={{backgroundColor: '#363CFF'}} className="canvas__colour" onClick={this.updateColor.bind(this)}></span></li>
				</ul>
				<canvas width="770px" height="500px" className="canvas" id="canvas"></canvas>
				<button className="btn--primary float-right" onClick={this.fullClear.bind(this)} >Reset</button>
			</div>
		)
	}
}