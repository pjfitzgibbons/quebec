Vue.component('wbs-table', {
    store: productStore,
    computed: {
        ...Vuex.mapGetters(['visibleTreeSort', 'treeObj'])
    },
    template: `
            <div class="box">
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
                    <tr>
                        <td colspan="4" class="centered">END OF LIST</td>
                    </tr>
                </tbody>
            </table>
            </div>`
})
Vue.component('wbs-row', {
    props: ['item'],
    computed: {
        ...Vuex.mapGetters(['rollupCost', 'itemText', 'currentItem']),
        componentType: function () {
            return "row-" + this.item._type.toLowerCase()
        },
        selected: function() {
            return (this.currentItem == this.item)
        }
    },
    methods: {
        ...Vuex.mapActions(['selectWbs'])
    },
    template: `
        <tr :class="{'selected-row': selected}" @click="selectWbs(item.wbs)">
            <td>IN {{item._type[0]}}</td>
            <td>{{item.wbs}}</td>
            <td><expander-icon :item="item"></expander-icon>{{itemText(item)}}</td>
            <td class="right-align">{{rollupCost(item)}}</td>
        </tr>`
})

const collapsedSymbols = {
    [collapsedStates.PLUS]: '➕',
    [collapsedStates.MINUS]: '➖',
    [collapsedStates.NONE]: ''
}
Vue.component('expander-icon', {
    props: ['item'],
    computed: {
        ...Vuex.mapGetters(['wbsExpanded']),
        symbol: function () {
            return collapsedSymbols[this.wbsExpanded(this.item.wbs)]
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
        <span class="expander" :class="wbsIndentClass" v-html="symbol" @click.stop="toggleExpansion(item.wbs)"></span>`
})

Vue.component('card', {
    props: ['wbs', 'name'],
    computed: {
        ...Vuex.mapGetters(['detailExpanded']),
        expandedIcon: function() {
            return this.detailExpanded(this.name) ? '▼' : '►'
        },
    },
    methods: {
        ...Vuex.mapActions(['toggleDetailExpansion']),
    },
    template: `
        <div class="card" :class="{'container-expanded': detailExpanded(name) }">
            <div class="title card-head">
                <span class="card-head-expander" @click="toggleDetailExpansion(name)" v-html="expandedIcon"></span><slot name="title"></slot>
            </div>
            <transition-expand>
            <div v-if="detailExpanded(name)" class="container">
                <slot></slot>
            </div>
            </transition-expand>
        </div>
        `
})

Vue.component('wbs-detail', {
    computed: {
        ...Vuex.mapGetters({item: 'currentItem', itemText: 'itemText'}),
        componentName() {
            console.log({item: this.item})
            return `${this.item._type.toLowerCase()}-detail`
        }
    },
    template: `
        <div class="box">
            <div class="centered bold">
                <component :is="componentName" :item="item"></component>
            </div>
            <card :wbs="item.wbs" name="detail">
                <template v-slot:title>Detail</template>
                
                <p><span class="bold">Type: </span>{{item._type}}</p>
                <p><span class="bold">Description: </span>{{itemText(item)}}</p>
            </card>
            <card :wbs="item.wbs" name="info">
                <template v-slot:title>Info</template>
                
                <p><span class="bold">WBS: </span>{{item.wbs}}</p>
            </card>
        </div>`
})

Vue.component('program-detail', {
    props: ['item'],
    template: '<span>Program: {{item.product}}</span>'
})

Vue.component('product-detail', {
    props: ['item'],
    template: '<span>Product: {{item.product}}</span>'
})

Vue.component('address-detail', {
    props: ['item'],
    template: '<span>Address: {{item.address}}</span>'
})

Vue.component('food-detail', {
    props: ['item'],
    template: '<span>Food: {{item.food}}</span>'
})

var app = new Vue({
    el: '#container',
    store: productStore,
    computed: {
        ...Vuex.mapGetters(['treeSort', 'treeObj'])
    }
})
