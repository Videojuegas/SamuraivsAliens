//---------------------------------------------------------------------------------------------------------	
// This Material script allows object to react on damage.
// Count damage and destroy (and replace to wreck) the object when durability is 0 or less
//---------------------------------------------------------------------------------------------------------	
#pragma strict
@script AddComponentMenu ("EasyPlatformer/SimpleWeapons/Damageable Object")


var physicReactivity: float = 1;	// How strong will object react on bullet collision 			
var durability: float;				// How much damage can be applied to object (if 0 - )
var wreck: GameObject;				// Wreck object to replace current object after destruction (only if type = destructable, just leave it empty if you don't need this feature)


// Important internal variables - please don't change them blindly
private var wreckInstance : GameObject;


//========================================================================================================
// Initialize
function Start () 
{
   // Add collider if it's missed and Rigidbody if needed
   if (!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider);
   if (!GetComponent.<Rigidbody>()  &&  physicReactivity > 0) gameObject.AddComponent(Rigidbody);
   
   // Set durability and Create wreck object if needed
   if (durability <= 0) durability = Mathf.Infinity;
    else  
	 if (wreck)
	     {
	       wreckInstance = Instantiate (wreck, transform.position, transform.rotation);
	       wreckInstance.SetActive(false);
	       wreckInstance.transform.parent = transform;
	     }
	      else
            Debug.Log("Wreck object is missed! Check: " + gameObject.name);
     
     
   if (GetComponent.<AudioSource>())  GetComponent.<AudioSource>().playOnAwake = false;  
   // trigger particles if there is particleSystem attached  
    if (GetComponent.<ParticleSystem>()) 
      {
       GetComponent.<ParticleSystem>().Stop();
       GetComponent.<ParticleSystem>().Clear();
      }    
        
}


//---------------------------------------------------------------------------------------------------------
//  Decrease durability and destroy object 
function ApplyDamage (damage: float) 
{ 
  if (durability > damage) durability -= damage;
    else 
     {
      // Create wreak object if it's exist in properties
       if (wreckInstance) 
        {
         wreckInstance.transform.parent = null;
         wreckInstance.SetActive(true);
         yield WaitForEndOfFrame();
        }
           
	   Destroy(gameObject);
     }
  
   if (GetComponent.<AudioSource>() && GetComponent.<AudioSource>().enabled &&  GetComponent.<AudioSource>().clip)  GetComponent.<AudioSource>().PlayOneShot(GetComponent.<AudioSource>().clip);     
   if (GetComponent.<ParticleSystem>()) 
    {
      GetComponent.<ParticleSystem>().Play(true);
      yield WaitForSeconds(GetComponent.<ParticleSystem>().duration);
      GetComponent.<ParticleSystem>().Stop();
    }
     
}

//---------------------------------------------------------------------------------------------------------	
//  Decrease durability and destroy object 
function ApplyDamage (damageForce: Vector3) 
{
  // ApplyForce
  if (physicReactivity > 0) GetComponent.<Rigidbody>().AddForce(damageForce * physicReactivity, ForceMode.Impulse);

  ApplyDamage(damageForce.magnitude);
  
}

//---------------------------------------------------------------------------------------------------------