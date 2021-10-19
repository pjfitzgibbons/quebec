Vue.component('wbs-table', {
    store: productStore,
    computed: {
        ...Vuex.mapGetters(['visibleTreeSort', 'treeObj'])
    },
    template: `
            <table>
                <thead>
                    <tr>
                        <th colspan="4" >Product List</th>
                    </tr>
                </thead>
                <tbody>    
                    <wbs-row
                            v-for="wbs in visibleTreeSort"
                            v-bind:item="treeObj[wbs]"
                            v-bind:key="wbs"
                    ></wbs-row>
                </tbody>
            </table>`
})
Vue.component('wbs-row', {
    props: ['item'],
    computed: {
        componentType: function () {
            return "row-" + this.item._type.toLowerCase()
        }
    },
    template: `<cmponent :is="componentType" :item="item" ></cmponent>`
})

const collapsedSymbols = {
    [collapsedStates.PLUS]: '&#10133;',
    [collapsedStates.MINUS]: '&#10134;',
    [collapsedStates.NONE]: ''
}
Vue.component('expander-icon', {
    props: ['item'],
    computed: {
        ...Vuex.mapGetters(['wbsExpanded']),
        symbol: function () {
            return collapsedSymbols[ this.wbsExpanded(this.item.wbs) ]
        },
        wbsIndentClass: function () {
            const wbsLevel = this.item.wbs.split('.').length
            return this.item.rollup ? `wbs-expander-indent-${wbsLevel}` : `wbs-indent-${wbsLevel}`
        },
    },
    methods: {
        ...Vuex.mapActions(['toggleExpansion'])
    },
    template: `
        <span class="expander" :class="wbsIndentClass" v-html="symbol" @click="toggleExpansion(item.wbs)"></span>`
})

Vue.component('row-product', {
    props: ['item'],
    computed: {
        ...Vuex.mapGetters(['rollupCost']),
    },
    template: `
        <tr>
            <td>IN P</td>
            <td>{{item.wbs}}</td>
            <td><expander-icon :item="item"></expander-icon>{{item.product}}</td>
            <td class="right-align">{{rollupCost(item)}}</td>
        </tr>`
})

Vue.component('row-program', {
    props: ['item'],
    computed: {
        ...Vuex.mapGetters(['rollupCost']),
    },
    template: `
        <tr>
            <td>IN P</td>
            <td>{{item.wbs}}</td>
            
            <td><expander-icon :item="item"></expander-icon>{{item.product}}</td>
            <td class="right-align">{{rollupCost(item)}}</td>
        </tr>`
})

Vue.component('row-address', {
    props: ['item'],
    store: productStore,
    computed: {
        ...Vuex.mapGetters(['rollupCost']),
    },
    template: `
        <tr>
            <td>IN A</td>
            <td>{{item.wbs}}</td>
            <td><expander-icon :item="item"></expander-icon>{{item.address}}</td>
            <td class="right-align">{{rollupCost(item)}}</td>
        </tr>`
})

Vue.component('row-food', {
    props: ['item'],
    computed: {
        ...Vuex.mapGetters(['rollupCost']),
    },
    template: `
        <tr>
            <td>IN F</td>
            <td>{{item.wbs}}</td>
            <td><expander-icon :item="item"></expander-icon>{{item.food}}</td>
            <td  class="right-align">{{rollupCost(item)}}</td>
        </tr>`
})


var app = new Vue({
    el: '#container',
    store: productStore,
    computed: {
        ...Vuex.mapGetters(['treeSort', 'treeObj'])
    }
})
