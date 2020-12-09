// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// camera
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 20;

// scene
const scene = new THREE.Scene();

// Lighting
const lights = [];
lights[ 0 ] = new THREE.PointLight( 0x0000ff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0x00ff00, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xff0000, 1, 0 );
lights[ 3 ] = new THREE.PointLight( 0x00ffff, 1, 0 );

lights[ 0 ].position.set( 100, 100, 100 );
lights[ 1 ].position.set( -100, 100, 100 );
lights[ 2 ].position.set( 100, -100, 100 );
lights[ 3 ].position.set( -100, -100, 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

// variabel
var radius  		= 3;
var detail          = 3;
var freeze          = false;
var visible         = true;
var strip           = 0;
var nStrip          = 1;
var tempx, tempy;
 
const verticesOfCube = [
    -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
    -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
];

const indicesOfFaces = [
    2,1,0,    0,3,2,
    0,4,7,    7,3,0,
    0,1,5,    5,4,0,
    1,2,6,    6,5,1,
    2,3,7,    7,6,2,
    4,5,6,    6,7,4
];

const geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, radius, detail );

//Material geometry
const material = new THREE.MeshPhongMaterial();
material.color.setHSL(1, 1, 1);
material.flatShading = true;

//mesh geometry
const geo = new THREE.Mesh( geometry, material );
scene.add( geo );

// edges geometry
edges = new THREE.EdgesGeometry( geometry , nStrip);
line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

// wireframe
wireframe = new THREE.WireframeGeometry( geometry );
// line = new THREE.LineSegments( wireframe );

line.material.depthTest = true;
line.material.opacity = 0.25;


function properties(event) {
    if (event.keyCode == 32)    // space rotation
        freeze = !freeze;

    else {
        if (event.keyCode == 97){   // a line
            if(nStrip == 0)
                nStrip = 1;
            else
                nStrip = 0;
        }
        else if (event.keyCode == 113){     // q line
            strip += 1;
            strip = strip%3;

            if(strip == 0)
                scene.remove(line);
        }

        else if (event.keyCode == 122){     //z geo
            visible = !visible;
            if(visible)
                scene.add( geo );
            else
                scene.remove( geo );
        }
    }
    
}
document.addEventListener('keypress', properties);


function position(event) {
    if(freeze){
        if (event.keyCode == 38){
            geo.rotation.x -= 0.05;
            line.rotation.x -= 0.05;
        }
        else if (event.keyCode == 40){
            geo.rotation.x += 0.05;
            line.rotation.x += 0.05;
        }
        else if (event.keyCode == 37){
            geo.rotation.y -= 0.05;
            line.rotation.y -= 0.05;
        }
        else if (event.keyCode == 39){
            geo.rotation.y += 0.05;
            line.rotation.y += 0.05;
        }
    }

    if (event.keyCode == 188)
        camera.position.z += 0.5;
    else if (event.keyCode == 190)
        camera.position.z -= 0.5;
}
document.addEventListener('keydown', position);

const animate = function () {
    requestAnimationFrame( animate );
    if(!freeze){
        geo.rotation.x += 0.01;
        geo.rotation.y += 0.01;
        line.rotation.x += 0.01;
        line.rotation.y += 0.01;
    }
    renderer.render( scene, camera );
};
animate();