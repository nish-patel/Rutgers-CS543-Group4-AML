import * as THREE from '../node_modules/three/build/three.module.js';
import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';
import { GUI } from '../node_modules/three/examples/jsm/libs/dat.gui.module.js';
import { OBJLoader } from '../three.js/examples/jsm/loaders/OBJLoader.js';
import { loadBushData } from './bush.js';
import * as BUILD from './building.js';
import * as PATH from './path.js';

let perspectiveCamera, orthographicCamera, controls, scene, renderer;

// let spiral = []; 
let frustumSize = 400;
let aspect = window.innerWidth/window.innerHeight;
scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');
// scene.background = new THREE.Color('midnightblue');
// let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let objects = [];
let INTERSECTED;
let city_tracking = {};
let city_all = {};
let city_list = [];
let ground_object;
let path_objects = [];
let truss_objects = [];
let window_objects = [];
let flag_objects = [];
let grass_objects = [];
let bush_objects = [];
let light_objects;
let addBuildings = false;
let oneBuilding = false;
let addEnvironment = true;
let city_to_load = 0; // hard-coded
if(addBuildings){
    city_to_load = 77;
}else if(addBuildings && oneBuilding){
    city_to_load = 1;
}
let dropdown;
let oneBuildingName = "wavemap_2_11398_1";
// let DATASET = 'com-friendster_old';
// let DATASET = 'com-friendster';
// let DATASET = 'movies';
// let DATASET = 'cit-Patents';
let data_list = ['com-friendster','movies','cit-Patents'];
let DATASET = data_list[1]
let source_dir = "../data/"+DATASET+"/";
let spiral_file = "../data/"+DATASET+"/SPIRAL.txt";
let voronoi_file = "../python/"+DATASET+"/voronoi.txt";
let neighbors_file = "../python/"+DATASET+"/neighbors.txt";
let meta_file = "../python/"+DATASET+"/metagraph_normalized.txt";

let land_obj = "../models/flat_island.obj";
let ground_texture_file = "../textures/ground_2.jpg";
let water_texture_file = "../textures/waternormals.jpg";
let manager = new THREE.LoadingManager();
// let source_dir;
// let y_scale = 50; // scale up the height of building
let last = [-187.86920742571192,-69.84011743155536]
let y_scale = Math.sqrt(last[0] ** 2 + last[1] ** 2) / 4.565727849181679;
// let x_scale = 800000.0; // scale down the coordinates span
let x_scale = 1;
// camera movements
let radius = 500, theta = 0, toPanCity = false, toPanBuilding = false, toZoomBuilding = false;
// GUI parameters
let params = {
    orthographicCamera: false,
    resetCamera: function() {
        controls.reset();
    },
    panCity: function() {
        panCity();
    },
    zoomBuilding: function(){
        zoomBuilding();
    },
    panBuilding: function() {
        panBuilding();
    },
    ground: "#CCA262",
    // colorMap: "jet",
    // hideBuilding: false
    dataSet:data_list[1],
    root: 'any building',
    outer: true,
    isNight: false
};
let building_params = {
    floor: '',
    layer: ''
};
let water;

init();
animate();

function init() {
    perspectiveCamera = new THREE.PerspectiveCamera( 60, aspect, 1, 4000 );
    perspectiveCamera.position.z = 850;
    perspectiveCamera.position.y = 650;
    if(oneBuilding){
        perspectiveCamera.position.z = 50;
        perspectiveCamera.position.y = 80;       
    }
    orthographicCamera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
    orthographicCamera.position.z = 20;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    document.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false );
    // window.addEventListener( 'reset_camera', onResetCamera, false);
    createControls( perspectiveCamera );

    // environment lights
    let light_objects = {
        ambientLight: new THREE.AmbientLight( 0x404040 ),
        dayLights: [new THREE.DirectionalLight( 0xffffff, 0.8), new THREE.DirectionalLight( 0xffffff, 0.5)],
        nightLight: new THREE.DirectionalLight( 0xffffff, 0.01),
        spotLight: new THREE.SpotLight( 0xffffff, 1, 0,1.5, 1, 1 )
    };
    scene.add(light_objects['ambientLight']);
    light_objects['dayLights'][0].position.set(1000,1000,1000);
    light_objects['dayLights'][1].position.set(-500,500,0);
    light_objects['dayLights'].forEach(object => scene.add(object));
    light_objects.spotLight.position.set(40,40,40);
    light_objects.spotLight.target.position.set(40,0,40);
    scene.add(light_objects.spotLight);
    scene.add(light_objects.spotLight.target);
    light_objects.spotLight.visible = false;
    // load files
    manager.onStart = function(url,itemsLoaded,itemsTotal) {
        console.log('Started loading file: '+url+'.\nLoaded '+itemsLoaded+' of '+itemsTotal+' files.');
    };

    // loadBushData();
    loadFile(spiral_file,manager);
    BUILD.createHistogram(oneBuildingName,DATASET);

    // GUI folders
    let gui = new GUI({width:350});
    let f1 = gui.addFolder('Building Info');
    f1.add(building_params, 'floor').name('floor number').listen();
    f1.add(building_params, 'layer').name('layer info').listen();
    // f1.add(params, 'colorMap', ['jet','others']).name('color map').onChange(function () {
    //     updateColorMap();
    //     render();
    // });
    f1.open();

    let f2 = gui.addFolder('Camera Control');
    f2.add(params, 'resetCamera').name('reset camera');
    f2.add(params, 'orthographicCamera').name('use orthographic').onChange(function( value ) {
            // controls.dispose();
        createControls( value ? orthographicCamera : perspectiveCamera );
    });
    f2.add(params, 'panCity').name('Pan around a city');
    f2.add(params, 'zoomBuilding').name('Zoom in to "root"');
    f2.add(params, 'panBuilding').name('Zoom in and pan around');
    f2.open();

    let f3 = gui.addFolder('Environment Control');
    f3.add(params, 'outer').name('outer frustums').onChange(function(value){
        truss_objects.forEach(object => object.visible=value);
        animate();
    });
    f3.add(params, 'isNight').name('night view').onChange(function(value){
        dayAndNight(value, light_objects, window_objects);
        animate();
    });
    // f3.addColor(params, 'ground').name('ground color').onChange( function( colorValue ) {
    //     colorValue = parseInt(colorValue.replace('#','0x'), 16);
    //     let colorObject = new THREE.Color( colorValue );
    //     groundMesh.material.color = colorObject;
    //     animate();
    // });
    f3.open();
    
    let f4 = gui.addFolder('Path Planning');
    dropdown = f4.add(params, 'root', ['default','example 1', 'example 2']);
    dropdown.setValue('default');
    f4.open();

    // ground
    // let groundMat = new THREE.MeshBasicMaterial( {color:params.ground} );
    // groundMat.side = THREE.DoubleSide;

    // let groundUrl = "models/island.obj";
    // let groundMesh = objLoader(groundUrl, groundMat);

    // groud - 2
    let groundNormal = new THREE.TextureLoader().load(ground_texture_file);
    groundNormal.wrapS = THREE.RepeatWrapping;
    groundNormal.wrapT = THREE.RepeatWrapping;
    groundNormal.repeat.set( 10,10 );
    groundNormal.rotation = 10;
    let groundMat = new THREE.MeshStandardMaterial( {map:groundNormal} );
    // groundMat.normalMap = groundNormal;
    // groundMat.side = THREE.DoubleSide;
    if(addEnvironment){
        groundObjLoader(land_obj, groundMat);
    
        // let size = 1200;
        // let divisions = 24;
        // let gridHelper = new THREE.GridHelper( size, divisions );
        // scene.add( gridHelper );
        
        // water - 2
        let waterGeo = new THREE.BoxBufferGeometry( 5000, 50, 5000 );
        let waterNormal = new THREE.TextureLoader().load( water_texture_file, function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( 4, 4 );
        });        
        let waterMat = new THREE.MeshPhongMaterial( {
            color: 0x006994,
            normalMap: waterNormal
        } );
        waterMat.transparent=true;
        waterMat.opacity=0.7;
        let waterMesh = new THREE.Mesh( waterGeo, waterMat );
        waterMesh.position.y=-50;
        scene.add( waterMesh );
    }
}

//load ground OBJ file
function groundObjLoader(obj_url,obj_material) {
  var loader = new OBJLoader();
  loader.load(
      obj_url,
      function ( object ) {
          object.traverse(function(child){
              console.log("child type: "+child.type);
              if(child.type == "Mesh") {
                  child.material = obj_material;
              }
          });
          object.position.x=-60;
          object.position.y=-10;
          object.position.z=20;
          object.scale.set(0.4,0.1,0.3);
          scene.add( object );
      },
      function ( xhr ) {
          console.log( obj_url + ' ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      function ( error ) {
          console.log( 'An error happened when loading ' + obj_url );
      }
  );
}

// function updateDropdown(target, list){   
//   innerHTMLStr = "";
//   for(var i=0; i<list.length; i++){
//       var str = "<option value='" + list[i] + "'>" + list[i] + "</option>";
//       innerHTMLStr += str;        
//   }
//   if (innerHTMLStr != "") target.domElement.children[0].innerHTML = innerHTMLStr;
// }

// dropdown = gui.add(MyObject, 'Values', ['A', 'B']);

// updateDropdown(dropdown, ['A', 'B', 'C', 'D']);


    function loadFile(file,manager) {
        let loader = new THREE.FileLoader(manager);
        let blob = null;
        loader.responseType = "blob";
        loader.load(file,
        function(data) {
            getAsText(data,file);
        },
        function(xhr) {
            console.log((file+' '+xhr.loaded/xhr.total*100)+'% loaded');
        },
        function(err) {
            console.error('An error happened when loading '+file);
        }
        );
    }
  
    function loadVoronoiFile(file,manager) {
        let loader = new THREE.FileLoader(manager);
        let blob = null;
        loader.responseType = "blob";
        loader.load(file,
        function(data) {
            getAsTextVoronoi(data,file);
        },
        function(xhr) {
            console.log((file+' '+xhr.loaded/xhr.total*100)+'% loaded');
        },
        function(err) {
            console.error('An error happened when loading '+file);
        }
        );
    }

    function loadMetaFile(file,manager) {
        let loader = new THREE.FileLoader(manager);
        let blob = null;
        loader.responseType = "blob";
        loader.load(file,
        function(data) {
            getAsTextMeta(data,file);
        },
        function(xhr) {
            console.log((file+' '+xhr.loaded/xhr.total*100)+'% loaded');
        },
        function(err) {
            console.error('An error happened when loading '+file);
        }
        );
    }

    function getAsText(file,url) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onProgress = updateProgress;
        reader.onload = loaded;
        reader.onerror = errorHandler;
        reader.url = url;
        let text = reader.result;
    }
  
    function getAsTextVoronoi(file,url) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onProgress = updateProgress;
        reader.onload = loadedVoronoi;
        reader.onerror = errorHandler;
        reader.url = url;
        let text = reader.result;
    }

    function getAsTextMeta(file,url) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onProgress = updateProgress;
        reader.onload = loadedMeta;
        reader.onerror = errorHandler;
        reader.url = url;
        let text = reader.result;        
    }

    function updateProgress(evt) {
        if(evt.lengthComputable) {
            let loaded = (evt.loaded/evt.total);
        }
    }
  
    function errorHandler(evt) {
        if(evt.target.error.name == "NotReadableError") {
            console.log("The file could not be read");
        }
    }

    function loadedVoronoi(evt) {
        let fileString = evt.target.result;
        let lines = fileString.split('\n');
        let element_count = (lines[0].split(' ').length);
        let filename = evt.target.url;
        let result;
        if(!oneBuilding){
            if(element_count > 2){
                result = BUILD.loadVoronoi(city_all, lines, filename);
                city_all = result.all;
            }
            result = PATH.loadNeighbors(city_all, lines, filename);
            city_all = result.all;
            // let result_2 = PATH.pathPlanning(city_list[0],scene,city_all);
            // scene = result_2.scene;
            // path_objects = result_2.path;
        }
    }
  
    function loadedMeta(evt) {
        let fileString = evt.target.result;
        let lines = fileString.split('\n');
        let filename = evt.target.url;
        if(!oneBuilding){
            let result = PATH.loadMeta(city_all, lines, filename);
            city_all = result.all;
            let result_2 = PATH.pathPlanning(city_list[0],scene,city_all);
            scene = result_2.scene;
            path_objects = result_2.path;
        }
    }

    function fileToLayer(filename) {
        let start = filename.lastIndexOf('/');
        let end = filename.lastIndexOf('_');
        return filename.substring(start+1,end);
    }
  
    function loaded(evt) {
        let fileString = evt.target.result;
        let filename = evt.target.url;
        let layer_name;
        let lines = fileString.split('\n');
        let element_count = (lines[0].split(' ')).length;
        // need to update when SPIRAL.txt updates
        if(element_count == 7) {
            // console.log("loaded: SPIRAL file");
            if(addBuildings && oneBuilding){
                let color_file = source_dir + oneBuildingName + "_color.txt";
                let floor_file = source_dir + oneBuildingName + "_floor.txt";
                loadFile(color_file,manager);
                loadFile(floor_file,manager);
            } else if(addBuildings && !oneBuilding) {
                let spiral = BUILD.loadSpiral(scene, lines, city_all, grass_objects, bush_objects, city_tracking, city_to_load, x_scale);
                city_all = spiral.all;
                city_tracking = spiral.tracking;
                for (const [key, value] of Object.entries(city_all)){
                    let layer_name = key;
                    city_list.push(layer_name);
                    if(addBuildings){
                        let color_file = source_dir + layer_name + "_color.txt";
                        let floor_file = source_dir + layer_name + "_floor.txt";
                        loadFile(color_file,manager);
                        loadFile(floor_file,manager);
                    }
                }
                PATH.updateDropdown(dropdown, city_list);
                loadVoronoiFile(voronoi_file,manager);
                loadVoronoiFile(neighbors_file,manager);
                loadMetaFile(meta_file,manager);
            }
        } else if(element_count == 6) {
            // console.log("loaded: color file");
            layer_name = fileToLayer(filename);
            let result = BUILD.loadColor(lines, layer_name, city_all, city_tracking);
            city_all = result.all;
            city_tracking = result.tracking;
        } else if(element_count == 3) {
            // console.log("loaded: floor file");
            layer_name = fileToLayer(filename);
            let result = BUILD.loadFloor(lines, layer_name, city_all, city_tracking);
            city_all = result.all;
            city_tracking = result.tracking;
        }
    }

    function dayAndNight( isNight, light_objects, window_objects ){
        if(isNight){
            scene.background = new THREE.Color('midnightblue');
            light_objects['dayLights'].forEach(object => object.visible = false);
            light_objects['nightLight'].visible = true;
            window_objects.forEach(object => object.visible=true);
            animate();
        }
        else{
            scene.background = new THREE.Color('skyblue');
            light_objects['dayLights'].forEach(object => object.visible = true);
            light_objects['nightLight'].visible = false;
            window_objects.forEach(object => object.visible=false);
            animate();
        }
    }

    function createControls( camera ) {
        controls = new TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.keys = [ 65, 83, 68 ];
    }

    function onWindowResize() {
        let aspect = window.innerWidth / window.innerHeight;

        perspectiveCamera.aspect = aspect;
        perspectiveCamera.updateProjectionMatrix();

        orthographicCamera.left = - frustumSize * aspect / 2;
        orthographicCamera.right = frustumSize * aspect / 2;
        orthographicCamera.top = frustumSize / 2;
        orthographicCamera.bottom = - frustumSize / 2;
        orthographicCamera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        controls.handleResize();
    }

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        // stats.update();
        if(city_to_load>0) {
            console.log("animate: run createCityMeshes()");
            console.log(city_all);
            console.log(city_tracking);
            let result = BUILD.createCityMeshes(scene, objects, city_all, city_tracking, truss_objects, window_objects, flag_objects, city_to_load, y_scale, params.isNight);
            scene = result.scene;
            city_all = result.all;
            city_tracking = result.tracking;
            objects = result.objects;
            city_to_load = result.remain;
            truss_objects = result.truss;
            window_objects = result.window;
        }
        render();
    }

    function render() {
        let camera = (params.orthographicCamera) ? orthographicCamera : perspectiveCamera;
        renderer.render(scene, camera);
        // let time = performance.now() * 0.001;
        // water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

        if(toPanCity) {
            console.log("pan city "+theta);
            theta += 0.1;
            camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
            // camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
            camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
            camera.lookAt( scene.position );
            if(theta>30) toPanCity = false;
            console.log(camera.position.x);
        }
        else if(toPanBuilding) {
            console.log("pan around building "+params.root);
            theta += 0.1;
            radius = 30;
            let building_position = new THREE.Vector3(100,0,100);
            controls.target = building_position;
            camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
            camera.position.y = 50;
            // camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
            camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
            if(theta>30) toPanBuilding = false;
            console.log(camera.position.x);
        }
        else if(toZoomBuilding) {
            console.log("zoom in to "+params.root);
            let building_position = new THREE.Vector3(100,0,100);
            controls.target = building_position;
            console.log(building_position.x);
            camera.position.x += theta * (building_position.x-camera.position.x);
            camera.position.y += theta * (building_position.y-camera.position.y);
            camera.position.z += theta * (building_position.z-camera.position.z);         
            if((building_position.x-camera.position.x) < 30){toZoomBuilding = false;}
        }
    }

    function panCity() {
        theta = 0;
        toPanCity = true;
        render();
    }

    function panBuilding() {
        theta = 0;
        toPanBuilding = true;
        render();
    }

    function zoomBuilding() {
        theta = 0.01;
        toZoomBuilding = true;
        render();
    }

    function onMouseMove( event ) {
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    let camera = (params.orthographicCamera) ? orthographicCamera : perspectiveCamera;
    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( objects );
    // Toggle rotation bool for meshes that we clicked
    if (intersects.length > 0) {
        // if the closest object intersected is not the currently stored intersection object
        if (intersects[0].object != INTERSECTED ) {
        INTERSECTED = intersects[0].object;
        if(intersects[0].object.floor_name) {
            building_params.floor = intersects[0].object.floor_name;
        } else {
            building_params.floor = '';
        }
        if(intersects[0].object.layer_name) {
            building_params.layer = intersects[0].object.layer_name;
        } else {
            building_params.layer = '';
        }
        }
    } else // there are no intersections
    {
        INTERSECTED = null;
        building_params.floor='';
        building_params.layer='';
    }
}