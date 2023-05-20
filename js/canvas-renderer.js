import { Transform } from "./transform.js";
import { Camera } from "./camera.js";
import { lineSegmentIntersection, polygonCentroid } from "./geom.js";
import * as M from "./matrix.js";

export class CanvasRenderer {
    constructor( canvas, scene, camera = Camera.isometric() ) {
        this.canvas = canvas;
        this.scene = scene;
        this.camera = camera;
        this.ctx = this.canvas.getContext("2d");
        //this.ctx.transform(1, 0, 0, -1, 400, 400);
        this.ctx.font = "10px monospace";
        this.showAxis = true;
        
        // this.#coordTrf = [ 
        //     1, 0, 0, 0,
        //     0, -1, 0, 0,
        //     0, 0, 1, 0,
        //     400, 400, 0, 1
        // ];
        //console.log( this.camera.m );

    }

    render() {
        const ctx = this.ctx;
        ctx.strokeStyle = "rgb(32, 45, 21)";
        ctx.fillStyle = "rgba(32, 45, 21, 0.4)";
        this.#drawMeshes( ctx );
    }

    get showAxis( ) {
        return this.showAxis;
    }

    set showAxis( show = true ) {
        if ( show ) {
            const AXIS_LENGTH = 1000;
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "blue";
            this.#drawLine( this.ctx, this.#trf( [ 0, 0, 0 ] ), this.#trf( [ AXIS_LENGTH, 0, 0 ] ) );
            this.ctx.strokeStyle = "green";
            this.#drawLine( this.ctx, this.#trf( [ 0, 0, 0 ] ), this.#trf( [ 0, AXIS_LENGTH, 0 ] ) );
            this.ctx.strokeStyle = "red";
            this.#drawLine( this.ctx, this.#trf( [ 0, 0, 0 ] ), this.#trf( [ 0, 0, AXIS_LENGTH ] ) );
        }
    }

    #trf( v ) {
        const coordTrf = [ 
            1, 0, 0, 0,
            0, -1, 0, 0,
            0, 0, 1, 0,
            400, 400, 0, 1
        ];
        const trf = new Transform( M.mul( this.camera.m, coordTrf ) );
        return trf.apply( v );
    }

    #drawLine( ctx, p, q ) {
        ctx.beginPath();
        ctx.moveTo( p[ 0 ], p[ 1 ] );
        ctx.lineTo( q[ 0 ], q[ 1 ] );
        ctx.stroke();
    }

    #drawRect( ctx, [ x, y ] = v, w = 10, h = 10, fillStyle = "green" ) {
        ctx.fillStyle = fillStyle;
        ctx.fillRect( x - w / 2, y - h / 2, w, h );
    }

    #drawCoordinate( ctx, p, pWorld ) {
        ctx.save();
        ctx.fillText("[" + pWorld[ 0 ].toFixed( 0 ) + " " + pWorld[ 1 ].toFixed( 0 ) + " " + pWorld[ 2 ].toFixed( 0 ) +  "]", p[ 0 ] - 5, p[ 1 ] - 5 );
        ctx.fillText("[" + p[ 0 ].toFixed( 0 ) + " " + p[ 1 ].toFixed( 0 ) + "]", p[ 0 ] + 5, p[ 1 ] + 5 );
        ctx.restore();
    }

    #drawPolygon( ctx, vs, fillStyle = "rgba( 128, 0, 0, .5 )" ) {
        const path = new Path2D();
        for ( let i = 0, j = vs.length - 1; i < vs.length; j = i++ ) {
            path.moveTo( vs[ i ] );
            path.lineTo( vs[ j ] );
        }
        ctx.fillStyle = fillStyle;
        ctx.fill( path );
    }

    #drawMeshes( ctx ) {
        const segments = [];

        for ( let mesh of this.scene.meshes ) {
            const ps = mesh.vertices.map( p => this.#trf( p ) );
            if ( mesh.faces && 0 < mesh.faces.length ) {
                let facePoints = [];
                for ( let f of mesh.faces ) {
                    f.forEach( ( pIdx, i ) => {
                        const qIdx = i < f.length - 1 ? f[ i + 1 ] : f[ 0 ];
                        const startPoint = ps[ pIdx ];
                        const endPoint = ps[ qIdx ];
                        segments.push( [ startPoint, endPoint ] );
                        facePoints.push( startPoint );
                    });
                    const pc = polygonCentroid( facePoints );
                    this.#drawRect( ctx, pc, 8, 8, "purple" );
                    facePoints = [];
                }
            } else {
                for ( let i = 0; i < ps.length - 1; i++ ) {
                    const startPoint = ps[ i ];
                    const endPoint = ps[ i + 1 ];
                    segments.push( [ startPoint, endPoint ] );
                }
            }

            this.#drawMesh( ctx, mesh );
        }

        // draw markers at segment intersection
        segments.forEach( ( s, i ) => {
            segments.forEach( ( os, j ) => {
                if ( i < j ) {
                    const intersection = lineSegmentIntersection( s[ 0 ], s[ 1 ], os[ 0 ], os[ 1 ] );
                    if ( !! intersection ) {
                        this.#drawRect( ctx, intersection, 6, 6, "blue" );
                    }
                }   
            });
        });
    }

    #drawMesh( ctx, mesh ) {
        ctx.fillStyle = "rgba( 0, 255, 255, .3 )";
        const ps = mesh.vertices.map( p => this.#trf( p ) );
        if ( mesh.faces && 0 < mesh.faces.length ) {
            for ( let f of mesh.faces ) {
                const path = new Path2D();
                f.forEach( ( pIdx, i ) => {
                    const qIdx = i < f.length - 1 ? f[ i + 1 ] : f[ 0 ];
                    const startPoint = ps[ pIdx ];
                    const endPoint = ps[ qIdx ];

                    if ( i === 0 ) {
                        path.moveTo( startPoint[ 0 ], startPoint[ 1 ] );
                    } else if ( i < f.length - 1 ) {
                        path.lineTo( startPoint[ 0 ], startPoint[ 1 ] );
                    } else {
                        path.lineTo( startPoint[ 0 ], startPoint[ 1 ] );
                        path.closePath();
                        ctx.fill( path );
                    }

                    this.#drawLine( ctx, startPoint, endPoint );
                } );
            }
        } else {
            for ( let i = 0; i < ps.length - 1; i++ ) {
                const startPoint = ps[ i ];
                const endPoint = ps[ i + 1 ];
                this.#drawLine( ctx, startPoint, endPoint );
            }
        }
        // draw markers at line endings and coordinates
        ps.forEach( ( p, i ) => { 
            this.#drawRect( ctx, p, 10, 10, "red" ); 
            this.#drawCoordinate( ctx, p, mesh.vertices[ i ] ); 
        } );
    }
}
