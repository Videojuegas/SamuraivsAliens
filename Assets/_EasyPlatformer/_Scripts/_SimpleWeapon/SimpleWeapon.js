//---------------------------------------------------------------------------------------------------------	
// Script  to handle simple weapon
//---------------------------------------------------------------------------------------------------------	
#pragma strict
@script AddComponentMenu ("EasyPlatformer/SimpleWeapons/Weapon")


enum WeaponType {Projectile, Raycasted};

var emitter: Transform;			// Bullets and raycasts origin/direction
var type: WeaponType;			// Type of weapon	
var ammo: float = 10;			// Amount of ammo	
var ammoInPack: float = 10;		// Amount of ammo in ammo-pack 
var fireRate: float = 0.5;		// Weapon fireRate
var damage: float = 1;			// Raycasted Weapon damage
var raycastDistance: float = 1; // Max effective distance of Raycasted Weapon
var projectiles: SimplePool;	// Projectile prefab for Projectile Weapon


// Important internal variables - please don't change them blindly
private var hit : RaycastHit;
private var nextAttackTime: float;
@HideInInspector var carrier: GameObject;


//========================================================================================================
// Initialize
function Start () 
{
  if (ammo <= 0) ammo = Mathf.Infinity; 
  if (type == WeaponType.Projectile) projectiles.Prepare(gameObject);
  if (!emitter) emitter = transform;
  
}

//---------------------------------------------------------------------------------------------------------	
// Add Ammo
function AddAmmo (amount: int) 
{
  ammo += amount;
}

//---------------------------------------------------------------------------------------------------------	
// Add AmmoPack
function AddAmmoPack () 
{
  ammo += ammoInPack;
}

//---------------------------------------------------------------------------------------------------------	
// Process shooting
function Fire () 
{
   if (ammo > 0  &&  nextAttackTime < Time.time)
 	{
	   if (type == WeaponType.Raycasted)
	     {
		   if (Physics.Raycast (emitter.position, emitter.forward, hit, raycastDistance)  &&   !hit.collider.isTrigger) 
		     hit.collider.SendMessage("ApplyDamage", emitter.forward * damage, SendMessageOptions.DontRequireReceiver);

		   Debug.DrawRay  (emitter.position, emitter.forward * raycastDistance, Color.red, 0.1);
	     }
	    else
	      var bullet: GameObject = projectiles.GetObject(0);
	      if (bullet)
	        {
	          bullet.transform.position = emitter.position;
	          bullet.transform.rotation = emitter.rotation;
	          
	          if (carrier && bullet.GetComponent.<Collider>().enabled && carrier.GetComponent.<Collider>())  Physics.IgnoreCollision(bullet.GetComponent.<Collider>(), carrier.GetComponent.<Collider>());
	          
			}

  
	  ammo--;
	  nextAttackTime = Time.time + fireRate;
	  
	  if (ammo <= 0 && carrier) carrier.SendMessage("OutOfAmmo",  SendMessageOptions.DontRequireReceiver);
 	}
 	
  
}

//---------------------------------------------------------------------------------------------------------	