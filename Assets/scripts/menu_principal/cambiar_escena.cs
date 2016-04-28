using UnityEngine;
using System.Collections;

public class cambiar_escena : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void CambiarEscena(string level){
		Application.LoadLevel (level);
	}

	public void Salir(){
		Application.Quit ();
	}

}
