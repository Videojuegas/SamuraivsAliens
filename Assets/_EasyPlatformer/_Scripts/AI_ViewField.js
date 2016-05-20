//-------------------------------------------------------------------------------------------------------------------------
// Simple script to simulate AI view field and  kinow when it sees enemy
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/AI/AI View Field")


// Important internal variables - please don't change them blindly
@HideInInspector var targetTag: String;
@HideInInspector var targetInField: GameObject;


//==================================================================================================================================
//Initialize
function Start () 
{
  if(!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider);
  
  gameObject.layer = LayerMask.NameToLayer("Ignore Raycast");
  GetComponent.<Collider>().isTrigger = true;
  
}
 
//-------------------------------------------------------------------------------------------------------------------------
// Check is it enemy in frustum or not
function OnTriggerEnter (other : Collider) 
{
	if (!other.isTrigger && other.tag == targetTag) targetInField = other.gameObject;
}


//-------------------------------------------------------------------------------------------------------------------------
// Reset
function OnTriggerExit (other : Collider) 
{
	//if (!other.isTrigger && other.tag == targetTag) targetInField = null;
	
}

//-------------------------------------------------------------------------------------------------------------------------