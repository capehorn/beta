import { sub, cross } from "./vector.js";

const EPSILON = 1e-5;

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return null if the lines don't intersect
export function lineSegmentIntersection( [ x1, y1 ] = p1 , [ x2, y2 ] = p2, [ x3, y3 ] = p3, [ x4, y4 ] = p4 ) {
    // Check if none of the lines are of length 0
    if ( ( x1 === x2 && y1 === y2 ) || ( x3 === x4 && y3 === y4 ) ) {
        return null;
    }

    const denominator = ( ( y4 - y3 ) * ( x2 - x1 ) - ( x4 - x3 ) * ( y2 - y1 ) );
  
    // Lines are parallel
    if ( Math.abs( denominator ) < EPSILON ) {
        return null;
    }

    const ua = ( ( x4 - x3 ) * ( y1 - y3 ) - ( y4 - y3 ) * ( x1 - x3 ) ) / denominator;
    const ub = ( ( x2 - x1 ) * ( y1 - y3 ) - ( y2 - y1 ) * ( x1 - x3 ) ) / denominator;
  
    // is the intersection along the segments
    if ( ua < 0 || ua > 1 || ub < 0 || ub > 1 ) {
        return null;
    }
  
    // Return a object with the x and y coordinates of the intersection
    return [ x1 + ua * ( x2 - x1 ), y1 + ua * ( y2 - y1 ) ];
}

/**
 * Line intersection where each line defined by two-two of its point (p1-p2 and p3-p4)
 * @param {*} param0 
 * @param {*} param1 
 * @param {*} param2 
 * @param {*} param3 
 * @returns 
 */
export function lineIntersection( [ x1, y1 ] = p1 , [ x2, y2 ] = p2, [ x3, y3 ] = p3, [ x4, y4 ] = p4 ) {
    const dx12 = x1 - x2;
    const dx34 = x3 - x4;
    const dy12 = y1 - y2;
    const dy34 = y3 - y4;
    const denom = dx12 * dy34 - dy12 * dx34;
    if ( denom < EPSILON ) {
        return undefined;
    }
    const x = ( ( ( x1 * y2 - y1 * x2 ) * dx34 ) - ( dx12 * ( x3 * y4 - y3 * x4 ) ) ) / denom;
    const y = ( ( ( x1 * y2 - y1 * x2 ) * dy34 ) - ( dy12 * ( x3 * y4 - y3 * x4 ) ) ) / denom;
    return [ x, y ];
}

export function polygonNormal( points ) {
    const a = points[ 0 ];
    const b = points[ 1 ];
    const c = points[ points.length - 1 ];
    return cross( sub( b, a ), sub( c, a ) );
}

export function polygonCentroid( points ) {
    const { A, x, y } = points.reduce( 
        ( { A, x, y }, p, i, arr ) => {
            let j = i < arr.length - 1 ? i + 1 : 0;
            let m =  p[ 0 ] * arr[ j ][ 1 ];
            let n =  arr[ j ][ 0 ] * p[ 1 ];
            return { 
                A: A + ( m - n ),
                x: x + ( ( p[ 0 ] + arr[ j ][ 0 ] ) * ( m - n ) ),
                y: y + ( ( p[ 1 ] + arr[ j ][ 1 ] ) * ( m - n ) )
            }; 
        }, { A: 0, x: 0, y: 0 } );
    return [ x / ( 3 * A ), y / ( 3 * A ) ];
}

function dist2d( dx, dy ) {
    return Math.sqrt( dx * dx + dy * dy );
}

/**
 * 2D
 * ray-casting algorithm based on
 * https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
 */
function isInside( [ x, y ] = p, vs ) {
    let inside = false;
    for ( let i = 0, j = vs.length - 1; i < vs.length; j = i++ ) {
        let xi = vs[ i ][ 0 ], yi = vs[ i ][ 1 ];
        let xj = vs[ j ][ 0 ], yj = vs[ j ][ 1 ];

        if ( ( ( yi > y ) != ( yj > y ) ) && ( x < ( xj - xi ) * ( y - yi ) / ( yj - yi ) + xi ) ) {
            inside = !inside;
        }
    }
    return inside;
}

/**
 * 2D
 * Weiler-Atherton polygon clipping algorithm
 * https://www.geeksforgeeks.org/weiler-atherton-polygon-clipping-algorithm/
 */
function polygonClipping( cvs, vs ) {
    for ( let ci = 0, cj = cvs.length - 1; ci < cvs.length; cj = ci++ ) {
        for ( let i = 0, j = vs.length - 1; i < vs.length; j = i++ ) {
            const intersection = lineSegmentIntersection( cvs[ ci ], cvs[ cj ], vs[ i ], vs[ j ] );
            console.log( intersection );
        }
    }
}


// export function lineSegmentIntersection( [ x1, y1 ] = p1 , [ x2, y2 ] = p2, [ x3, y3 ] = p3, [ x4, y4 ] = p4 ) {
//     const dx12 = x1 - x2;
//     const dx34 = x3 - x4;
//     const dy12 = y1 - y2;
//     const dy34 = y3 - y4;
//     const denom = dx12 * dy34 - dy12 * dx34;
//     if ( Math.abs( denom ) < EPSILON ) {
//         return undefined;
//     }
//     const x = ( ( ( x1 * y2 - y1 * x2 ) * dx34 ) - ( dx12 * ( x3 * y4 - y3 * x4 ) ) ) / denom;
//     const y = ( ( ( x1 * y2 - y1 * x2 ) * dy34 ) - ( dy12 * ( x3 * y4 - y3 * x4 ) ) ) / denom;
    
//     const d1 = dist2d( x1 - x, y1 - y );
//     const d2 = dist2d( x2 - x, y2 - y );
//     const d12 = dist2d( dx12, dy12 );

//     const d3 = dist2d( x3 - x, y3 - y );
//     const d4 = dist2d( x4 - x, y4 - y );
//     const d34 = dist2d( dx34, dy34 );

//     if ( ( (d1 + d2 - d12) < EPSILON ) && ( (d3 + d4 - d34) < EPSILON ) ) {
//         return [ x, y ];
//     }
//     return undefined;
// }
