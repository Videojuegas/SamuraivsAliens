using UnityEngine;
using System.Collections;

public class RockKiller : MonoBehaviour {
    // Use this for initialization
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    void OnTriggerEnter(Collider collider)
    {
        if (collider.gameObject.tag == "Rockkill")
        {
            Destroy(collider.gameObject);
        }
    }
}
