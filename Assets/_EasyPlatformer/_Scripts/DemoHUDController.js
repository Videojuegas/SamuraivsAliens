//---------------------------------------------------------------------------------------------------------	
// Simple demo-script to process some interacw elements
//---------------------------------------------------------------------------------------------------------	
#pragma strict


var buttonPause: GUITexture;
var iconCurrentWeapon: GUITexture;
var lifes: GUIText; 
var health: GUIText;
var coins: GUIText;
var ammo: GUIText;
var weaponsIcons: Texture[];
var gameOver: GameObject;


var pauseMenu: MenuWindow;
var playerBehavior: PlayerBehavior;
var weaponManager: SimpleWeapon_Manager;


//==================================================================================================================================
// Init
function Start () 
{
   if (!playerBehavior) playerBehavior = GetComponent(PlayerBehavior);
   if (!weaponManager) weaponManager = GetComponent(SimpleWeapon_Manager);
   if (gameOver) gameOver.SetActive(false); 
}


//---------------------------------------------------------------------------------------------------------	
// Process HUD
function Update () 
{
  if (playerBehavior.deathNum > playerBehavior.maxfRessurectionsNum)
    { 
      //if (gameOver) {gameOver.SetActive(true);}
      //Cambiar a nuestra escena
      Application.LoadLevel ("nivel_perdido");
      
    }
     
  var currentWeapon: int = weaponManager.GetCurrentWeaponID();
  if (iconCurrentWeapon && weaponsIcons[currentWeapon]) iconCurrentWeapon.texture = weaponsIcons[currentWeapon];
  
  if (pauseMenu && Input.GetKeyDown(KeyCode.Mouse0) && buttonPause.HitTest(Input.mousePosition)) pauseMenu.enabled = !pauseMenu.enabled;
  var lives:int = playerBehavior.maxfRessurectionsNum -playerBehavior.deathNum;
  //lifes.text = "armo : " + playerBehavior.life.ToString()+ " lives:" +lives.ToString();
  //var cantidad_de_vidas = playerBehavior.life;
  var ciclo = 0;
  lifes.text = "";
  health.text = "";
  while (ciclo < lives + 1 ){
  	lifes.text = lifes.text + "♥";
	ciclo += 1;
  }
  ciclo = 0;
  health.text = "[";
  while (ciclo < playerBehavior.life ){
	  health.text += "◘";
	  ciclo += 1;
  }
  var life_copy = playerBehavior.life;
  while (life_copy < 10 ){
	  health.text += " ";
	  life_copy +=1;
  }
  
  health.text += "]";

  coins.text = "○ x " + playerBehavior.coins;
  
  var currentWeaponAmmo: int = weaponManager.GetCurrentWeaponAmmo();
  if (currentWeaponAmmo >= 0  &&  currentWeaponAmmo < 9999999) 
    {
      ammo.enabled = true;
      ammo.text = "AMMO : " + currentWeaponAmmo.ToString();
    }
   else ammo.enabled = false;
   
}

//---------------------------------------------------------------------------------------------------------	