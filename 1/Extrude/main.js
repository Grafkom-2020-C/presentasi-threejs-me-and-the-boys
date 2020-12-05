import {
    BoxGeometry, BoxBufferGeometry,
    BufferGeometry,
    CircleGeometry, CircleBufferGeometry,
    Color,
    ConeGeometry, ConeBufferGeometry,
    Curve,
    CylinderGeometry, CylinderBufferGeometry,
    DodecahedronGeometry, DodecahedronBufferGeometry,
    DoubleSide,
    ExtrudeGeometry, ExtrudeBufferGeometry,
    Float32BufferAttribute,
    FontLoader,
    Group,
    IcosahedronGeometry, IcosahedronBufferGeometry,
    LatheGeometry, LatheBufferGeometry,
    LineSegments,
    LineBasicMaterial,
    Mesh,
    MeshPhongMaterial,
    OctahedronGeometry, OctahedronBufferGeometry,
    ParametricGeometry, ParametricBufferGeometry,
    PerspectiveCamera,
    PlaneGeometry, PlaneBufferGeometry,
    PointLight,
    RingGeometry, RingBufferGeometry,
    Scene,
    Shape,
    ShapeGeometry, ShapeBufferGeometry,
    SphereGeometry, SphereBufferGeometry,
    TetrahedronGeometry, TetrahedronBufferGeometry,
    TextGeometry, TextBufferGeometry,
    TorusGeometry, TorusBufferGeometry,
    TorusKnotGeometry, TorusKnotBufferGeometry,
    TubeGeometry, TubeBufferGeometry,
    Vector2,
    Vector3,
    WireframeGeometry,
    WebGLRenderer
} from "../../build/three.module.js";

import { GUI } from '../../examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from '../../examples/jsm/controls/OrbitControls.js';
import { ParametricGeometries } from '../../examples/jsm/geometries/ParametricGeometries.js';
const twoPi = Math.PI * 2;

function updateGroupGeometry( mesh, geometry ) {
    mesh.children[ 0 ].geometry = new WireframeGeometry( geometry );
    mesh.children[ 1 ].geometry = geometry;
}

const guis = {
    ExtrudeGeometry: function ( mesh ) {

        const data = {
            steps: 2,
            depth: 16,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        };

        const length = 12, width = 8;

        const shape = new Shape();
        shape.moveTo( 0, 0 );
        shape.lineTo( 0, width );
        shape.lineTo( length, width );
        shape.lineTo( length, 0 );
        shape.lineTo( 0, 0 );

        function generateGeometry() {

            const geometry = new ExtrudeGeometry( shape, data );
            geometry.center();

            updateGroupGeometry( mesh, geometry );

        }

        const folder = gui.addFolder( 'THREE.ExtrudeGeometry' );

        folder.add( data, 'steps', 1, 10 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'depth', 1, 20 ).onChange( generateGeometry );
        folder.add( data, 'bevelThickness', 1, 5 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'bevelSize', 0, 5 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'bevelOffset', - 4, 5 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'bevelSegments', 1, 5 ).step( 1 ).onChange( generateGeometry );

        generateGeometry();

    }

};

function chooseFromHash( mesh ) {

    guis[ "ExtrudeGeometry" ]( mesh );
    return {};

}

document.getElementById( 'newWindow' ).href += window.location.hash;

const gui = new GUI();

const scene = new Scene();
scene.background = new Color( 0x444444 );

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
camera.position.z = 30;

const renderer = new WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.enableZoom = false;

const lights = [];
lights[ 0 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

const group = new Group();

const geometry = new BufferGeometry();
geometry.setAttribute( 'position', new Float32BufferAttribute( [], 3 ) );

const lineMaterial = new LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
const meshMaterial = new MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: true } );

group.add( new LineSegments( geometry, lineMaterial ) );
group.add( new Mesh( geometry, meshMaterial ) );

const options = chooseFromHash( group );

scene.add( group );

function render() {

    requestAnimationFrame( render );

    if ( ! options.fixed ) {

        group.rotation.x += 0.005;
        group.rotation.y += 0.005;

    }

    renderer.render( scene, camera );

}

window.addEventListener( 'resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();