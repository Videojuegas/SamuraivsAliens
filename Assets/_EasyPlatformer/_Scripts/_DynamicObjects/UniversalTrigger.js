//-------------------------------------------------------------------------------------------------------------------------
// Script allows to trigger actions in other objects
// To do this object with allowedTag should be in collision with this collider and/or button pressed
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/DynamicObjects/Universal Trigger")


// Class for action receiver and it function to call
class TriggeringReceiver
{
  var object: GameObject;
  var justSetActive: boolean;
  var callFunction: String;
  var parameter: String;
  
}


var receivers: TriggeringReceiver[];	// List of receivers and functions to call
var allowedTags: String[];		 		// List of tags of objects that can interact with (if empty - all objects are allowed)
var autoTriggeringDelay: float = -1;	// Actions will be triggered automaticaly after this time (if it >= 0) 	
var triggerByButton: String;       		// Input axe to trigger action. If None - action will be  triggered automatically
var password: String;		 			// Code for unlocking (if empty - unlocked already)



// Important internal variables - please don't change them blindly
private var objectInTrigger: GameObject;
private var triggeringTime: float;


//==================================================================================================================================
// Initialize
function Start () 
{
   // Add collider if it's missed
   if (!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider);
   
   // Ignore collisions with all child objects
   for (var child : Transform in transform) 
     if(child.gameObject.GetComponent.<Collider>())  Physics.IgnoreCollision(child.gameObject.GetComponent.<Collider>(), GetComponent.<Collider>());

  if (autoTriggeringDelay < 0)  autoTriggeringDelay = Mathf.Infinity;
    else triggerByButton = "";
    
  triggeringTime = Time.time + autoTriggeringDelay;

    
}

//-------------------------------------------------------------------------------------------------------------------------
// Trigger actions in all receivers 
function TriggerAction () 
{
   for (var receiver : TriggeringReceiver in receivers) 
     if (receiver.justSetActive) receiver.object.SetActive(true);
        else receiver.object.SendMessage(receiver.callFunction, receiver.parameter, SendMessageOptions.DontRequireReceiver);
   
   if (triggerByButton == "") objectInTrigger = null;
   
   triggeringTime = Time.time + autoTriggeringDelay;
   
}

//-------------------------------------------------------------------------------------------------------------------------
// Process triggering by button and/or timed
function Update () 
{
  // if allowed object in trigger
  if (objectInTrigger || triggeringTime < Time.time)
    {
     // Trigger by key pressing  or Open automatically if key isn't specified
     if ( (triggerByButton != ""  &&  Input.GetButtonUp(triggerByButton))  ||  triggerByButton == "" ) 
         if (password != "")  objectInTrigger.SendMessage("UsePassword", this, SendMessageOptions.DontRequireReceiver);
             else
               TriggerAction();
    }
    
}
//-------------------------------------------------------------------------------------------------------------------------
// Process manual triggering
function TriggerDirectly () 
{
  // if allowed object in trigger
  if (objectInTrigger)
     if (password != "")  objectInTrigger.SendMessage("UsePassword", this);
          else
             TriggerAction();
    
}

//----------------------------------------------------------------------------------
// Check are there any allowed objects in collider trigger
function OnTriggerEnter (other : Collider) 
{
 if (!objectInTrigger)
  if (allowedTags.Length == 0) objectInTrigger = other.gameObject;
    else
      for (var i=0; i < allowedTags.Length; i++)
        if (other.gameObject.tag == allowedTags[i])  
         {
           objectInTrigger = other.gameObject;
           break;
         }
 
}

//----------------
function OnTriggerExit (other : Collider) 
{
  objectInTrigger = null;
 
}

//----------------------------------------------------------------------------------
// Check are there any allowed objects in collision with this
function OnCollisionEnter (collision : Collision) 
{
 if (!objectInTrigger)
  if (allowedTags.Length == 0) objectInTrigger = collision.collider.gameObject;
    else
      for (var i=0; i < allowedTags.Length; i++)
        if (collision.collider.tag == allowedTags[i])  
         {
           objectInTrigger = collision.collider.gameObject;
           break;
         }
 
}

//----------------
function OnCollisionExit (collision : Collision) 
{
  objectInTrigger = null;
 
}

//----------------------------------------------------------------------------------
// Draw debug lines to receivers
function OnDrawGizmosSelected () 
{
#if UNITY_EDITOR
  if (receivers.Length > 0)
    for (var receiver : TriggeringReceiver in receivers) 
	    {
	       Handles.DrawLine(transform.position, receiver.object.transform.position);
    	   Handles.Label(receiver.object.transform.position, receiver.object.name);			
    	}
  #endif
  
}

//----------------------------------------------------------------------------------