/**
 * Represents an absolute interval in time.
 * The interval starts at a given time and has
 * a given length, both in unix milliseconds (since epoch).
 * A length of zero represents precision down to a single millisecond.
 */
export default class Timestamp {
    private _start: number
    private _length: number

    public get start() {
        return this._start;
    }

    public get end() {
        return this._start + this._length;
    }

    public get length() {
        return this._length;
    }
    

    /**
     * Convert a string formatted as 'start_end' into a timestamp,
     * where start and end are numbers representing the start and end
     * of the timestamp in unix milliseconds
     * @precondition start <= end
     * @todo Remove this if it is never used.
     * @param timestamp the string to convert
     */
    public static from(start_end: string): Timestamp;


    /**
     * Create a new timestamp that starts on `start` and ends on `end`
     * @precondition length >= 0
     * @param start The start of the timestamp in unix milliseconds
     * @param length The length of the timestamp in unix milliseconds
     */
    public static from(start: number, length: number): Timestamp;


    public static from(startOrString: number | string, length?: number): Timestamp {
        switch(typeof startOrString) {
            case "string":
                const [start, end] = startOrString.split('_').map(value => parseInt(value))
                return new Timestamp(start, end - start)
            case "number":
                return new Timestamp(startOrString, length as number)
        }
    }


    private constructor(start: number, length: number) {
        this._start = start;
        this._length = length;
    }

    /**
     * Return a string representation of this timestamp as 'start_end'.
     */
    public toString(): string {
        return this._start + '_' + this._length;
    }

    /**
     * Return whether the given `timestamp` is contained entirely within this timestamp.
     * @note return true even if the timestamps are equal 
     * @param timestamp the timestamp to compare with
     */
    public contains(timestamp: Timestamp): boolean {
        return this._start <= timestamp._start && timestamp.end <= this.end;
    }
}