

Vue.component('wbs-row', {
    props: ['item'],
    computed: {
      componentType: function() {
          return "row-" + this.item._type.toLowerCase()
      }
    },
    template: '<div>' +
        // '<p>{{item}}</p>' +
        '<cmponent :is="componentType" :item="item" ></cmponent>' +
        '</div>'

})

const wbsIndentCssClass = function(wbs) {
    const level = wbs.split('.').count
    return 'wbs-indent-' + level
}

Vue.component('row-product', {
    props: ['item'],
    template: '<div>{{item.wbs}} Product</div>'
})

Vue.component('row-address', {
    props: ['item'],
    template: '<div>{{item.wbs}} Address</div>'
})

Vue.component('row-food', {
    props: ['item'],
    template: '<div>{{item.wbs}} Food</div>'
})


var app = new Vue({
    el: '#app',
    store: store,
    computed: {
        ...Vuex.mapGetters(['treeSort', 'treeObj'])
    }
})
console.log(app)
