//------------------------------------------------------------------------------------------------------------------------
// Script allows to hold/extend list of known passwords and use them (check if known) ondemand
//------------------------------------------------------------------------------------------------------------------------
#pragma strict
@script AddComponentMenu ("EasyPlatformer/Player/Known Passwords manager")


var knownPasswords: String[];  // List of known passwords


//==================================================================================================================================
// Try to find requested password in knownPasswords list
function UsePassword (trigger: UniversalTrigger) 
{
   for (var password: String in knownPasswords)
      if (password == trigger.password) 
        {
         trigger.TriggerAction();
         break;
        }
   
}

//------------------------------------------------------------------------------------------------------------------------
// Remember new password
function AddPassword(newPasswords: String)
{
  var array = new Array (knownPasswords);
  array.length++;
					    
  knownPasswords = array.ToBuiltin(String) as String[];
  knownPasswords[knownPasswords.Length - 1] = newPasswords;
}

//------------------------------------------------------------------------------------------------------------------------