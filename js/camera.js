import { Transform } from "./transform.js";


export class Camera {
    constructor( m ) {
        this.m = m;
    }

    static isometric() {
        const ISOMETRIC_ALPHA = -45;
        const ISOMETRIC_BETA = 35.264390; // arcsin( 1 / sqrt(3) )
        const v = new Transform().rotate( [ 0, 1, 0 ], -ISOMETRIC_ALPHA ).apply( [ 1, 0 , 0] );
        const m = new Transform().rotate( [ 0, 1, 0 ], ISOMETRIC_ALPHA ).rotate( v , ISOMETRIC_BETA ).m;
        return new Camera( m );
    }

    static dimetric() {

    }

    static trimetric() {

    }
}

// export function orthogonal( left, right, bottom, top, near, far ) {
//     return {
//         m : [
//             // 1, 0, 0, 400,
//             // 0, -1, 0, 400,
//             // 0, 0, 1, 0,
//             // 0, 0, 0, 1
//             1, 0, 0, 0,
//             0, 1, 0, 0,
//             0, 0, 1, 0,
//             0, 0, 0, 1
//         ],
//         // m: [ 
//         //     2 / ( right - left ), 0, 0, - ( right + left ) / ( right - left ),
//         //     0, 2 / ( top - bottom ), 0, - ( top + bottom ) / ( top - bottom ),
//         //     0, 0, - 2 / ( far - near ), - ( far + near ) / ( far - near ),
//         //     0, 0, 0, 1
//         //  ],
//         pos: [],
//         lookAt: [],
//         up: []
//     }
// }
