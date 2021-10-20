Vue.use(Vuex)

// todo: random costs on Food level
// todo: rollup costs
// todo: randomize "node" rows -- maybe add a level?
// todo: add randomized notes to rows

const _productIdxToId = idx => idx * 1_000_000
const _addressIdxToId = (idx, productId) => productId + (idx * 1000)
const _foodIdxToId = (idx, addressId) => addressId + idx
const _wbs = indexes => [1,...indexes].join('.')

const _generateProductTree = function () {
    const productRange = _randRange(5, 12)
    const treeList = []

    const program = {
        product: faker.company.catchPhrase(),
        expanded: true
    }
    treeList.push({...program, _type: 'Product', wbs: '1', rollup: true})

    _.map(productRange, function (productIdx) {
        const product = {
            productId: _productIdxToId(productIdx),
            product: faker.commerce.productName(),
            cost: 0,
            expanded: true
        }
        treeList.push({ ...product, _type: 'Program',  wbs:  _wbs([productIdx]), rollup: true } )

        const addressRange = _randRange(2, 5)
        _.map(addressRange, function (addressIdx) {
            const _rollup = _.sample([true, false])
            const address = {
                addressId: _addressIdxToId(addressIdx, product.productId),
                address: faker.fake("{{address.streetAddress}}, {{address.city}} {{address.stateAbbr}} {{address.zipCodeByState}}"),
                cost: (!_rollup) ? _randCost() : 0,
                expanded: true
            }

            treeList.push({...address, _type: 'Address', wbs:  _wbs([productIdx, addressIdx]), rollup: _rollup })
            if (_rollup) {
                const foodRange = _randRange(2, 5)
                _.map(foodRange, function (foodIdx) {
                    const food = {
                        foodId: _foodIdxToId(foodIdx, address.addressId),
                        food: faker.commerce.product(),
                        cost: _randCost()
                    }

                    treeList.push({
                        wbs: _wbs([productIdx, addressIdx, foodIdx]),
                        _type: 'Food',
                        ...food,
                        rollup: false
                    })
                })
            }
        })
    })
    const treeObj = _.keyBy(treeList, item => item.wbs)
    const treeSort = _.map(treeList, item => item.wbs)
    return {treeSort, treeObj, currentSelectedWbs: '1'}

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

/* _randCost - random cost values from an arbitrary range */
const _randCost = () => _.round(_.random(1001, 300_000), -2)

const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const collapsedStates = {
    NONE: 'NONE',
    PLUS: 'PLUS',
    MINUS: 'MINUS'
}
const productStore = new Vuex.Store({
    state: {
        count: 0,
        ..._generateProductTree(),
        collapsedWbs: {},
        collapsedDetails: {}
    },
    mutations: {
        increment(state) {
            state.count++
        },
        toggleCollapsedWbs(state, wbs) {
            if (state.collapsedWbs[wbs]) {
                const { [wbs]: undefined, ...newCollapsedWbs } = state.collapsedWbs
                state.collapsedWbs = newCollapsedWbs
            }
            else {
                state.collapsedWbs = {...state.collapsedWbs, [wbs]: wbs}
            }
        },
        setCurrentStateWbs(state, wbs) {
            Vue.set(state, 'currentSelectedWbs', wbs)
        },
        toggleCollapsedDetail(state, name) {
            console.log("toggleCollapsedDetail", {state, name})
            if (state.collapsedDetails[name] === undefined) {
                state.collapsedDetails = {...state.collapsedDetails, [name]: name}
            }
            else {
                const {[name]: undefined, ...newCollapsedDetails} = state.collapsedDetails
                state.collapsedDetails = newCollapsedDetails
            }
        }
    }
    ,
    actions: {
        toggleExpansion({commit}, wbs) {
            commit('toggleCollapsedWbs', wbs)
        },
        selectWbs: ({commit}, wbs) => {
            commit('setCurrentStateWbs', wbs)
        },
        toggleDetailExpansion({commit}, name) {
            commit('toggleCollapsedDetail', name)
        }

    },
    getters: {
        visibleTreeSort (state) {
            // This RegExp will multi-match all the wbs "starting-with" each collapsedWbs
            if (_.size(state.collapsedWbs) === 0) {
                return state.treeSort
            } else {
                const wbsRx = RegExp(_.values(state.collapsedWbs).map(wbs => `^${wbs}\\.`).join('|'))
                return state.treeSort.filter(wbs => !wbs.match(wbsRx))
            }
        },
        treeSort: (state) => state.treeSort,
        treeObj: (state) => state.treeObj,
        rollupCost: (state) => (item) => {
            var cost
            if (item.rollup) {
                const parentRegex = RegExp(`^${item.wbs}\\.`)
                cost = state.treeSort
                    .filter(wbs => wbs.match(parentRegex))
                    .reduce((cost, wbs) => cost + state.treeObj[wbs].cost, 0)
            } else {
                cost = item.cost
            }
            return currencyFmt.format(cost)
        },
        wbsExpanded: (state) => (wbs) => {
            if (state.treeObj[wbs].rollup)
                return  state.collapsedWbs[wbs] ? collapsedStates.MINUS : collapsedStates.PLUS
            else
                return collapsedStates.NONE
        },
        currentItem: (state) => {
            return state.treeObj[state.currentSelectedWbs]
        },
        itemText: (state) => (item) =>  {
            switch (item._type) {
                case 'Program':
                    return item.product
                case 'Product':
                    return item.product
                case 'Address':
                    return item.address
                case 'Food':
                    return item.food
            }
        },
        detailExpanded: (state) => (name) => {
            return !state.collapsedDetails[name]
        }
    }
})

