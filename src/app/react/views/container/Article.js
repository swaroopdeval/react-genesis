import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

export default class Article extends Component {
	componentWillMount(){
		console.log('in componentWillMount Article');
	}
	componentDidMount(){
		console.log('in componentDidMount Article');
	}
	render(){
		console.log('in render Article');
		return(
			<Fragment>
				<p>React Genesis App</p>
				<Link to={'/'}> Home </Link>
				<Link to={'/article'}> Article </Link>
				<p>Article Page</p>
			</Fragment>
		)
	}
}