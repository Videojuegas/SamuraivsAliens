using UnityEngine;
using System.Collections;

public class background : MonoBehaviour {

	public float speed = 2f;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		transform.Rotate (0, 0, Time.deltaTime * speed);
	}
}
