import { Mesh } from "./mesh.js";
import * as V from "./vector.js";

class Plane {
    static fromPoints( a, b, c ) {
        // TODO - check that a, b, c forms a triangle
        const normal = V.normalize( V.cross( V.sub( b, a ), V.sub( c, a ) ) );
        return new Plane( normal, a );
    }

    constructor( normal, p ) {
        this.normal = normal;
        this.p = p;
    }
}

class Node {
    constructor( front, back ) {
        this.front = front;
        this.back = back;
    }
}

/**
 * @param { Mesh } meshes
 * @returns { Node } root of the BSP tree
 */
export function buildTree( meshes ) {
    return new Node();
}