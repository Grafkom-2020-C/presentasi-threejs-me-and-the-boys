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
    //mesh.children[ 1 ].geometry = geometry;
}

const guis = {
    BoxGeometry: function ( mesh ) {
        const data = {
            width: 15,
            height: 15,
            depth: 15,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new BoxGeometry(
                    data.width, data.height, data.depth, data.widthSegments, data.heightSegments, data.depthSegments
                )
            );

        }

        const folder = gui.addFolder( 'THREE.BoxGeometry' );
        folder.add( data, 'width', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'height', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'depth', 1, 30 ).onChange( generateGeometry );
        folder.add( data, 'widthSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'heightSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'depthSegments', 1, 10 ).step( 1 ).onChange( generateGeometry );

        generateGeometry();
    }

};

function chooseFromHash( mesh ) {

    guis[ "BoxGeometry" ]( mesh );
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