
Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>'
})

var app = new Vue({
    el: '#app',
    store: store,
    computed: {
        groceryList () {
            return store.state.groceryList
        }
    }
})
console.log(app)
