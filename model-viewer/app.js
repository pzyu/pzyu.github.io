
var userId = "u_37";

$(document).ready(function(){
	var my_scene_id = 1;
	var my_scene_name = "this is my scene name";
	
	/* define a function called request */
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
			url: 'https://www.hiverlab.com/th/app_api/development/GetOSSLink.php',
			success: function(data)
			{
				location.reload(true);
				//messageBox.text('Done.');
                console.log("response: " + data);
			}
		});
	};
	
	request();
	
	//to call request, use request() as above//
});	