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

// Class Bawaan Internet UwU
class CustomSinCurve extends THREE.Curve {
	constructor( scale = 1 ) {
		super();
		this.scale = scale;
    }
	getPoint( t, optionalTarget = new THREE.Vector3() ) {
		const tx = t * 3 - 1.5;
		const ty = Math.sin( 2 * Math.PI * t );
		const tz = 0;
		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

// variabel
var path            = new CustomSinCurve(5);
var tubularSegments = 20;
var radius          = 1;
var radialSegments	= 8;
var closed      	= true;
var freeze          = false;
var visible         = true;
var strip           = 0;
var nStrip          = 1;
var tempx, tempy;

//Bentuk Geometry
geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed);

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

        else if (event.keyCode == 119) // w +tubularSegments
            geometry = new THREE.TubeGeometry(path, ++tubularSegments, radius, radialSegments, closed);
        else if (event.keyCode == 101) // e -tubularSegments
            geometry = new THREE.TubeGeometry(path, --tubularSegments, radius, radialSegments, closed);

        else if (event.keyCode == 99) // c +radius
            geometry = new THREE.TubeGeometry(path, tubularSegments, ++radius, radialSegments, closed);
        else if (event.keyCode == 118) // v -radius
            geometry = new THREE.TubeGeometry(path, tubularSegments, --radius, radialSegments, closed);

        else if (event.keyCode == 114) // r +radialsegments
            geometry = new THREE.TubeGeometry(path, tubularSegments, radius, ++radialSegments, closed);
        else if (event.keyCode == 116) // t -radialsegments
            geometry = new THREE.TubeGeometry(path, tubularSegments, radius, --radialSegments, closed);


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