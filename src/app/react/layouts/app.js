import routes from './../../routes'
import { Route, Switch } from "react-router-dom"
import React, { Component, Fragment } from "react"
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types';

class SSR extends Component {
    constructor(props) {
        super(props);
        this.getData = this.getData.bind(this)
        console.log('here ' + new Date())
        this.getData();
    }

    async getData() {
        console.log('there ' + new Date())
        
        //No need for ssr
        if (!this.props.ssr) return true;

        //No acrtion to dispatch
        if(typeof this.props.route.prefetch === 'undefined') return true

        //Get action from action creator and dispatch them.
        const prefetchAction  = this.props.route.prefetch()
        const dispatch  = this.props.dispatch
        try {
            await dispatch(prefetchAction);
            console.log('india')
        } catch(e) {
            console.log(err);
            console.log('zomato')
        }

        console.log('also here ' + new Date())
    }

    // asyncBootstrap(){
    //     if (this.props.ssr) {
    //         //Get action from action creator
    //         if(typeof this.props.route.prefetch === 'undefined') {return true}
    //         const prefetchAction  = this.props.route.prefetch()
    //         const dispatch  = this.props.dispatch
    //         return dispatch(prefetchAction).then(() => {return true}).catch((err) => {console.log(err); return false;})
    //     } else {
    //         return true
    //     }
    // }

    render(){
        console.log('render ' + new Date())
        const Component = this.props.route.component;
        return <Component  {...this.props} {...this.state}/>
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{}
        };
    }
    componentWillMount(){
        let userInfo = this.props.cookies.get('userInfo');
        if(typeof userInfo !== 'undefined'){
            this.setState({
                userInfo: userInfo
            })
        }
    }
    render(){
        const reactRoute = routes.map((route, index) => (
            <Route exact key={index} path={route.path} render={ (routeProps) => (
                <SSR {...this.props} {...this.state} {...routeProps} route={route}/>
            )}/>
        ));

        return(
             <Switch>
                 {reactRoute}
             </Switch>
        )
    }
}

App.propTypes = {
    cookies: instanceOf(Cookies).isRequired
};

export default (withCookies(App));
