// import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'


let scene, renderer, mesh;
let perspective_camera, orthographic_camera;


let textured_box;
let spot_light, shadow_camera_helper;
let control, orbit, points;
let wire_material, point_material, flat_material, ground_material;
let phong_material, texture_material, reflective_material;
let box, sphere, teapot, torus, torus_Kox, cylinder, cone, tube;


/**
 * Base
 */

class SineCurve extends THREE.Curve {

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


let params = {
    loadFile : function() { 
        document.getElementById('myInput').click();
    },
    shape: 'teapot',
    material: 'textured',
    modeControl: 'translate',
    color: 0xffffff,
    lx:40,
    ly:240,
    lz:40,
    cx:400,
    cy:200,
    cz:400,
    animation: 'none',
};


/**
 * GUI Controls
 */
 const gui = new GUI();

// get canvas
const canvas = document.querySelector('canvas.webgl')

init();
loop();

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

function init() {

    // renderer

    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    
    const aspect = window.innerWidth / window.innerHeight;
    perspective_camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    orthographic_camera = new THREE.OrthographicCamera( - 600 * aspect, 600 * aspect, 600, - 600, 0.01, 30000 );
    perspective_camera.position.set( 0, 500, 400 );
    perspective_camera.lookAt( new THREE.Vector3(0, 1, 0) );

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );

    // light
    const ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
    scene.add( ambient );

    spot_light = new THREE.SpotLight( 0xffffff, 1 );
    spot_light.position.set( params.lx, params.ly, params.lz );
    spot_light.angle = Math.PI / 4;
    spot_light.decay = 2;
    spot_light.intensity = 5;
    spot_light.shadow.bias = 0.001;
    spot_light.distance = 400;
    spot_light.penumbra = 0.5;


    spot_light.castShadow = true;
    spot_light.shadow.mapSize.width = 1024;
    spot_light.shadow.mapSize.height = 1024;
    spot_light.shadow.focus = 1;
    scene.add( spot_light );

    shadow_camera_helper = new THREE.CameraHelper( spot_light.shadow.camera );
    scene.add( shadow_camera_helper );

    //TODO: Change ground size
    const ground = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), 
                                    new THREE.MeshPhongMaterial( 
                                        { color: 0x074a3e, dithering: true } 
                                    ) 
                                );
    ground.position.set( 0, -100, 0 );
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    ground.size = THREE.DoubleSide;
    scene.add( ground );
    

    const size = 2000;
    const divisions = 20;
    const color1 = 0x000000;
    const color2 = 0xffffff;
    const helper = new THREE.GridHelper( size, divisions, color1, color2 );
    helper.material.opacity = 0.5;
    helper.position.set(0, -100, 0);
    helper.material.transparent = true;
    scene.add( helper );


    // default object settings
    // Material 
    wire_material = new THREE.MeshBasicMaterial( { color: params.color, wireframe: true , dithering: true } );
    point_material = new THREE.MeshBasicMaterial( { color: params.color, wireframe: true , dithering: true } );
    flat_material = new THREE.MeshPhongMaterial( { color: params.color, specular: 0x000000, flatShading: true, side: THREE.DoubleSide , dithering: true } );
    ground_material = new THREE.MeshLambertMaterial( { color: params.color, side: THREE.DoubleSide , dithering: true } );
    phong_material = new THREE.MeshPhongMaterial( { color: params.color, side: THREE.DoubleSide , dithering: true } );

    // TEXTURE MAP
    const textureMap = new THREE.TextureLoader().load( 'concreat.jpg' );
    textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
    textureMap.anisotropy = 16;
    textureMap.encoding = THREE.sRGBEncoding;
    texture_material = new THREE.MeshPhongMaterial( { color: params.color, map: textureMap, side: THREE.DoubleSide , dithering: true } );

    // REFLECTION MAP
    const path = "./";
    const urls = [
        path + "px.jpg", path + "nx.jpg",
        path + "py.jpg", path + "ny.jpg",
        path + "pz.jpg", path + "nz.jpg"
    ];
    textured_box = new THREE.CubeTextureLoader().load( urls );
    textured_box.encoding = THREE.sRGBEncoding;
    reflective_material = new THREE.MeshPhongMaterial( { color: params.color, envMap: textured_box, side: THREE.DoubleSide , dithering: true } );

    // Geometries
    box = new THREE.BoxGeometry( 100, 100, 100 );
    sphere = new THREE.SphereGeometry( 100, 32, 32 );
    teapot = new TeapotGeometry(70, 5, true, true, true, true, true);
    torus = new THREE.TorusGeometry(50, 30, 10, 50)
    cylinder = new THREE.CylinderGeometry(60.0, 60.0, 140.0, 30);
    cone = new THREE.ConeGeometry( 80, 160, 64 );
    torus_Kox = new THREE.TorusKnotGeometry( 50, 30, 32, 8 );
    const path1 = new SineCurve( 80 );
    tube =  new THREE.TubeGeometry( path1, 50, 30, 8, false );

    // Box with line
    mesh = new THREE.Mesh(tube, flat_material);
    mesh.position.y = 40;
    mesh.castShadow = true;
    scene.add(mesh);

    //
    const pointsMaterial = new THREE.PointsMaterial( {

        size: 5,
        sizeAttenuation: false,
        map: new THREE.TextureLoader().load( 'white-dot.png' ),
        alphaTest: 0.5,
        morphTargets: true

    } );
    points = new THREE.Points( mesh.geometry, pointsMaterial );
    points.morphTargetInfluences = mesh.morphTargetInfluences;
    points.morphTargetDictionary = mesh.morphTargetDictionary;
    points.visible = false;
    mesh.add( points );

    // controls
    orbit = new OrbitControls( perspective_camera, renderer.domElement );
    orbit.update();
    orbit.addEventListener( 'change', render );

    control = new TransformControls( perspective_camera, renderer.domElement );
    control.addEventListener( 'change', render );

    control.addEventListener( 'dragging-changed', function ( event ) {
        orbit.enabled = ! event.value;
    } );


    control.attach( mesh );
    scene.add( control );

    // add GUI
    let ob = gui.addFolder('Object');
    ob.add( params, 'shape', { TeaPot: 'teapot', Tube: 'tube', Sphere: 'sphere', Box: 'box', 
                                Torus: 'torus', Cylinder: 'cylinder', 
                                TorusKnox: 'torusKnox', Cone :'cone'} ).name('Geometries');

    ob.add( params, 'material', { Point: 'point', Textured: 'textured', Flat: 'flat', Wireframe: 'wireframe', 
                                    Glossy: 'glossy', Smooth: 'smooth', Reflective: 'reflective'  } )
        .name('Materials')
        .onChange(function(val){
            if (val!= 'reflective'){
                ground.visible = true;
                scene.background = new THREE.Color( 0xa0a0a0 );
                helper.visible = true;
            }else{
                helper.visible = false;
                ground.visible = false;
            }
    });
    ob.add(params, 'loadFile').name('Import image');
    ob.addColor( params, 'color' ).name('Color picker')
    ob.add( params, 'animation' ,{None: 'none', Animation1: 'animation1', Animation2: 'animation2'}).name('Animations').onChange(function(val){
        if(val == 'none'){
            mesh.position.set(0,40,0);
            mesh.rotation.x = 0;
            mesh.rotation.y = 0;
        }
    });
    ob.add( params, 'modeControl', {Disable: 'disable',  Rotate: 'rotate', Scale: 'scale', Translate: 'translate' } ).name('Mode:');
    const paramsLight = {
        'light color': spot_light.color.getHex(),
        intensity: spot_light.intensity,
        distance: spot_light.distance,
        angle: spot_light.angle,
        penumbra: spot_light.penumbra,
        decay: spot_light.decay,
        focus: spot_light.shadow.focus
    };
    let h = gui.addFolder('Light');
    h.addColor( paramsLight, 'light color' ).name('Color picker').onChange( function ( val ) {
        spot_light.color.setHex( val );
        render();
    } );
    h.add( paramsLight, 'intensity', 0, 10 ).onChange( function ( val ) {
        spot_light.intensity = val;
        render();
    } );
    h.add( paramsLight, 'distance', 200, 800 ).onChange( function ( val ) {
        spot_light.distance = val;
        render();
    } );
    h.add( paramsLight, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {
        spot_light.angle = val;
        render();
    } );
    h.add( paramsLight, 'penumbra', 0, 1 ).onChange( function ( val ) {
        spot_light.penumbra = val;
        render();
    } );
    h.add( paramsLight, 'decay', 1, 2 ).onChange( function ( val ) {
        spot_light.decay = val;
        render();
    } );
    h.add( paramsLight, 'focus', 0, 1 ).onChange( function ( val ) {
        spot_light.shadow.focus = val;
        render();
    } );

    h = gui.addFolder( "Light direction" );
    h.add( params, "lx", -100, 100, 10 ).name( "x" );
    h.add( params, "ly", 0, 400, 10 ).name( "y" );
    h.add( params, "lz", -100, 100, 10 ).name( "z" );    

    // set on change listener
    document.getElementById('myInput').addEventListener('change', function(){
        const file1 = document.getElementById('myInput').files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file1);
        reader.onload = function () {
            localStorage.setItem("image", reader.result);
            // TEXTURE MAP
            const textureMap1 = new THREE.TextureLoader().load( localStorage.getItem("image"));
            textureMap1.wrapS = textureMap1.wrapT = THREE.RepeatWrapping;
            textureMap1.anisotropy = 16;
            textureMap1.encoding = THREE.sRGBEncoding;
            texture_material = new THREE.MeshPhongMaterial( { color: params.color, map: textureMap1, side: THREE.DoubleSide } );
        };
    })
    window.addEventListener( 'resize', onWindowResize );
    gui.domElement.addEventListener( 'change', function(){
        // control
        if(params.modeControl == 'disable'){
            control.enabled = false;
        } else{
            control.enabled = true;
            switch(params.modeControl){
                case 'translate':
                    control.setMode( 'translate' );
                    break;
                case 'rotate':
                    control.setMode( 'rotate' );
                    break;
                case 'scale':
                    control.setMode( 'scale' );
                    break;
            } 
        }
        
    },false);

}

function onWindowResize() {

    const aspect = window.innerWidth / window.innerHeight;

    perspective_camera.aspect = aspect;
    perspective_camera.updateProjectionMatrix();

    orthographic_camera.left = orthographic_camera.bottom * aspect;
    orthographic_camera.right = orthographic_camera.top * aspect;
    orthographic_camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function render() {
    shadow_camera_helper.update();
    renderer.render( scene, perspective_camera );
}

function loop(){
    requestAnimationFrame( loop );
    simulate();
    render();
}

function simulate() {
    switch(params.shape){
        case 'sphere':
            mesh.geometry = sphere;
            break;
        case 'tube':
            mesh.geometry = tube;
            break;  
        case 'box':
            mesh.geometry = box;
            break;
        case 'teapot':
            mesh.geometry = teapot;
            break;
        case 'torus':
            mesh.geometry = torus;
            break; 
        case 'torusKnox':
            mesh.geometry = torus_Kox;
            break;
        case 'cylinder':
            mesh.geometry = cylinder;
            break;   
        case 'cone':
            mesh.geometry = cone;
            break;  
    } 
    if(params.material=='point'){
        points.visible=true;
        points.geometry = mesh.geometry;
    }else{
        points.visible=false;
    }
    switch(params.material){
        case 'smooth':
            mesh.material = ground_material;
            break;
        case 'wireframe':
            mesh.material = wire_material;
            break;
        case 'reflective':
            mesh.material = reflective_material;
            scene.background = textured_box;
            break;
        case 'flat':
            mesh.material = flat_material;
            break;
        case 'glossy':
            mesh.material = phong_material;
            break;
        case 'textured':
            mesh.material = texture_material;
            break;
        case 'point':
            mesh.material = flat_material;
            break;
    }   
    mesh.material.color.setHex( params.color ) ;  
    spot_light.position.set(params.lx,params.ly,params.lz);
    const time = Date.now();
    switch (params.animation) {
        case 'animation1':
            
            mesh.position.x = Math.sin( time * 0.001 ) * 300;
            mesh.position.y = Math.sin( time * 0.001 ) * 30;
            mesh.position.z = Math.cos( time * 0.001 ) * 300;

            mesh.rotation.x += 0.04;
            mesh.rotation.y += 0.08;
            break;
        case 'animation2':
            
            mesh.position.x = Math.cos( time * 0.001 ) * 300;
            mesh.position.y = Math.sin( time * 0.001 ) * 2;
            mesh.position.z = Math.cos( time * 0.001 ) * 300;

            mesh.rotation.x += 0.02;
            mesh.rotation.y += 0.05;
            break;
        default:
            break;
    }
}