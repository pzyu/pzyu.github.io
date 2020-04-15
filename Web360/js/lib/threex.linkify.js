var THREEx	= THREEx	|| {}


THREEx.Linkify	= function(domEvents, mesh ){
	// bind 'mouseover'
	var withBoundingBox = true;
	var geometry	= mesh.geometry
	geometry.computeBoundingBox();
	var size	= new THREE.Vector3();
	size.x	= (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
	size.y	= (geometry.boundingBox.max.y - geometry.boundingBox.min.y)
	size.z	= (geometry.boundingBox.max.z - geometry.boundingBox.min.z)
	var boundingBox	= new THREE.Mesh(new THREE.CubeGeometry(1,1,1), new THREE.MeshBasicMaterial({
			wireframe	: true
		}))
		boundingBox.material.visible	= false
		boundingBox.scale.copy(size)
		mesh.add(boundingBox)
	var eventTarget	= withBoundingBox ? boundingBox : mesh 
	this.eventTarget= eventTarget
	domEvents.bind(eventTarget, 'mouseover', function(event){
		document.body.style.cursor	= 'pointer';
		
		if (mesh.name == 'selector') {
			mesh.material.color.set(0xff0000);
		}
		else {
			mesh.position.y-=5;
		}
	}, false)
		
	// bind 'mouseout'
	domEvents.bind(eventTarget, 'mouseout', function(event){
		document.body.style.cursor	= 'default';
		if (mesh.name == 'selector') {
			mesh.material.color.set(0xffffff);
		}
		else {
			mesh.position.y+=5;
		}
		
	}, false)
	
	this.destroy	= function(){
		console.log('not yet implemented')
	}
}
