import Vue from 'vue'
import Router from 'vue-router'
import IsobitUI from 'isobit-ui'
import App from './App.vue'
import Ionic from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';
Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(IsobitUI);
Vue.use(Ionic);
Vue.config.ignoredElements = [/^ion-/,/^v-/];   // add this line
Vue.config.productionTip = false;
const  router  =  new  Router({
	mode: 'history',
	routes: [
		{
			path:'/admin',
			component:  r => require.ensure([], () => r(require('./Admin.vue')), 'big-pages'),
			children:[
				{
					path:  '',
					component:  r => require.ensure([], () => r(require('./admin/bpm/run/List.vue')), 'big-pages')
				},
				{
					path:  'bpm',
					component:  r => require.ensure([], () => r(require('./admin/bpm/run/List.vue')), 'big-pages')
				},
				{
					path:  'bpm/run',
					component:  r => require.ensure([], () => r(require('./admin/bpm/run/List.vue')), 'big-pages')
				},
				{
					path:  'bpm/run/create',
					component:  r => require.ensure([], () => r(require('./admin/bpm/run/Create.vue')), 'big-pages')
				},
				{
					path:  'bpm/run/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/bpm/run/Create.vue')), 'big-pages')
				},
				{
					path:  'bpm/run/dispatch/:dispatch',props: true,
					component:  r => require.ensure([], () => r(require('./admin/bpm/run/Create.vue')), 'big-pages')
				},
				{
					path:  'bpm/run/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/bpm/run/View.vue')), 'big-pages')
				},
				{
					path:  'bpm/project',
					component:  r => require.ensure([], () => r(require('./admin/bpm/project/List.vue')), 'big-pages')
				},
				{
					path:  'bpm/project/create',
					component:  r => require.ensure([], () => r(require('./admin/bpm/project/Create.vue')), 'big-pages')
				},
				{
					path:  'bpm/project/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/bpm/project/Create.vue')), 'big-pages')
				},
				{
					path:  'setting',
					component:  r => require.ensure([], () => r(require('./admin/Setting.vue')), 'big-pages')
				},
				{
					path:  'profile',
					component:  r => require.ensure([], () => r(require('./admin/Profile.vue')), 'big-pages')
				}
			]
		},
		{
			path:'/login',
			component:  r => require.ensure([], () => r(require('./Login.vue')), 'big-pages')
		},
		{
			path:'/password',
			component:  r => require.ensure([], () => r(require('./Password.vue')), 'big-pages')
		},{
			path:'/search',props: true,
			component:  r => require.ensure([], () => r(require('./Search.vue')), 'search'),
		}
	]
});
var axios=window.axios;
var url = new URL(window.location);
var location = window.location;
var token = url.searchParams.get("token");
axios.defaults.baseURL =process.env.VUE_APP_BASE_URL;
 (async function(){
if(token){
	localStorage.setItem('token',token);
	var session={token:token,connected:true,perms:[]};
	axios.defaults.headers.common = {'Authorization': `Bearer `+token};
	const aa=await axios.get('/api/bpm/perms');
	var perm={};
	aa.data.forEach(e=>{
			perm[e.name]=1;
		});
		session.perms=perm;
		localStorage.setItem('session',JSON.stringify(session));
	window.location=location.protocol + '//' + location.host + location.pathname
}

router.beforeEach((to, from, next) => {
	var session = localStorage.getItem('session');
	if(to.path=='/logout'){
		if(session){
			window.$app.session=null;
			window.axios.config={};
			localStorage.removeItem('session');
			
		}
		next('/');
		return;
	}
	if(session)session=JSON.parse(session);
	if (to.path == '/login' && session) {
		next('/admin');
	}else if (to.path !== '/login' && !session) {
		if (to.path == '/register'||to.path == '/password') {
			next();
		}else {
			window.location =axios.defaults.baseURL+'/auth?destiny='+window.location.href;
			// axios.defaults.baseURL+'/login?destiny='+window.location.href;
			//next('/login');
	}
	}else if (to.path == '/') {
		next('/admin');
	}else {
		next();
	}
});

new Vue({
	router,
	render: h => h(App),
	created(){window.$app=this;}
}).$mount('#app')
})();
