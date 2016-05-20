//-------------------------------------------------------------------------------------------------------------------------
// Script applies force to objects inside it clollider according to some rules
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script RequireComponent(Collider)
@script AddComponentMenu ("EasyPlatformer/DynamicObjects/Force Applier")


// List of forcing types
enum ForcingType 
 { 
   SingleImpulse,			// Just add single impulse
   ImpulseAmplifier,		// Add impulse related to collision velocity
   ConstantForce,		 	// Add constant force while object inside collider
   DistanceRelated,			// Add force related to distance from origin while object inside collider
   InvertedDistanceRelated	// Add inverted force related to distance from origin while object inside collider
 }


var force: Vector3;				// Force direction and power
var affectingType: ForcingType; // How force should be applied


//==================================================================================================================================
// Initialize
function Start () 
{
  if (affectingType == ForcingType.ImpulseAmplifier)  GetComponent.<Collider>().isTrigger = false;
  
}

//-------------------------------------------------------------------------------------------------------------------------
// Apply force to objects inside it clollider according to affectingType
function OnTriggerStay(other : Collider)
{
 if(other.GetComponent.<Rigidbody>())
  switch (affectingType)
   { 
    case ForcingType.ConstantForce:  
    	other.GetComponent.<Rigidbody>().AddForce(force, ForceMode.Force);
    break;
    
 	case ForcingType.DistanceRelated:  
 		other.GetComponent.<Rigidbody>().AddForce(force * Vector3.Distance(transform.position, other.transform.position)/GetComponent.<Collider>().bounds.max.magnitude, ForceMode.Force);
    break;
 	
 	case ForcingType.InvertedDistanceRelated:  
 		other.GetComponent.<Rigidbody>().AddForce(force * (1 - Vector3.Distance(transform.position, other.transform.position)/GetComponent.<Collider>().bounds.max.magnitude), ForceMode.Force);
    break;
 	
   }
   
   Debug.DrawRay(transform.position, force, Color.red);
   
}

//-------------------------------------------------------------------------------------------------------------------------	
// Apply force to objects inside it clollider according to affectingType
function OnTriggerEnter (other : Collider)
{ 
    if (affectingType == ForcingType.SingleImpulse)  
      if(other.GetComponent.<Rigidbody>()) other.GetComponent.<Rigidbody>().AddForce(force, ForceMode.Impulse);
 	
}

//-------------------------------------------------------------------------------------------------------------------------
// Apply force to objects inside it clollider according to affectingType
function OnCollisionEnter(collision : Collision) 
{
   if (affectingType == ForcingType.ImpulseAmplifier)   
    {
     if(collision.rigidbody)  collision.rigidbody.AddForce(force * collision.relativeVelocity.magnitude, ForceMode.Impulse);	
    }
     else
      OnTriggerEnter(collision.collider);
   
}

//-------------------------------------------------------------------------------------------------------------------------
// Apply force to objects inside it clollider according to affectingType
function OnCollisionStay(collision : Collision) 
{
  OnTriggerStay(collision.collider);
  
}

//-------------------------------------------------------------------------------------------------------------------------	