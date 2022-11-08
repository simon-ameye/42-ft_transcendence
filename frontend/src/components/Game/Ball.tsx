
import React, { Component } from 'react';

class Ball extends Component {
	ballElem: HTMLDivElement
	constructor(ballElem:HTMLDivElement){
		super(ballElem);
		this.ballElem = ballElem;
	}

	get x(){
		return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
	}

	set x(value){
		this.ballElem.style.setProperty("--x", `${value}`);
	}

	get y(){
		return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
	}

	set y(value){
		this.ballElem.style.setProperty("--y", `${value}`);
	}

	update(delta:number) {
		this.x = 15
		this.y = 15
	}
	render() {
		return (
			<div>
				
			</div>
		);
	}
}

export default Ball;

