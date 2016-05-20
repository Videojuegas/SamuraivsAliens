//----------------------------------------------------------------------------------
// Script provides simple interface to enable/disable some lists of components
//----------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/Utility/Simple Activator")


var components: Behaviour[];	// List of components to handle


//=============================================================================================================
// Process change activation state to popposite
function ChangeActivationState () 
{
    for (var component : Behaviour in components)  
      if (component.enabled) component.enabled = false; else component.enabled = true; 
}

//----------------------------------------------------------------------------------
// Process activation
function Activate () 
{
    for (var component : Behaviour in components) component.enabled = true; 
}

//----------------------------------------------------------------------------------
// Process deactivation
function Deactivate () 
{
    for (var component : Behaviour in components) component.enabled = false; 
    
}

//----------------------------------------------------------------------------------