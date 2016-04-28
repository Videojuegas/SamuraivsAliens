using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class script_creditos : MonoBehaviour {
	public float speed = 0.2f;
	public Text texto;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {

	}

	public void Volver_Menu_Principal(){
		Application.LoadLevel ("menu_principal");
	}
}
