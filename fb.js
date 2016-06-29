var login = require("facebook-chat-api");
var fs = require('fs');

login({email: "email@email.com", password: "senha"}, function callback (err, api) {
	if(err) return console.error(err);

	api.setOptions({selfListen: true});

	var humman = true

		var stopListening = api.listen(function(err, event) {

			switch(event.type) {
				case "message":
					if(humman === true) {

						if(event.body === '/stop') {
							api.sendMessage("Goodbye...", event.threadID);
							return stopListening();
						}
						api.markAsRead(event.threadID, function(err) {
							if(err) console.log(err);
						});


						if(isURL(event.body)) {

							var exec = require('child_process').exec, child;
							child = exec('java -jar get.jar ' + event.body,
									function (error, stdout, stderr){
										console.log('stdout: ' + stdout);
										console.log('stderr: ' + stderr);
										if(error !== null){
											console.log('exec error: ' + error);
										}
									});

							var yourID = 100005275054603;
							var msg = {
								body: "Server say:",
								attachment: fs.createReadStream(__dirname + '/page.html.zip')
							}
							api.sendMessage(msg, event.threadID);
							//api.sendMessage("Você mandou uma url!, que legal.", event.threadID);
							humman = false;
						}
					} else {
						humman = true;
					}
					break;
				case "event":
					console.log(event);
					break;
			}
		});
});



function isURL(str) {
	  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
					  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
				  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
				    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
					  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	    return pattern.test(str);
}


