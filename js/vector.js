export const EX = [ 1, 0, 0, 1 ];
export const EY = [ 0, 1, 0, 1 ];
export const EZ = [ 0, 0, 1, 1 ];

export function normalize( v ) {
    const [ x, y, z, w = 1 ] = v;
    const r = 1 / Math.sqrt( x * x + y * y + z * z );
	return [ r * x, r * y, r * z, w ];
}

export function negate( v ) {
    return [ -v[ 0 ], -v[ 1 ], -v[ 2 ], 1 ];
}

export function length( v ) {
    const [ x, y, z ] = v;
	return Math.sqrt(x * x + y * y + z * z );
}

export function add( a, b ) {
    return [ a[ 0 ] + b[ 0 ], a[ 1 ] + b[ 1 ], a[ 2 ] + b[ 2 ], 1 ];
}

export function sub( a, b ) {
    return [ a[ 0 ] - b[ 0 ], a[ 1 ] - b[ 1 ], a[ 2 ] - b[ 2 ], 1 ];
}

export function dot( a, b ) {
    return a[ 0 ] * b[ 0 ] + a[ 1 ] * b[ 1 ] + a[ 2 ] * b[ 2 ];
}

export function cross( a, b ) {
    return [
        a[ 1 ] * b[ 2 ] - a[ 2 ] * b[ 1 ],
        a[ 2 ] * b[ 0 ] - a[ 0 ] * b[ 2 ],
        a[ 0 ] * b[ 1 ] - a[ 1 ] * b[ 0 ],
        1
    ]
}
