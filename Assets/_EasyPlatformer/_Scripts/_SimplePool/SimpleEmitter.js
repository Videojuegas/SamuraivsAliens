//-----------------------------------------------------------------------------------------	
// Use this simple script to simulate any pickup holders (like chest for example)
// It also can be used  to any other holders and emitters
// There are several different conditions for emitting: manually, onDestruction, byTimer, onCollision
//-----------------------------------------------------------------------------------------	
#pragma strict
@script AddComponentMenu ("EasyPlatformer/SimplePool/Simple Emmiter")


// Emit conditions type
public enum EmittingType { manually, onDestruction, byTimer, onCollision } 


var emittingCondition: EmittingType;	   // Emitting conditions
var onePerEvent: boolean = false;     	   // Emit only one pickup per event (EmittPickups call)
var positionShift: Vector3;				   // Shift initial pickup position to this  value
var timer: float;						   // Emit after this time (if EmittingType is byTimer)
var objects: SimplePool;		   		   // Prefab and quantity of objects "inside" this holder


// Important internal variables. Please don't change them blindly
private var startEmitOnTime: float;
private var AppClose: boolean = false;


//========================================================================
// Init
function OnEnable () 
{
   objects.Prepare(gameObject);
   
   startEmitOnTime = Time.time + timer;
  
}

//------------------------------------------------------------------------
// Used to indicate when user closing application to prevent redudant emitting
function OnApplicationQuit ()
{
  AppClose = true;
  
}

//------------------------------------------------------------------------
// Emitt objects when byTimer (every "timer" seconds)
function FixedUpdate () 
{
  if (emittingCondition == EmittingType.byTimer)
     if (startEmitOnTime < Time.time) 
  	    {
  	      Emitt ();
  	      startEmitOnTime = Time.time + timer;
  	    }
  	     
}

//------------------------------------------------------------------------
// Emit objects manually if holder isn't empty 
function Emitt () 
{
  var extractedObject: GameObject;
  
  if (onePerEvent) 	 // Emmit just one object (next one will be emmited at next call)
 	{
 	  extractedObject = objects.GetObject(0);
 	  if(extractedObject) extractedObject.transform.position = transform.position + positionShift;
 	}
       else   // Emmit all objects simultaneously
		  for (var i=0; i < objects.quantity; i++ )
		 	{
		 	  extractedObject = objects.GetObject(0);
		 	  if(extractedObject) extractedObject.transform.position = transform.position + positionShift;
		 	}
   
}

//------------------------------------------------------------------------
// Emit objects when object should be destroyed 
function OnDestroy () 
{
  if (!AppClose)
	if (emittingCondition == EmittingType.onDestruction) Emitt ();


}

//------------------------------------------------------------------------
// Emit objects at collision
function OnCollisionEnter(collision : Collision) 
{
   if (emittingCondition == EmittingType.onCollision) 	Emitt();
   
}

function OnTriggerEnter(collider : Collider)
{
   if (emittingCondition == EmittingType.onCollision) 	Emitt();
   
}

//------------------------------------------------------------------------