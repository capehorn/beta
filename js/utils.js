
export function range( first, last ) {
    const incr = first < last;
    return Array.from( { length: Math.abs( first - last ) + 1 }, (v, idx) => first + ( incr ? idx : -idx ) );
}