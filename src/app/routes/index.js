import splitComponent from './Splitcomponent'

const routes = [
	{
        path: `/`,
        component: splitComponent('Home'),	//file name only, case-sensitive
        //prefetch: ['www.google.com', 'www.facebook.com'] //actions for SSR rendering of this component
        prefetch: require('../redux/ducks/home/actions').ssr
    },
    {
        path: `/article`,
        component: splitComponent('Article')
    }
]

export default routes
