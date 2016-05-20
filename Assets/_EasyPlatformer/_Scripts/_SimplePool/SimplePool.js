//--------------------------------------------------------------------------------------------------------
// This is the class to handle simple objects pool.
// It allows to create pool of objectPrefab clones in needed quantity and  handle their extraction or pooling back
// If needed you can add any object to pool. It's  better to use PooledObject script with objects to add.
//--------------------------------------------------------------------------------------------------------
#pragma strict


class SimplePool
{

  var objectPrefab: GameObject;		  	// Prefab to instanciate and  pool
  var quantity: int = 1;				// Quantity of instances
  
  
// Important internal variables - please don't change them blindly
  private var Pool = Array();			// Array of all stored objects
  private var mainObject: GameObject;
 
 
//=======================================================================================================
// Preload all objects in needed quantity (specified in PreloadObjects list) to pool 
function Prepare (mainGameObject: GameObject) 
{
  mainObject = mainGameObject;
  
  // Instantiate object and reset it transformation. Assign it as child to Pool
  if(objectPrefab && mainObject)
   {
      var newObj: GameObject;
      var poolBackScript: SimplePoolObject;
      
	  for (var i=0; i<(quantity); i++)
	    {
		  newObj = mainObject.Instantiate(objectPrefab) as GameObject;
		   
		    // Add poolBack script	 
			poolBackScript = newObj.AddComponent.<SimplePoolObject>() as SimplePoolObject;
			poolBackScript.parentPool = this;
				
	      PoolObject(newObj);
	    }
	    
   }
   else 
	 Debug.LogWarning("objectPrefab or mainGameObject missed!");
  
}

//------------------------------------------------------------------------
// Extract gameObject from pool by ID in the pool
function GetObject(id: int): GameObject
{
  var gameObj: GameObject;
  
  if(Pool.length > id)
	 {
		gameObj = Pool[id] as GameObject;
		Pool.RemoveAt(id);
		 
		if (gameObj)
		  {
			gameObj.transform.parent = null;
			gameObj.SetActive(true);
			
   		    return gameObj;
		  }
		  
     }
     else 
	   Debug.Log("You've tried to get object with ID outside of Pool length!");
	   
    return null;
}


//------------------------------------------------------------------------
// Pool an object to pool and reset object transformation. 
function PoolObject (object: GameObject)
{
  if (object && mainObject)
   {
      
     // Reset object position and rotation(and make it a child of this game object) and disable it
	 object.transform.parent = mainObject.transform;
	 object.transform.localPosition = Vector3.zero;
	 object.transform.localRotation = mainObject.transform.localRotation;
	 
	 object.SetActive(false);
	 
	  if(object.GetComponent.<Rigidbody>() && !object.GetComponent.<Rigidbody>().isKinematic)
	    {
	      object.GetComponent.<Rigidbody>().velocity = Vector3(0,0,0);
	      object.GetComponent.<Rigidbody>().angularVelocity = Vector3(0,0,0);
	    }
	    
     // Add  the new object to pool
	 Pool.Add(object);
   }

}

//------------------------------------------------------------------------
}