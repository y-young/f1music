/**
 * Index
 */
var component = Vue.extend({
	mixins: [main]
})
var page = new component();
page.$mount('.app');