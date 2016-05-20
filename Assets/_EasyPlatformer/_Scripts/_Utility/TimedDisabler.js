//--------------------------------------------------------------------------------------------------------
// The script disables current object after lifeTime time
//--------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/Utility/Timed Disabler")


var lifeTime: float = 3;  				   // After this time object will be destroyed
var onlyIfNotVisible: boolean = false;     // Destroy only when object is no longer visible by any camera
var disableOnly: boolean = false; 		   // Disable instead of disabling 


// Important internal variables, please don't change them blindly
private var ReadyToDestroy: boolean = true;
private var TimeToDestroy: float;


//=======================================================================================================
// Setup Time when object will be disabled
function OnEnable () 
{
    TimeToDestroy = lifeTime + Time.time;  
	if (onlyIfNotVisible && GetComponent.<Renderer>()) ReadyToDestroy = false;
	
} 

//---------------------------------------------------------------------------------------------------------	
// Destroy the object if it lifeTime has expired
function LateUpdate () 
{
   if (Time.time > TimeToDestroy && ReadyToDestroy)  
      if (disableOnly) gameObject.SetActive(false); 
         else Destroy(gameObject);
         

}

//---------------------------------------------------------------------------------------------------------	
// Check visibility to allow destroying (only if onlyIfNotVisible=true)
function OnBecameInvisible () 
{
    if (onlyIfNotVisible) ReadyToDestroy = true;
}


function OnBecameVisible () 
{
    if (onlyIfNotVisible) ReadyToDestroy = false;
}

//---------------------------------------------------------------------------------------------------------	