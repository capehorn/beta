// Matrix are repsented in row-major manner
// v'(row) = v(row) * M(row-major) (v, as row vector trasformed by row-major M matrix)
// v'(row) = v(row) * M(row-major) = v(row) * (M(row-major) * M2(row-major)) = (v(row) * M1(row-major)) * M2(row-major)


export const Identity = [
    1, 0, 0, 0, 
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
];

export function mul( a, b ) {
    const [ a11, a12, a13, a14, a21, a22, a23, a24, a31, a32, a33, a34, a41, a42, a43, a44 ] = a;
    const [ b11, b12, b13, b14, b21, b22, b23, b24, b31, b32, b33, b34, b41, b42, b43, b44 ] = b;
    return [
        a11*b11 + a12*b21 + a13*b31 + a14*b41,
        a11*b12 + a12*b22 + a13*b32 + a14*b42,
        a11*b13 + a12*b23 + a13*b33 + a14*b43,
        a11*b14 + a12*b24 + a13*b34 + a14*b44,

        a21*b11 + a22*b21 + a23*b31 + a24*b41,
        a21*b12 + a22*b22 + a23*b32 + a24*b42,
        a21*b13 + a22*b23 + a23*b33 + a24*b43,
        a21*b14 + a22*b24 + a23*b34 + a24*b44,

        a31*b11 + a32*b21 + a33*b31 + a34*b41,
        a31*b12 + a32*b22 + a33*b32 + a34*b42,
        a31*b13 + a32*b23 + a33*b33 + a34*b43,
        a31*b14 + a32*b24 + a33*b34 + a34*b44,

        a41*b11 + a42*b21 + a43*b31 + a44*b41,
        a41*b12 + a42*b22 + a43*b32 + a44*b42,
        a41*b13 + a42*b23 + a43*b33 + a44*b43,
        a41*b14 + a42*b24 + a43*b34 + a44*b44
    ]
}

export function mulVM( v, m ) {
    const [ x, y, z ] = v;
    const [ m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ] = m;
    return [
        x*m11 + y*m21 + z*m31 + m41,
        x*m12 + y*m22 + z*m32 + m42,
        x*m13 + y*m23 + z*m33 + m43,
        x*m14 + y*m24 + z*m34 + m44
    ];
}

export function det( m ) {
    const [ m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ] = m;
    return m11*m22*m33*m44 + m12*m23*m34*m41 + m13*m24*m31*m42 + m14*m21*m32*m43 - m11*m24*m33*m42 - m12*m21*m34*m43 - m13*m22*m31*m44 - m41*m23*m32*m41;
}

export function inverse( m ) {
    const d = det( m );
    const [ m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ] = m;
    return [
        ( m22*m33*m44 + m23*m34*m42 + m24*m32*m43 - m24*m33*m42 - m23*m32*m44 - m22*m34*m43 ) / d,
        ( m14*m33*m42 + m13*m32*m44 + m12*m34*m43 - m12*m33*m44 - m13*m34*m42 - m14*m32*m43 ) / d,
        ( m12*m23*m44 + m13*m24*m42 + m14*m22*m43 - m14*m23*m42 - m13*m22*m44 - m12*m24*m43 ) / d,
        ( m14*m23*m32 + m13*m22*m34 + m12*m24*m33 - m12*m23*m34 - m13*m24*m32 - m14*m22*m33 ) / d,

        ( m24*m33*m41 + m23*m31*m44 + m21*m34*m43 - m21*m33*m44 - m23*m34*m41 - m24*m31*m43 ) / d,
        ( m11*m33*m44 + m13*m34*m41 + m14*m31*m43 - m14*m33*m41 - m13*m31*m44 - m11*m34*m43 ) / d,
        ( m14*m23*m41 + m13*m21*m44 + m11*m24*m43 - m11*m23*m44 - m13*m24*m41 - m14*m21*m43 ) / d,
        ( m11*m23*m34 + m13*m24*m31 + m14*m21*m33 - m14*m23*m31 - m13*m21*m34 - m11*m24*m33 ) / d,

        ( m21*m32*m44 + m22*m34*m41 + m24*m31*m42 - m24*m32*m41 - m22*m31*m44 - m21*m34*m42 ) / d,
        ( m14*m32*m41 + m12*m31*m44 + m11*m34*m42 - m11*m32*m44 - m12*m34*m41 - m14*m31*m42 ) / d,
        ( m11*m22*m44 + m12*m24*m41 + m14*m21*m42 - m14*m22*m41 - m12*m21*m44 - m11*m24*m42 ) / d,
        ( m14*m22*m31 + m12*m21*m34 + m11*m24*m32 - m11*m22*m34 - m12*m24*m31 - m14*m21*m32 ) / d,

        ( m23*m32*m41 + m22*m31*m43 + m21*m33*m42 - m21*m32*m43 - m22*m33*m41 - m23*m31*m42 ) / d,
        ( m11*m32*m43 + m12*m33*m41 + m13*m31*m42 - m13*m32*m41 - m12*m31*m43 - m11*m33*m42 ) / d,
        ( m13*m22*m41 + m12*m21*m43 + m11*m23*m42 - m11*m22*m43 - m12*m23*m41 - m13*m21*m42 ) / d,
        ( m11*m22*m33 + m12*m23*m31 + m13*m21*m32 - m13*m22*m31 - m12*m21*m33 - m11*m23*m32 ) / d
    ];
}

export function toString( m ) {
    return m[ 0 ] + ", " + m [ 1 ] + ", " + m[ 2 ] + ", " + m[ 3 ] + "\n" + 
    m[ 4 ] + ", " + m [ 5 ] + ", " + m[ 6 ] + ", " + m[ 7 ] + "\n" + 
    m[ 8 ] + ", " + m [ 9 ] + ", " + m[ 10 ] + ", " + m[ 11 ] + "\n" + 
    m[ 12 ] + ", " + m [ 13 ] + ", " + m[ 14 ] + ", " + m[ 15 ] + "\n";
}