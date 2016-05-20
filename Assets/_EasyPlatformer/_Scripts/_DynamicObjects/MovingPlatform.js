//-------------------------------------------------------------------------------------------------------------------------
// Script processes moving platform and allows them to  properly carry other objects on them
//-------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/DynamicObjects/Moving Platform")


// List of looping types
enum LoopType 
 { 
   Once,		 // Only one cycle
   Cycled,		 // Infinite amounts of cycles
   PingPong,	 // Move object in another direction when it gets first/last point of path
   SeveralTimes  // Repeat loop several times (specified in numberOfLoops)
 }


var waypoints: Vector3[];						// List of movement path waypoints
var movementSpeed: float = 5.0;					// Speed of object movement along the path
var movementSmoothness: float = 0.1;	  		// How far should object be to waypoint to choose new one - affects movement smoothness
var loopingType: LoopType;						// Choose one of looping type to use
var numberOfLoops: int = 0;						// How much loops should be performed before stop. Use this parameter if loopingType=SeveralTimes



// Important internal variables - please don't change them blindly
private var dummy: GameObject;
private var targetPosition : Vector3;
private var currentWaypoint: int = 0;
private var direction: int = 1;
private var loopNumber: int = 1;


//==================================================================================================================================
// Initialize
function Start () 
{
  
  dummy = new GameObject(gameObject.name+"_dummy");
  dummy.transform.position = transform.position;
  dummy.transform.rotation = transform.rotation;
  dummy.transform.localScale = Vector3.one;
  
  targetPosition = waypoints[currentWaypoint];
  if (movementSmoothness <= 0) movementSmoothness = 0.1;
  
}

//-------------------------------------------------------------------------------------------------------------------------
// Process movement according to settings
function Update () 
{

  dummy.transform.position = transform.position;
  dummy.transform.rotation = transform.rotation;
  
  
 // Process movement if waypoint exists and there is no delay assigned to it
 if (currentWaypoint >= 0) 
  {

   // Activate waypoint when object is closer than movementSmoothness
   if(Vector3.Distance(transform.position, targetPosition) < movementSmoothness) 
    {
      // Select next waypoint according to direction 
      currentWaypoint += direction;
       
      // Choose next waypoint/actions according to loopingType, if object reaches first or last  waypoint
      if (currentWaypoint > waypoints.Length-1  ||  currentWaypoint < 0)
  	    switch (loopingType)
  		   {
			  case LoopType.Once: 
			    currentWaypoint = -1;
			  break;
			  
			  case LoopType.Cycled:
			  	currentWaypoint = 0;
			  break;
			  
			  case LoopType.PingPong:
			  	 direction = -direction;
			  	 currentWaypoint += direction;
			  break;
			  
			  case LoopType.SeveralTimes:
			    if (loopNumber < numberOfLoops) 
			       {
			        currentWaypoint = 0;
			        loopNumber++;
			       }
			        else
			         currentWaypoint = -1;
			  break;
   		   }
   		   

   	  // Get/update next waypoint XYZ position in World coordinates
	   if(currentWaypoint >= 0)  targetPosition = waypoints[currentWaypoint];
	  	   else
		     currentWaypoint -= direction;
   
   }

	// Move without rotation
	 transform.position = Vector3.MoveTowards(transform.position, targetPosition, movementSpeed * Time.deltaTime);   
	   
 }
 
}


//-------------------------------------------------------------------------------------------------------------------------
function OnCollisionExit(collision : Collision) 
{
   collision.transform.parent = null;
   
}	

//-------------------------------------------------------------------------------------------------------------------------	
function OnCollisionEnter (collision : Collision) 
{ 
   if (collision.gameObject && dummy)  collision.transform.parent = dummy.transform;

}

//-------------------------------------------------------------------------------------------------------------------------	
// Draw debug visualization
function OnDrawGizmos() 
{
   Gizmos.color = Color.gray;
   for (var i: int = 0; i < waypoints.Length; i++)
        {
           Gizmos.DrawWireSphere(waypoints[i], 0.1);
           if (i < waypoints.Length-1) Gizmos.DrawLine (waypoints[i], waypoints[i+1]);
         }
 
 }
 
//-------------------------------------------------------------------------------------------------------------------------	