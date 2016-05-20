//---------------------------------------------------------------------------------------------------------
// Service script for pooled objects or objects to pool 
// Script allow to pool objects to custom (or parent) pool manualy or onDisable
//---------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/SimplePool/Auto-pool object ")


var parentPool: SimplePool;		 // Link to PoolManager to add object


//=======================================================================================================
// Automatically pool object to parent pool
function OnDisable  () 
{
  Invoke("Pool", 0.1);
  
}

//---------------------------------------------------------------------------------------------------------
// Call to - Pool objects to current(parent) pool manualy 
function Pool () 
{
  if (parentPool) parentPool.PoolObject(gameObject);
     else 
       Debug.Log ("parentPool is missing in SimplePoolObject component of " + gameObject.name);
}

//---------------------------------------------------------------------------------------------------------