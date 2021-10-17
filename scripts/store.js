console.log("Store.js")
Vue.use(Vuex)

// todo: random costs on Food level
// todo: rollup costs
// todo: randomize "node" rows -- maybe add a level?
// todo: add randomized notes to rows

const _productIdxToId = idx => idx * 1_000_000
const _addressIdxToId = (idx, productId) => productId + (idx * 1000)
const _foodIdxToId = (idx, addressId) => addressId + idx
const _wbs = indexes => indexes.join('.')

const _generateProductTree = function () {
    const productRange = _randRange(5, 12)
    const treeList = []

    _.map(productRange, function (productIdx) {
        const product = {
            productId: _productIdxToId(productIdx),
            product: faker.commerce.productName(),
        }
        treeList.push({ ...product, _type: 'Product',  wbs:  _wbs([productIdx]), rollup: true } )

        const addressRange = _randRange(2, 5)
        _.map(addressRange, function (addressIdx) {
            const address = {
                addressId: _addressIdxToId(addressIdx),
                address: faker.fake("{{address.streetAddress}}, {{address.city}} {{address.stateAbbr}} {{address.zipCodeByState}}"),
            }
            treeList.push({...address, _type: 'Address', wbs:  _wbs([productIdx, addressIdx]), rollup: true })

            const foodRange = _randRange(2, 5)
            _.map(foodRange, function (foodIdx) {
                const food = {
                    foodId: _foodIdxToId(foodIdx),
                    desc: faker.commerce.product()
                }

                treeList.push({
                    wbs: _wbs([productIdx, addressIdx, foodIdx]),
                    _type: 'Food',
                    ...food,
                    rollup: false
                })
            })
        })
    })
    const treeObj = _.keyBy(treeList, item => item.wbs)
    const treeSort = _.map(treeList, item => item.wbs)
    return {treeSort, treeObj}

}
/* _randRange - range from lower to random upper-range
    mid - lower-limit of upper
    upper - upper-limit of upper

    lower limit is always one

    Example : _randRange(5, 12)
    => [0, 1, 2, 3, 4, 5, 6, 7, 8]
 */
const _randRange = function (mid, upper) {
    const lower = 1
    const rangeUpper = _.random(mid, upper)
    return _.range(lower, rangeUpper)
}

const store = new Vuex.Store({
    state: {
        count: 0,
        ..._generateProductTree()
    },
    mutations: {
        increment(state) {
            state.count++
        }
    },
    getters: {
        treeSort: (state) => state.treeSort,
        treeObj: (state) => state.treeObj
    }
})

console.log(_generateProductTree())
