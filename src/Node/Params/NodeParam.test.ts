import { NodeParam, getParam, getParamValue, getParamSelection } from "./NodeParam";

const EMPTY_PARAM: NodeParam = {id: 'empty_param', type: 'empty'}
const NUMBER_PARAM: NodeParam = {id: 'number_param', type: 'number', value: 7}
const OPTION_PARAM: NodeParam = {id: 'option_param', type: 'option', selectedField: 'empty_param', fields: [EMPTY_PARAM, NUMBER_PARAM]}
const LIST_PARAM: NodeParam = {id: 'list_param', type: 'list', fields: [EMPTY_PARAM, NUMBER_PARAM]}

/** getParam tests */

// Test whether the root parameter can be found
test('getParam - get the root param - on empty param', () => {
    const actual = getParam(EMPTY_PARAM, 'empty_param');
    const expected = EMPTY_PARAM; 
    expect(actual).toEqual(expected);
})

test('getParam - get the root param - on number param', () => {
    const actual = getParam(NUMBER_PARAM, 'number_param');
    const expected = NUMBER_PARAM; 
    expect(actual).toEqual(expected);
})

test('getParam - get the root param - on list param', () => {
    const actual = getParam(LIST_PARAM, 'list_param');
    const expected = LIST_PARAM; 
    expect(actual).toEqual(expected);
})

test('getParam - get the root param - on option param', () => {
    const actual = getParam(OPTION_PARAM, 'option_param');
    const expected = OPTION_PARAM; 
    expect(actual).toEqual(expected);
})


// Test whether field items can be properly accessed
test('getParam - accessing fields - lists', () => {
    const actual = getParam(LIST_PARAM, 'list_param/empty_param');
    const expected = EMPTY_PARAM; 
    expect(actual).toEqual(expected);
})

test('getParam - accessing fields - options', () => {
    const actual = getParam(OPTION_PARAM, 'option_param/empty_param');
    const expected = EMPTY_PARAM; 
    expect(actual).toEqual(expected);
})


// Test that malformed path strings are not allowed
test('getParam - malformed path - trailing slash', () => {
    const actual = getParam(LIST_PARAM, 'list_param/empty_param/');
    const expected = undefined; 
    expect(actual).toEqual(expected);
})

test('getParam - malformed path - leading slash', () => {
    const actual = getParam(LIST_PARAM, '/list_param/empty_param');
    const expected = undefined; 
    expect(actual).toEqual(expected);
})

test('getParam - malformed path - double slash', () => {
    const actual = getParam(LIST_PARAM, 'list_param//empty_param');
    const expected = undefined; 
    expect(actual).toEqual(expected);
})

test('getParam - malformed path - empty path', () => {
    const actual = getParam(LIST_PARAM, '');
    const expected = undefined; 
    expect(actual).toEqual(expected);
})


// Test that asking for a param that doesn't exist at the given path is not allowed.
test('getParam - param not found - root param', () => {
    const actual = getParam(LIST_PARAM, 'my_fake_root');
    const expected = undefined; 
    expect(actual).toEqual(expected);
})

test('getParam - param not found - subparam', () => {
    const actual = getParam(LIST_PARAM, 'list_param/my_fake_subparam');
    const expected = undefined; 
    expect(actual).toEqual(expected);
})


/** getParamValue tests */

// Test that number params are properly accessed and that their values are correct
test('getParamValue - as root', () => {
    const actual = getParamValue(NUMBER_PARAM, 'number_param');
    const expected = NUMBER_PARAM.value;
    expect(actual).toEqual(expected);
})

test('getParamValue - as subparam', () => {
    const actual = getParamValue(LIST_PARAM, 'list_param/number_param');
    const expected = NUMBER_PARAM.value;
    expect(actual).toEqual(expected);
})


// Test that if a param is not a number param then it cannot be operated on
test('getParamValue - non-number param', () => {
    const actual = getParamValue(OPTION_PARAM, 'option_param');
    const expected = undefined;
    expect(actual).toEqual(expected);
})


/** getParamSelection tests */

// Test with options as root param
test('getParamSelection - root option param', () => {
    const actual = getParamSelection(OPTION_PARAM, 'option_param');
    const expected = EMPTY_PARAM;
    expect(actual).toEqual(expected);
})

// Test that if a param is not an option param then it cannot be operated on
test('getParamSelection - non-option param', () => {
    const actual = getParamSelection(LIST_PARAM, 'list_param/empty_param');
    const expected = undefined;
    expect(actual).toEqual(expected);
})