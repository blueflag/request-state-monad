// @flow

function falsify(obj: Object): Object {
    return Object
        .keys(obj)
        .reduce((rr, ii) => {
            rr[ii] = false;
            return rr;
        }, {});
}

/**
 * Maybe class
 */
class StateFunctor {

    /**
     * Maybe constructor
     *
     * @param {*} value - The value to store
     * @param {boolean} isSome - Whether or not the maybe is `some` or `none`
     * @return {Maybe}
     */
    constructor(value: any, stateBooleans: Object) {
        this.val = value;
        this.value = () => this.val;
        Object
            .keys(stateBooleans)
            .forEach((booleanKey: string) => {
                const stateKey = `is${booleanKey}`;
                this[stateKey] = stateBooleans[booleanKey];

                const unit = (value: *): StateFunctor => {
                    return new StateFunctorFactory(value, {
                        ...falsify(stateBooleans),
                        booleanKey: true
                    });
                };

                const flatMap = (fn: Function): StateFunctor => {
                    return this[stateKey] ? fn(this.val) : this;
                };

                const map = (fn: Function): StateFunctor => {
                    return flatMap(value => unit(fn(value)));
                };


                this[`unit${booleanKey}`] = unit;
                this[`flatMap${booleanKey}`] = flatMap;
                this[`map${booleanKey}`] = map;
            });
    }


}


export function StateFunctorFactory(value: any, stateBooleans: Object): Maybe {
    return new StateFunctor(value, stateBooleans);
}

export function StateFunctorFactoryFactory(stateBooleans: boolean[]): Object {
    return stateBooleans
        .reduce((rr, ii) => {
            const bools = stateBooleans
                .reduce((rr, ii) => {
                    rr[ii] = false;
                    return rr;
                }, {});
            rr[`${ii}State`] = (value) => StateFunctorFactory(value, {...bools, [ii]: true});
            return rr;
        }, {});
}
