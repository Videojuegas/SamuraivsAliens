//---------------------------------------------------------------------------------------------------------	
// Simple script allows to show hint (enable attached renderer)  on collision
//---------------------------------------------------------------------------------------------------------	
#pragma strict
@script AddComponentMenu ("EasyPlatformer/Utility/Hint Shower")

var activatorTag: String = "Player";


//========================================================================================================
// Init
function Start () 
{
  // Add collider if it's missed and Rigidbody if needed
  if (!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider);
  GetComponent.<Collider>().isTrigger = true; 
  GetComponent.<Collider>().enabled = true;
  
   GetComponent.<Renderer>().enabled = false;
}

//---------------------------------------------------------------------------------------------------------	
// Activator enters trigger - enable hint renderer
function OnTriggerEnter(collider : Collider)
{
  // if collided with target - Follow it and Gather
  if (collider.tag == activatorTag) 
    if (GetComponent.<Renderer>()) GetComponent.<Renderer>().enabled = true;

}

//---------------------------------------------------------------------------------------------------------	
// Activator leaves trigger - enable hint renderer
function OnTriggerExit(collider : Collider)
{
  if (collider.tag == activatorTag) 
    if (GetComponent.<Renderer>()) GetComponent.<Renderer>().enabled = false;
}

//---------------------------------------------------------------------------------------------------------	