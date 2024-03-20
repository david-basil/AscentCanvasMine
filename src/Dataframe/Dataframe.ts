 /**
 * Represents a table of data
 * 
 * @note the types of data held within can be anything.
 * This allows us to extend dataframes to algebraic data.
 * @note currently you cannot access dataframe keys. This is deliberate.
 * Any kind of accessing of keys must be exposed by subclasses.
 * 
 */
export default class Dataframe<V> {
    protected data: Record<number, V>;

    get length(): number {
        return Object.entries(this.data).length;
    }

    get width(): number | undefined {
        if(this.length === 0) return undefined;
        const exampleValue = Object.values(this.data).at(0);
        if(!Array.isArray(exampleValue)) return undefined

        return exampleValue.length;
    }

    public isArrayValued() {
        return this.width !== undefined;
    }


    public static from<V>(data: Array<V>): Dataframe<V>;
    public static from<V>(data: Record<number, V>): Dataframe<V>;

    public static from<V>(data: Record<number, V> | Array<V>) {
        if (Array.isArray(data)) {
            return new Dataframe(Object.fromEntries(data.map((value, index) => [index, value])))
        } else {
            return new Dataframe(data)
        }
    }

    protected constructor(data: Record<number, V>) {
        this.data = data;
    }
    
    /**
     * Return a new dataframe by slicing this dataframe from `start` to
     * `end`.
     * @param start The index to start the slice at
     * @param end The index to end the slice at
     */
    public slice(start?: number, end?: number): Dataframe<V> {
        return new Dataframe(Object.fromEntries(
            Object.entries(this.data) 
            .slice(start, end)
        ))
    }

    /**
     * precondition: center < windowSize
     * @param callbackfn Transforms the given value to a new value.
     * The dataframe is of size windowSize centered at the given value 
     * with relative index center. I.e.
     * dataframe.at(center) = value
     * dataframe.length = windowSize
     * @param windowSize The size of the rolling window. This is a single element
     * by default.
     * @param center The index that the current value appears at in the rolling
     * dataframe. This is the first element by default
     */
    public map<S>(
        callbackfn: ([key, value]: [number, V], dataframe: Dataframe<V>) => S,
        windowSize: number = 1,
        center: number = 0
    ): Dataframe<S> {
        return new Dataframe(Object.fromEntries(
            Object.entries(this.data)
            .slice(center, this.length + 1 + center - windowSize)
            .map(([key, value], index) => 
                [
                    key, 
                    callbackfn(
                        [parseInt(key), value],
                        this.slice(
                            index,
                            index + windowSize
                        )
                    )
                ])
        ))
    }

    /**
     * Call the specified callback function for all the elements
     * in the dataframe. The return value of the callback function 
     * is the accumulated result, and is provided as an argument 
     * in the next call to the callback function.
     * @param callbackfn A function that accepts two arguments. 
     * The reduce method calls the callbackfn function one time for 
     * each element in the dataframe.
     * @param initialValue The initial value to start the 
     * accumulation. The first call to the callbackfn 
     * function provides this value as an argument. 
     */
    public reduce<S>(
        callbackfn: (
            previousValue: S,
            [currentKey, currentValue]: [number, V],
        ) => S,
        initialValue: S
    ): S {
        return Object.entries(this.data)
            .reduce<S>(
                (
                    previousValue: S, 
                    [currentKey, currentValue]: [string, V]
                ) => callbackfn(previousValue, [parseInt(currentKey), currentValue]),
                initialValue
            )
    }

    /**
     * Return the rolling result of applying `func` to every
     * `rollingWindow` sized window of this dataframe.
     *      rollingWindow > 0
     *      rollingCenter < rollingWindow
     * @param func The function to apply over each window
     * @param rollingWindow The size of the rolling window,
     * in indices.
     * @param rollingCenter How to cut off the original data.
     * A center of 0 will remove the last `rollingWindow` keys, a
     * center of `rollingWindow` will remove the first `rollingWindow`
     * keys, and a center of `rollingWindow / 2` will remove half from
     * the front and half from the back.
     */
    roll<R>(
        func: (param: Dataframe<V>) => R,
        rollingWindow: number,
        rollingCenter: number,
    ): Dataframe<R> {
        return (
            this
            .map((_, rollingFrame) =>
                func(rollingFrame),
                rollingWindow, rollingCenter 
    ) ) }

    /**
     * Remove every key in this dataframe that is not found in `other`.
     * This ensures that the two dataframes share exactly the same keys,
     * and thus can be compared.
     * @param other the dataframe whose keys we should match
     */
    protected alignByForceWith(other: Dataframe<any>) {
        const otherKeys = Object.keys(other.data)
        return new Dataframe(Object.fromEntries(
            Object.entries(this.data)
            .filter(([key, _]) => otherKeys.includes(key))
        ))
    }

    /**
     * Return a single dataframe that contains only keys that are shared
     * between `dataA` and `dataB`
     * The value of the dataframe at each point is a tuple of A and B
     */
    public static intersect<A, B>(
        dataA: Dataframe<A>, 
        dataB: Dataframe<B>
    ): Dataframe<[A, B]> {
        const [alignedA, alignedB] = [
            dataA.alignByForceWith(dataB), 
            dataB.alignByForceWith(dataA)
        ]
        return new Dataframe(Object.fromEntries(
            Object.keys(alignedA.data)
            .map((key) => [
                key, 
                [
                    alignedA.atKey(key) as A, 
                    alignedB.atKey(key) as B,
                ]
    ])))}

    /**
     * Split a dataframe of arrays of values into an array of dataframes
     * of values.
     */
    public static split<S>(
        dataframe: Dataframe<S[]>
    ): Dataframe<S>[] {
        if(dataframe.width === undefined) return [dataframe as Dataframe<S>]

        let result = Array.from(Array(dataframe.width), () => Object.create({}))
        Object.entries(dataframe.data).forEach(
            ([key, values]) => {
                values.forEach(
                    (value, index) => result[index][key] = value
                )
            }
        )
        return result.map((data) => new Dataframe(data));
    }

    /**
     * Return a plain old javascript object representing this dataframe
     */
    public toObject(): Record<number, V> {
        /**
         * @todo: I use the calls to object to ensure this is a copy. Is
         * this necessary? Is it even working?
         */
        return Object.fromEntries(Object.entries(this.data))
    }

    /**
     * Return the item specified at the given index
     * @param index The zero-based index of the desired entry. 
     * A negative index will count back from the last item.
     */
    public atIndex(index: number) : V | undefined {
        return Object.values(this.data).at(index)
    }
    /**
     * 
     */
    public atKey(key: string | number) : V | undefined {
        switch(typeof key) {
            case "string":
                return this.data[parseInt(key)]
            case "number":
                return this.data[key]
        }
    }

    /**
     * @todo is this necessary? any alternatives?
     */
    public indexFromKey(key: string | number) : number {
        return Object.keys(this.data).findIndex((value) => value === key.toString())
    }

}