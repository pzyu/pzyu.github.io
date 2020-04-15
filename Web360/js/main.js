                                                                                                       
//              ,--,                                    ,----,     ,----..        ,---,                    
//            ,--.'|     ,--,     ,---,               .'   .' \   /   /   \    ,`--.' |    ,---.           
//            |  | :   ,--.'|   ,---.'|             ,----,'    | /   .     :  /    /  :   /     \          
//       .---.:  : '   |  |,    |   | :             |    :  .  ;.   /   ;.  \:    |.' '  /    / '          
//     /.  ./||  ' |   `--'_    :   : :             ;    |.'  /.   ;   /  ` ;`----':  | .    ' /           
//   .-' . ' |'  | |   ,' ,'|   :     |,-.          `----'/  ; ;   |  ; \ ; |   '   ' ;'    / ;            
//  /___/ \: ||  | :   '  | |   |   : '  |            /  ;  /  |   :  | ; | '   |   | ||   :  \            
//  .   \  ' .'  : |__ |  | :   |   |  / :           ;  /  /-, .   |  ' ' ' :   '   : ;;   |   ``.         
//   \   \   '|  | '.'|'  : |__ '   : |: |          /  /  /.`| '   ;  \; /  |   |   | ''   ;      \        
//    \   \   ;  :    ;|  | '.'||   | '/ :        ./__;      :  \   \  ',  /    '   : |'   |  .\  |        
//     \   \ ||  ,   / ;  :    ;|   :    |        |   :    .'    ;   :    /     ;   |.'|   :  ';  :        
//      '---"  ---`-'  |  ,   / /    \  /         ;   | .'        \   \ .'      '---'   \   \    /         
//                      ---`-'  `-'----'          `---'            `---`                 `---`--`          



/*Simple panorama viewer.
 *
 *Three.js-r77
 *
 */
//todo: make cross-origin images available to load.
//clean up code
//test
//support  for cubic images
//add video
//generate url to share
//load image based on url issue-https://github.com/mrdoob/three.js/issues/776
//add more functinality to url like storing camera rotation, zoom level, leave a marker or a note.
//loading screen

//bug: fullscreen removes content after hash.



(function (world) {
  "use strict";
     
var domEvents;
var sceneNo, sceneNum = 0, mouse = new THREE.Vector2(), rotSpeed = 0.1;

var tempUrl;
var manager;

window.EskyboxFlag = 0;
window.Eskybox = 0;
world.scene = {};
  
  function bind(scope, func) {
    return function bound() {
      func.apply(scope, arguments);
    };
  }
  
//  ########     ###    ########    ###    
//  ##     ##   ## ##      ##      ## ##   
//  ##     ##  ##   ##     ##     ##   ##  
//  ##     ## ##     ##    ##    ##     ## 
//  ##     ## #########    ##    ######### 
//  ##     ## ##     ##    ##    ##     ## 
//  ########  ##     ##    ##    ##     ##
//Loading Default Position values for objects
var camPos  = [
    new THREE.Vector3(0,0,0)
 ],
 SpanoOffset = [
     new THREE.Vector3(-3.1515,5.569,-0.00999999999999999)
  ];
  
//  #### ##    ## #### ######## 
//   ##  ###   ##  ##     ##    
//   ##  ####  ##  ##     ##    
//   ##  ## ## ##  ##     ##    
//   ##  ##  ####  ##     ##    
//   ##  ##   ###  ##     ##    
//  #### ##    ## ####    ##  
  /*
   * init the scene, setup the camera, draw 3D objects and start the game loop
   */
  world.init = function () {


  // default pano is the first one
  sceneNo = 0;
  //Camera Properties Initialization
  var fov = 40, aspect_ratio = window.innerWidth / window.innerHeight,
  near = 0.1, far = 50000;
  this.cam = new THREE.PerspectiveCamera(fov, aspect_ratio, near, far);
  // Renderer Initialization
  if (Detector.webgl) {
    this.renderer = new THREE.WebGLRenderer();
  }
  else {
    document.getElementById('container').innerHTML = '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><h1>You need a WebGL enabled browser to proceed.</h1>';
   
  }
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(this.renderer.domElement);
 
  
  // Camera Controls initialization
  this.controls = new THREE.OrbitControls(this.cam, this.renderer.domElement);
  //this.controls.enabled = false;
  this.controls.autoRotateSpeed = 0.3;
  this.controls.addEventListener('change', bind(this, this.render));
  
  this.scene = new THREE.Scene();
  
  this.cam.position.set(camPos[sceneNo].x,
                          camPos[sceneNo].y,
                          camPos[sceneNo].z);
    this.cam.updateProjectionMatrix;
    this.scene.add(this.cam);
    this.controls.target.set(camPos[sceneNo].x - 0.1,
                             camPos[sceneNo].y,
                             camPos[sceneNo].z);
    
    // attach event handlers
   
    this.renderer.domElement.addEventListener('mousewheel',bind(this, this.eventHandlers.onDocumentMouseWheel), false);
    window.addEventListener('keydown',bind(this, this.eventHandlers.onKeydown), false);
    window.addEventListener('resize',bind(this, this.eventHandlers.onWindowResize),false);
    document.addEventListener( 'dragover',bind(this, this.eventHandlers.onDragOver),false);
    document.addEventListener( 'dragleave',bind(this, this.eventHandlers.onDragLeave),false);
    document.addEventListener( 'drop',bind(this, this.eventHandlers.onDrop),false);
    
    
  this.updateScene();
 this.readUrl();
  };
 
//  ##     ## ########  ########     ###    ######## ######## 
//  ##     ## ##     ## ##     ##   ## ##      ##    ##       
//  ##     ## ##     ## ##     ##  ##   ##     ##    ##       
//  ##     ## ########  ##     ## ##     ##    ##    ######   
//  ##     ## ##        ##     ## #########    ##    ##       
//  ##     ## ##        ##     ## ##     ##    ##    ##       
//   #######  ##        ########  ##     ##    ##    ########

// This is run everytime the scene has to change.

  world.updateScene = function () {

    this.makeSphericalPano();
    		
    // action!
    this.animate.apply(this, arguments);
    
   
    
  };
  
//     ###    ##    ## #### ##     ##    ###    ######## ########       ###    ##    ## ########     ########  ######## ##    ## ########  ######## ########  
//    ## ##   ###   ##  ##  ###   ###   ## ##      ##    ##            ## ##   ###   ## ##     ##    ##     ## ##       ###   ## ##     ## ##       ##     ## 
//   ##   ##  ####  ##  ##  #### ####  ##   ##     ##    ##           ##   ##  ####  ## ##     ##    ##     ## ##       ####  ## ##     ## ##       ##     ## 
//  ##     ## ## ## ##  ##  ## ### ## ##     ##    ##    ######      ##     ## ## ## ## ##     ##    ########  ######   ## ## ## ##     ## ######   ########  
//  ######### ##  ####  ##  ##     ## #########    ##    ##          ######### ##  #### ##     ##    ##   ##   ##       ##  #### ##     ## ##       ##   ##   
//  ##     ## ##   ###  ##  ##     ## ##     ##    ##    ##          ##     ## ##   ### ##     ##    ##    ##  ##       ##   ### ##     ## ##       ##    ##  
//  ##     ## ##    ## #### ##     ## ##     ##    ##    ########    ##     ## ##    ## ########     ##     ## ######## ##    ## ########  ######## ##     ## 
  world.animate = function () {
      
      
    requestAnimationFrame(world.animate);
    world.controls.update();
    world.render.apply(world, arguments);
  };

  world.render = function () {
    this.renderer.render(this.scene, this.cam);
  };
  

  world.readUrl = function () {
    var url = window.location.hash;
    tempUrl = url;  
    if (url == 0) {
      //do nothing
    }
    else{
     world.changePano(url);
     console.log(url);
    }
  };
  
  world.changePano = function (x) {
    var res = x.split('#&q?http://pantoto.net/');
    EskyboxFlag = 1;
    Eskybox = res[1];
    console.log(Eskybox);
    world.updateScene();
    };
    
    world.hashCheck = function () {
      console.log(window.location.hash);
      window.location.hash = tempUrl;
      console.log(window.location.hash);
      
      };
 
//  ##     ## ####    ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######  
//  ##     ##  ##     ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ## 
//  ##     ##  ##     ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##       
//  ##     ##  ##     ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######  
//  ##     ##  ##     ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ## 
//  ##     ##  ##     ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ## 
//   #######  ####    ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######  
// 
  
  world.zoom = function (x) {
    if (this.cam.fov >=20 && this.cam.fov <=85 ) {
    if (x == 0) {
      this.cam.fov-=5;
    }
    else {
      this.cam.fov+=5;
    }
    }
    else if(this.cam.fov < 20 ){
	this.cam.fov = 20;
      }
      else if(this.cam.fov > 85 ){
	this.cam.fov = 85;
      }
    
    this.cam.updateProjectionMatrix();
    
 };
 
 world.fullScreen = function (x) {
  
    if (x == 0) {
      document.getElementById('resizef').style.visibility = 'hidden';
      document.getElementById('resizes').style.visibility = 'visible';
      	 var element = document.getElementById('container');
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
console.log(requestMethod);
    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
    }
    else if (x == 1) {

     
      document.getElementById('resizef').style.visibility = 'visible';
      document.getElementById('resizes').style.visibility = 'hidden';
      var element = document;
      var requestMethod = element.cancelFullScreen||element.webkitCancelFullScreen||element.mozCancelFullScreen||element.exitFullscreen;
      //console.log(requestMethod);
       if (requestMethod) { 
	// Native full screen.
        requestMethod.call(element);
       }
       else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
      }
       world.hashCheck();
    }
    
  };
 
  world.autoRotate = function (x) {
    if (x == 0) {
      console.log('s');
      document.getElementById('autorotateplay').style.visibility = 'hidden';
      document.getElementById('autorotatepause').style.visibility = 'visible';
      this.controls.autoRotate = true;
    }
    else if (x == 1) {
      document.getElementById('autorotateplay').style.visibility = 'visible';
      document.getElementById('autorotatepause').style.visibility = 'hidden';
      this.controls.autoRotate = false;
    }
  };
  
  
//   ######  ##    ## ##    ## ########   #######  ##     ## 
//  ##    ## ##   ##   ##  ##  ##     ## ##     ##  ##   ##  
//  ##       ##  ##     ####   ##     ## ##     ##   ## ##   
//   ######  #####       ##    ########  ##     ##    ###    
//        ## ##  ##      ##    ##     ## ##     ##   ## ##   
//  ##    ## ##   ##     ##    ##     ## ##     ##  ##   ##  
//   ######  ##    ##    ##    ########   #######  ##     ##
// Cubic Panorama function
  /*world.makeSkyBox = function () {
    var url=['panoramas/' + this.currentSkybox + '/posx.jpg',
	    'panoramas/' + this.currentSkybox + '/negx.jpg',
	    'panoramas/' + this.currentSkybox + '/posy.jpg',
	    'panoramas/' + this.currentSkybox + '/negy.jpg',
	    'panoramas/' + this.currentSkybox + '/posz.jpg',
	    'panoramas/' + this.currentSkybox + '/negz.jpg'],
    textureCube = THREE.CubeTextureLoader(url),
    material = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube }),
    panoMeshGeo = new THREE.BoxGeometry(-50000, -50000, -50000),
    materialArray = [],
    panoMeshMat,
    i,
    cubeTex;
    for (i = 0; i < 6; i++) {
      var cubeMapTexture = new THREE.TextureLoader().load( url[i])
      materialArray.push(new THREE.MeshBasicMaterial({
			 map: cubeMapTexture,
			 side: THREE.FrontSide
			 }));
    }
    panoMeshMat = new THREE.MeshFaceMaterial(materialArray);
    this.panoMesh = new THREE.Mesh(panoMeshGeo, panoMeshMat);
    this.panoMesh.rotation.set(panoOffset[sceneNo].x,
                               panoOffset[sceneNo].y,
                               panoOffset[sceneNo].z);
    this.panoMesh.position.set(camPos[sceneNo].x,
                               camPos[sceneNo].y,
                               camPos[sceneNo].z);
    this.panoMesh.name = 'Pano Cube';
    var panos = this.scene.children.filter(function(item) {
      return item.name == 'Pano Cube';
    });
    if(panos.length == 0) {
      this.scene.add(this.panoMesh);
    }
    else {
      this.scene.remove(panos[0]);
      this.scene.add(this.panoMesh);
    }
  }; */
  
  world.makeSphericalPano = function () {
   
      if (EskyboxFlag == 0) {
 //   var spheretexture = new THREE.TextureLoader(manager).load('panoramas/default.jpg');
var spheretexture = new THREE.TextureLoader().load('panoramas/default.jpg');
		}
    else {
      var loadingTexture = new THREE.TextureLoader().load('images/loading.jpg');
    var screen = new THREE.Mesh(new THREE.BoxGeometry(0.8,360,640), new THREE.MeshBasicMaterial({map: loadingTexture}));
   //screen.material.needsUpdate = true;
    screen.position.set(-900,0,0);
    this.scene.add(screen);
    
    var spheretexture = new THREE.TextureLoader().load('../../'+Eskybox, function ( texture ) {
	screen.visible=false;
	screen.material.needsUpdate = true;
} );
    }
    
    var Sgeometry = new THREE.SphereGeometry(20000,50,50)
    Sgeometry.applyMatrix( new THREE.Matrix4().makeScale( 1, -1, 1 ) );
    this.sphere = new THREE.Mesh(Sgeometry, new THREE.MeshBasicMaterial({map:spheretexture, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 140}));
    this.sphere.position.set(camPos[sceneNo].x, camPos[sceneNo].y, camPos[sceneNo].z);
    this.scene.add(this.sphere);
    this.sphere.name = 'sphere';
    this.sphere.rotation.set(SpanoOffset[sceneNo].x, SpanoOffset[sceneNo].y, SpanoOffset[sceneNo].z);
    var Spanos = this.scene.children.filter(function(item) {
          return item.name == 'sphere';
    });
    if(Spanos.length == 0) {
      this.scene.add(this.sphere);
    }
    else {
      this.scene.remove(Spanos[0]);
      this.scene.add(this.sphere);
    }
	    
	    };


  
//  ######## ##     ## ######## ##    ## ########  ######  
//  ##       ##     ## ##       ###   ##    ##    ##    ## 
//  ##       ##     ## ##       ####  ##    ##    ##       
//  ######   ##     ## ######   ## ## ##    ##     ######  
//  ##        ##   ##  ##       ##  ####    ##          ## 
//  ##         ## ##   ##       ##   ###    ##    ##    ## 
//  ########    ###    ######## ##    ##    ##     ######  
// all event handlers of the 3D world
  world.eventHandlers = {
    onDocumentMouseWheel: function (event) {
      
      // WebKit
      //fov limits = 20 and 85
      if (this.cam.fov >=20 && this.cam.fov <=85 ) {
	
      
      if ( event.wheelDeltaY ) {
	this.cam.fov -= event.wheelDeltaY * 0.005;
      }
      // Opera / Explorer 9
      else if ( event.wheelDelta ) {
	this.cam.fov -= event.wheelDelta * 0.005;
      }
      // Firefox
      else if ( event.detail ) {
	this.cam.fov -= event.detail * 0.05;
      }	
      
      }
      else if(this.cam.fov < 20 ){
	this.cam.fov = 20;
      }
      else if(this.cam.fov > 85 ){
	this.cam.fov = 85;
      }
      this.cam.updateProjectionMatrix();
      console.log(this.cam.fov);
    },
			
    onClick: function (event) {
      event.preventDefault();
      var info;
      
      mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera( mouse, this.cam );
      var intersects = raycaster.intersectObjects( this.scene.children );
      if ( intersects.length > 0 ) {
	for (var i = 0; i < intersects.length; i++) {
	    //if (intersects[i].object.name === 'philly_object') {
	      //do something
	}
      }
	 
    },
    onIClick: function (event) {
      //event.preventDefault();
      if(this.tagName == 'a'){
    alert("It's a div!");}
    else{console.log(document.getElementById("iframe").contentWindow.location.href);}
    },
    
    
    onKeydown: function (event) {
      
      var variable = this.sphere.rotation;
      switch (event.keyCode) {
	//for rotation of panorama sphere
	case 65: // A
	  variable.x-=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
        case 68: //D
	  variable.x+=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 87: //W
	  variable.y+=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 83: //S
	  variable.y-=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 81: //Q
	  variable.z+=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 69: //E
	  
	  variable.z-=rotSpeed;
	  document.getElementById('info').innerHTML = 'rotation is' +variable.x +',' +variable.y+','+variable.z;
	  break;
	case 90: //Z
	 rotSpeed = 0.1;
	  break;
	case 88: //X
	  rotSpeed = 0.003;
	  break;
	  
	    
	
      }
    },
    
    onWindowResize: function (event) {
      this.aspect_ratio = window.innerWidth / window.innerHeight;
      this.cam.aspect = this.aspect_ratio;
      this.cam.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    },
        onDragOver: function (event){
	  event.preventDefault();
	  event.dataTransfer.dropEffect = 'copy';

	  },
   onDragLeave: function (event) {
    event.preventDefault();
   },
    onDrop: function (event) {
      event.preventDefault();
      var file = event.dataTransfer.files[ 0 ];
      var filename = file.name;
      var extension = filename.split( '.' ).pop().toLowerCase();
      var reader = new FileReader();
      reader.onload = function ( event ) {
      var x = event.target.result;
       world.sphere.material.map = new THREE.TextureLoader().load(x);
					}
      reader.readAsDataURL(file);
				
      
    }
  };
})(world);
