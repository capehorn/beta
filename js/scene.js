import { Mesh } from "./mesh.js";
import * as V from "./vector.js";
import { range } from "./utils.js";

export class Scene {
    constructor( meshes = [] ) {
        this.meshes = meshes;
    }

    addMesh( mesh ) {
        this.meshes.push( mesh );
    }

    edit() {
        return new Editor( this.meshes );
    }
}

class Editor {
    constructor( meshes ) {
        this.meshes = meshes;
        this.selection = [];
        this.selectActive = false;
    }

    addPolyline( points ) {
        this.meshes.push( { points, faces: [] } );
        if ( this.selectActive ) {
            this.selection.push( { m: this.meshes.length - 1, f: [ 0 ] } );
        }
    }
    
    addPlanarPolygon( vertices, holes = undefined ) {
        this.meshes.push( new Mesh( vertices, [ range( 0, vertices.length - 1 ) ] ) );
        if ( this.selectActive ) {
            this.selection.push( { m: this.meshes.length - 1, f: [ 0 ] } );
        }
    }

    extrudeBy( v ) {
        if ( this.anySelected() ) {
            for ( const sel of this.selection ) {
                const { m, f, p } = sel;
                const mesh = this.meshes[ m ];
                for ( const fIdx of f ) {
                    const face = mesh.faces[ fIdx ];
                    const eps = face.map( pIdx => V.add( mesh.vertices[ pIdx ], v ) );
                    const pointsLength = mesh.vertices.push( ...eps );
                    const epsFace = range( pointsLength - face.length, pointsLength - 1 );
                    mesh.faces.push( epsFace );
                    mesh.faces.push( ...genFaces( face, epsFace, true ) );
                    if ( this.selectActive ) {
                        console.log( " TODO: handle select " );
                    } else {
                        console.log( " TODO: handle select " );
                    }
                }
            }
        }
    }

    selectOn() {
        this.selectActive = true;
    }

    selectOff() {
        this.selectActive = false;
    }

    selectClear() {
        this.selection = [];
    }

    anySelected() {
        return this.selection.length !== 0;
    }

    // selection = [ 
    //     { m: meshIdx, f: [ faceIdx1, faceIdx2 ], p: [ pIdx, pIdx ] }, 
    //     { m: ... } 
    // ]; 
}

function genFaces( ps, qs, closed = false ) {
    const faces = [];
    for ( let i = 0; i < ps.length - 1; i++ ) {
        faces.push( [ ps[ i ], ps[ i + 1 ], qs[ i + 1 ], qs [ i ] ] );
    }
    if ( closed ) {
        faces.push( [ ps[ ps.length - 1 ], ps[ 0 ], qs[ 0 ], qs [ ps.length - 1 ] ] );
    }
    return faces;
}