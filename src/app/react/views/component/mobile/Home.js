import { Link } from 'react-router-dom'
import React, { Component, Fragment } from 'react'

export default class Home extends Component {
	render(){
		return(
			<Fragment>
				<div className='test'><a href='' title=''>react app</a></div>
				<p>React Genesis App</p>
				<Link to={'/'}> Home </Link>
				<Link to={'/article'}> Article </Link>
				<p>Home Page</p>
				<p>{JSON.stringify( this.props.home )}</p>
			</Fragment>
		)
	}
}