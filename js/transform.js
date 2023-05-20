import * as V from "./vector.js";
import * as M from "./matrix.js";

const PI = 3.14159265;
const D2R = 0.0174533;

export class Transform {
    constructor( m = M.Identity ) {
        this.m = m;   
    }

    static T( v ) {
        return [
            1, 0, 0, v[ 0 ], 
            0, 1, 0, v[ 1 ],
            0, 0, 1, v[ 2 ],
            0, 0, 0, 1
        ];
    }

    static S( v ) {
        return [
            v[ 0 ], 0, 0, 0, 
            0, v[ 1 ], 0, 0,
            0, 0, v[ 2 ], 0,
            0, 0, 0, 1
        ];
    }

    static R( v, a ) {
        v = V.normalize( v );
        const s = Math.sin( a * D2R );
        const c = Math.cos( a * D2R );
        const m = 1 - c;
        const [ x, y, z ] = v;
        return [
            m*x*x + c, m*x*y + z*s, m*z*x - y*s, 0,
            m*x*y - z*s, m*y*y + c, m*y*z + x*s, 0,
            m*z*x + y*s, m*y*z - x*s, m*z*z + c, 0,
            0, 0, 0, 1 
        ];
    }
    

    translate( v ) {
        this.m = M.mul( Transform.T( v ), this.m );
        return this;
    }
    
    scale( v ) {
        this.m = M.mul( Transform.S( v ), this.m );
        return this;
    }

    rotate( v, a ) {
        this.m = M.mul( Transform.R( v, a ), this.m );
        return this;
    }

    apply( v ) {
        return M.mulVM( v, this.m );
    }

}

