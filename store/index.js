import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default function createStore () {
    return new Vuex.Store({
        state: {
            coin: {
                name: '',
                supply: 0 || null,
                crr: 0 || null,
                reserve: 0 || null,
            },
            coinIsMinted: false,
        },
        actions,
        mutations,
        getters,
    })
}
