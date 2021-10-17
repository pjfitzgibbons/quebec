console.log("Store.js")
Vue.use(Vuex)

const generateGroceries = function() {
    console.log("generateGroceries")
    return _.map(_.range(3),
        function(i) {
            console.log(i)
            return {id: i, text: faker.commerce.product() }
        })

}
const store = new Vuex.Store({
    state: {
        count: 0,
        groceryList: generateGroceries()
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})
