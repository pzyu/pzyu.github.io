
var userId = "u_37";

$(document).ready(function(){
    /*
	var my_scene_id = 1;
	var my_scene_name = "this is my scene name";
	
	/* define a function called request
	var request = function() 
	{
		//actual ajax function with proper syntax//
		$.ajax(
		{
			//defined variables to use in jQuery.//
			beforeSend: function() 
			{
				//alert("sort order called");
				//messageBox.text('Updating the sort order in the database.');
			},
			complete: function() 
			{
				//messageBox.text('Database has been updated.');
			},
			ata: {'user_id':userId},
			type: 'post',
			url: 'https://www.hiverlab.com/th/app_api/development/GetOSSLink',
			success: function(data)
			{
				location.reload(true);
				//messageBox.text('Done.');
                console.log("response: " + data);
			}
		});
	};
	
	request();
    */
    //to call request, use request() as above//
    async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response; // parses JSON response into native JavaScript objects
    }

    postData('https://www.hiverlab.com/th/app_api/development/GetOSSLink', { user_id: userId })
    .then(data => {
    console.log(data); // JSON data parsed by `response.json()` call
    });
});	
