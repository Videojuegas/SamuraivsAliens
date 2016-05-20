//---------------------------------------------------------------------------------------------------------
// Script handles weapon projectiles
//---------------------------------------------------------------------------------------------------------
#pragma strict
@script RequireComponent(Rigidbody)
@script AddComponentMenu ("EasyPlatformer/SimpleWeapons/Projectile")

var speed: Vector3 = Vector3(0, 0, 10);		// Projectile movement speed	
var damageValue: float = 1;					// Damage that will be  sent to hitted object
var lifeTime: float = 0;  				    // After this time object will be destroyed
var disableOnCollision: boolean = true;		// Should  projectile be disabled on any collision
var ignoredTag: String = "Player";			// Ignore objects with  this tag


// Important internal variables - please don't change them blindly
private var timeToDisable: float;


//========================================================================================================
// Initialize
function Start () 
{
   // Add collider if it's missed and Rigidbody if needed
   if (!GetComponent.<Collider>()) gameObject.AddComponent(BoxCollider);
   
    GetComponent.<Rigidbody>().useGravity = false;
    GetComponent.<Rigidbody>().isKinematic = true;
}

//---------------------------------------------------------------------------------------------------------	
// Initialize 
function OnEnable () 
{ 
   // Setup Time when object will be disabled
    timeToDisable = lifeTime + Time.time;  
    
    if(GetComponent.<Renderer>()) GetComponent.<Renderer>().enabled = true;
    if(GetComponent.<Rigidbody>()) GetComponent.<Rigidbody>().isKinematic = false;
    GetComponent.<Collider>().enabled = true;
    
    if (GetComponent.<AudioSource>())  GetComponent.<AudioSource>().playOnAwake = false;  
    if (GetComponent.<ParticleSystem>()) 
      {
       GetComponent.<ParticleSystem>().Stop();
       GetComponent.<ParticleSystem>().Clear();
      }
    
}

//---------------------------------------------------------------------------------------------------------	
// Disable projectile and trigger attached(if exists) particleSystem
function Disable () 
{  
   if(GetComponent.<Renderer>()) GetComponent.<Renderer>().enabled = false;
   if(GetComponent.<Rigidbody>()) GetComponent.<Rigidbody>().isKinematic = true;
   GetComponent.<Collider>().enabled = false;
   
   if (GetComponent.<AudioSource>() && GetComponent.<AudioSource>().clip)  GetComponent.<AudioSource>().PlayOneShot(GetComponent.<AudioSource>().clip);   
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
// Destroy the object if it lifeTime has expired
function LateUpdate () 
{
   if (lifeTime > 0  && Time.time > timeToDisable) Disable();
     else transform.Translate(speed * Time.deltaTime);
   
}

//---------------------------------------------------------------------------------------------------------
// Send damage to suitable object and disable the projectile if needed
function OnTriggerEnter (other : Collider)
{  
  if (!other.isTrigger  &&  other.tag != ignoredTag)
   {
	  other.BroadcastMessage("ApplyDamage", damageValue, SendMessageOptions.DontRequireReceiver);
	  if (disableOnCollision) Disable();

   }
}


function OnCollisionEnter(collision : Collision) 
{ 
   OnTriggerEnter(collision.collider);
    
}

//---------------------------------------------------------------------------------------------------------