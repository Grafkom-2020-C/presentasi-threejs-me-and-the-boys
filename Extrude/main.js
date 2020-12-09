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
var length          = 1;
var width           = 1;
var openEnded       = false;
var freeze          = false;
var visible         = true;
var strip           = 0;
var nStrip          = 1;
var tempx, tempy;

var steps = 1;
var depth = 3;
var bevelEnabled = false;
var bevelThickness = 1;
var bevelSize = 1;
var bevelOffset = 1;
var bevelSegments = 1;


const shape = new THREE.Shape();
shape.moveTo( 0,0 );
shape.lineTo( 0, width );
shape.lineTo( length, width );
shape.lineTo( length, 0 );
shape.lineTo( 0, 0 );

const extrudeSettings = {
	steps: steps,
	depth: depth,
	bevelEnabled: bevelEnabled,
	bevelThickness: bevelThickness,
	bevelSize: bevelSize,
	bevelOffset: bevelOffset,
	bevelSegments: bevelSegments
};


//Bentuk Geometry
geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

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

        else if (event.keyCode == 120)     //x openended
            extrudeSettings.bevelEnabled = !extrudeSettings.bevelEnabled;

        else if (event.keyCode == 119) // w +steps
            extrudeSettings.steps++;
        else if (event.keyCode == 101) // e -steps
            extrudeSettings.steps--;


        else if (event.keyCode == 114) // r +depth
            extrudeSettings.depth++;
        else if (event.keyCode == 116) // t -depth
            extrudeSettings.depth--;

        else if (event.keyCode == 121) // y +bevelThickness
            extrudeSettings.bevelThickness++;
        else if (event.keyCode == 117) // u -bevelThickness
            extrudeSettings.bevelThickness--;
    

        else if (event.keyCode == 105) // i +bevelSize
            extrudeSettings.bevelSize++;
        else if (event.keyCode == 111) // o -bevelSize
            extrudeSettings.bevelSize--;
    
        else if (event.keyCode == 115) // s +bevelOffset
            extrudeSettings.bevelOffset++;
        else if (event.keyCode == 100) // d -bevelOffset;
            extrudeSettings.bevelOffset--;
    

        else if (event.keyCode == 102) // f +bevelSegments
            extrudeSettings.bevelSegments++;
        else if (event.keyCode == 103) // g -bevelSegments
            extrudeSettings.bevelSegments--;


            geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
            geo.geometry = geometry;

        
        if (strip == 1){       // edges
            tempx = line.rotation.x;
            tempy = line.rotation.y;
            scene.remove( line );

            edges = new THREE.EdgesGeometry( geometry , nStrip);
            line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
            line.rotation.x = tempx;
            line.rotation.y = tempy;
            scene.add( line );
        }
        else if (strip == 2){   //wireframe
            tempx = line.rotation.x;
            tempy = line.rotation.y;
            scene.remove( line );

            wireframe = new THREE.WireframeGeometry( geometry );
            line = new THREE.LineSegments( wireframe );
            line.rotation.x = tempx;
            line.rotation.y = tempy;
            scene.add( line );
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