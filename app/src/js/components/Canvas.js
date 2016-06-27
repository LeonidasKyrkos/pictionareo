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
	}

	setupCanvas() {
		this.canvas = document.querySelector('#canvas');
		this.canvas.setAttribute('width',this.canvas.parentElement.offsetWidth);
		this.context = this.canvas.getContext('2d');
		this.canvasX = this.canvas.offsetLeft;
		this.canvasY = this.canvas.offsetTop;
		this.context.strokeStyle = "#FFFFFF";
		this.context.lineJoin = "round";
  		this.context.lineWidth = 5;
  		this.numProps = Object.keys(this.scope.defaultDrawState).length;

  		this.redraw();
	}

	startDrawing(e) {
		this.painting = true;
		let mouseX = e.pageX - this.canvasX;
		let mouseY = e.pageY - this.canvasY;

		this.addToArray(mouseX,mouseY);
	}

	dragBrush(e) {
		let mouseX = e.pageX - this.canvasX;
		let mouseY = e.pageY - this.canvasY;

		if(this.painting) {
			this.addToArray(mouseX,mouseY,true);
		}
	}

	addToArray(mx,my) {
		this.points.push({
			x: mx, 
			y: my, 
			color: this.context.strokeStyle, 
			size: this.context.lineWidth
		})

		this.scope.pushDrawState(this.points);
	}

	stopDrawing() {
		this.painting = false;
	}

	redraw() {
		if(this.points.length) {
			let length = this.points.length;
			this.clearCanvas();
			this.context.drawImage(this.canvas,0 ,0);

			this.context.beginPath();
			this.context.moveTo(this.points[0].x,this.points[0].y);

			this.points.map((val,i)=>{
				if(i > 0 && i < length - 2) {
					console.log(this.points[i].color);
					let c = (this.points[i].x + this.points[i + 1].x) / 2;
					let d = (this.points[i].y + this.points[i + 1].y) / 2;
					this.context.lineWidth = this.points[i].size;
					this.context.strokeStyle = this.points[i].color;
					this.context.quadraticCurveTo(this.points[i].x, this.points[i].y, c, d)					
				}
			});
			
			this.context.stroke();
		}	
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	}

	clearArrays() {
		this.points = [];

		this.scope.pushDrawState(this.points);
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
	drawState: PropTypes.array
}