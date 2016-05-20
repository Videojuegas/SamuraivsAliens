//-----------------------------------------------------------------------------------------	
// Main script. Use this script for any pickups (like medkit, ammo etc) creation 
// If attached to object - it will seek for target object and  move to it
// Pickup will be absorbed by target object on collision
// Pickup will send sendValue to target's callFunction (use this to increase parameters in it)
//-----------------------------------------------------------------------------------------	
#pragma strict
@script AddComponentMenu ("EasyPlatformer/DynamicObjects/Simple Collectible")


var receiverTag: String = "Player";
var gatreringDistance: float = 1; 			// Min gathering distance 
var speed : float = 15.0; 					// Movement speed
var lifeTime : float = 15.0; 				// Life time. Infinite if <= 0
var callFunction: String;					// Name of target function to apply sendValue
var sendValue: float; 						// Value applied to target's callFunction
var sendStringValue: String; 				// Value applied to target's callFunction

// Important internal variable. Please don't change it blindly
private var timeToDie : float; 


//========================================================================================================
// Init
function OnEnable () 
{
  // Add collider if it's missed and Rigidbody if needed
  if (!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider);
  GetComponent.<Collider>().isTrigger = true; 
  GetComponent.<Collider>().enabled = true;
  
  if (GetComponent.<Rigidbody>()) GetComponent.<Rigidbody>().useGravity = false;
  
  timeToDie = Time.time + lifeTime;
  
  if (GetComponent.<AudioSource>())  GetComponent.<AudioSource>().enabled = false; 
  if (GetComponent.<ParticleSystem>()) 
      {
       GetComponent.<ParticleSystem>().Stop();
       GetComponent.<ParticleSystem>().Clear();
      }
		

}



//---------------------------------------------------------------------------------------------------------	
function Coroutine_MoveTo (target: GameObject)
{
   while(Vector3.Distance(transform.position, target.transform.position) > gatreringDistance)
    {
        transform.position = Vector3.MoveTowards(transform.position, target.transform.position, Time.deltaTime * speed);
        yield;
    }
    
    GatherPickup(target);
    
}

//---------------------------------------------------------------------------------------------------------	
// Process pickup life. Looking for target and move to it, if target is clother than activeDistance
// Disable if pickup lifeTime has expired 
function FixedUpdate () 
{
   // Deactivate the pickup if it lifeTime has expired (if it isn't infinite)
   if ((Time.time > timeToDie) && (lifeTime > 0)) gameObject.SetActive(false); 

}

//---------------------------------------------------------------------------------------------------------	
// Pickup gathering on collision - Send sendValue to target's callFunction
function OnTriggerEnter(collider : Collider)
{
  // if collided with target - Follow it and Gather
  if (collider.tag == receiverTag) 
    if (speed > 0) Coroutine_MoveTo(collider.gameObject);
      else  GatherPickup(collider.gameObject);

}

function OnCollisionEnter(collision : Collision)
{
  // if collided with target - Follow it and Gather
  if (collision.collider.tag == receiverTag)
    if (speed > 0) Coroutine_MoveTo(collision.collider.gameObject);
      else  GatherPickup(collision.collider.gameObject);

}

//---------------------------------------------------------------------------------------------------------	
// Gathering pickup - Send sendValue to target's callFunction
function GatherPickup (gatherer: GameObject)
{
  // Send sendValue to target's callFunction
  if (sendValue != 0) gatherer.BroadcastMessage(callFunction, sendValue, SendMessageOptions.DontRequireReceiver);
  if (sendStringValue != "") gatherer.BroadcastMessage(callFunction, sendStringValue, SendMessageOptions.DontRequireReceiver);
  GetComponent.<Collider>().enabled = false;
  
   if (GetComponent.<AudioSource>() && GetComponent.<AudioSource>().clip)  GetComponent.<AudioSource>().enabled = true; 
     
   if (GetComponent.<ParticleSystem>()) 
    {
      GetComponent.<ParticleSystem>().Play(true);
      yield WaitForSeconds(GetComponent.<ParticleSystem>().duration);
      GetComponent.<ParticleSystem>().Stop();
    }
    else yield WaitForEndOfFrame();
	
			
  gameObject.SetActive(false); 
  
}

//---------------------------------------------------------------------------------------------------------	