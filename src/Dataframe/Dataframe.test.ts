import Dataframe from './Dataframe';

const SAMPLE_DATA = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 5,
    5: 7,
    6: 9,
};

type algebraic = {tag: 'exists', 'closing': number, 'opening': number} | {tag: 'doesNotExist'}
const SAMPLE_ALGEBRAIC_DATA: Record<string, algebraic> = {
    0: {tag: 'doesNotExist'},
    1: {tag: 'exists', 'closing': 0, 'opening': 1},
    2: {tag: 'exists', 'closing': 3, 'opening': 1},
    3: {tag: 'doesNotExist'},
    4: {tag: 'exists', 'closing': 3, 'opening': 4},
    5: {tag: 'exists', 'closing': 2, 'opening': 4},
    6: {tag: 'doesNotExist'},
};

const dataframe = Dataframe.from(SAMPLE_DATA);
const algebraicDataframe = Dataframe.from(SAMPLE_ALGEBRAIC_DATA);

test('find length of dataframe', () => {
    const actual = dataframe.length;
    const expected = Object.entries(SAMPLE_DATA).length;
    expect(actual).toEqual(expected);
});

test('map dataframe', () => {
    const sample_map = (entry: [number, number]) => entry[1] + 1;
    const SAMPLE_MAP_DATA = {
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        4: 6,
        5: 8,
        6: 10,
    };

    const actual = dataframe.map(sample_map).toObject();
    const expected = SAMPLE_MAP_DATA;
    expect(actual).toEqual(expected);
})

test('from list', () => {
    const actual = (Dataframe.from(Object.values(SAMPLE_DATA))).toObject();
    const expected = SAMPLE_DATA;

    expect(actual).toEqual(expected);
})

test('rolling map dataframe', () => {
    const sample_rolling_map = ([key, value]: [number, number], dataframe: Dataframe<number>) => value + (dataframe.atIndex(1) as number + (dataframe.atIndex(2) as number));
    const SAMPLE_ROLLING_MAP_DATA = {
        0: 3,
        1: 6,
        2: 10,
        3: 15,
        4: 21,
    };

    const actual = dataframe.map(sample_rolling_map, 3).toObject();
    const expected = SAMPLE_ROLLING_MAP_DATA;
    expect(actual).toEqual(expected);
})

test('reduce dataframe', () => {
    const sample_reduce = (previousValue: number, [_, currentValue]: [number, number]) => previousValue + currentValue;
    const SAMPLE_REDUCE_DATA = 27;

    const actual = dataframe.reduce(sample_reduce, 0);
    const expected = SAMPLE_REDUCE_DATA;
    expect(actual).toEqual(expected);
})

test('intersect dataframes', () => {

    const SAMPLE_INTERSECT_DATA_A = {
        0: 1,
        1: 2,
        2: 3
    }
    const SAMPLE_INTERSECT_DATA_B = {
        0: 4,
        1: 5,
        3: 6
    }

    const actual = Dataframe.intersect(
        Dataframe.from(SAMPLE_INTERSECT_DATA_A), 
        Dataframe.from(SAMPLE_INTERSECT_DATA_B)
    ).toObject();
    const expected = {0: [1, 4], 1: [2, 5]};
    expect(actual).toEqual(expected)



})

test('create algebraic dataframe', () => {
    const sample_algebraic_map = ([_, value]: [number, algebraic]) => {
        switch(value.tag) {
            case 'exists':
                return value.closing - value.opening
            case 'doesNotExist':
                return 0
        }
    }
    const SAMPLE_ALGEBRAIC_MAP_DATA: Record<number, number> = {
        0: 0,
        1: -1,
        2: 2,
        3: 0,
        4: -1,
        5: -2,
        6: 0,
    };

    const actual = algebraicDataframe.map(sample_algebraic_map).toObject();
    const expected = SAMPLE_ALGEBRAIC_MAP_DATA
    expect(actual).toEqual(expected)
})