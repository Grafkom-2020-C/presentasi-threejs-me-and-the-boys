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

lights[ 0 ].position.set( 100, 100, 100 );
lights[ 1 ].position.set( -100, 100, 100 );
lights[ 2 ].position.set( 100, -100, 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

renderer.setClearColor(0xdddddd);


//SETTINGS
var word = "Boyz",
    height = 1,
    size = 5,
    curveSegments = 5,
    bevelThickness = 1,
    bevelSize = 0.3,
    bevelSegments = 3,
    bevelEnabled = true,
    font = undefined,
    rotation = 1.5;

//Material
const material = new THREE.MeshPhongMaterial();
material.color.setHSL(1, 1, 1);
material.flatShading = true;


function position(event) {
    if (event.keyCode == 188)
        camera.position.z += 0.5;
    else if (event.keyCode == 190)
        camera.position.z -= 0.5;
}
document.addEventListener('keydown', position);


const animate = function () {
    requestAnimationFrame( animate );

    rotation += 0.005;
    camera.position.z = Math.sin(rotation) * 30;
    camera.position.x = Math.cos(rotation) * 30;
    camera.lookAt(scene.position)
    
    renderer.render( scene, camera );
};
loadFont();
animate();


function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('helvetiker_regular.typeface.js', function (res) {
        font = res;
        createText();
    });
}

function createText() {
    textGeo = new THREE.TextGeometry( word, {
        font: font,
        size: size,
        height: height,
        curveSegments:curveSegments,
        weight: "normal",
        bevelThickness:bevelThickness,
        bevelSize:bevelSize,
        bevelSegments:bevelSegments,
        bevelEnabled:bevelEnabled
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();

    var text = new THREE.Mesh(textGeo, material)
    text.position.x = -textGeo.boundingBox.max.x/2;
    text.castShadow = true;
    scene.add(text)
}