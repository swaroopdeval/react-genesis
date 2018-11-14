import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import HomeWap from '../component/mobile/Home'
import { fetchDemoHome } from './../../../redux/ducks/home/actions'

import React, { Component, Fragment } from 'react'

class Home extends Component {
	componentWillMount(){
		console.log('in componentWillMount Home')
	}

	loadHome(props){
		if(Object.keys(props.home.demohome).length === 0){
			props.fetchDemoHome();
		}
	}

	componentDidMount(){
		console.log('in componentDidMount Home')
		this.loadHome(this.props);
	}

	render(){
		console.log('in render Home')
		return(
			<Fragment>
				<HomeWap {...this.props}/>
			</Fragment>
		)
	}
}

const mapStateToProps = ( state ) => ( {
    	home: state.home
} );

const mapDispatchToProps = {
	'fetchDemoHome': fetchDemoHome,
};

export default connect( mapStateToProps, mapDispatchToProps )( Home );