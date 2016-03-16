	var rightnow = new Date();

	setInterval(function(){
		var rightnow = new Date();
		$('#timeclock').empty();
		$('#timeclock').append(rightnow.getHours() + ":" + rightnow.getMinutes() + ":" + rightnow.getSeconds());
	},100);

// firebase
	var FBdata = new Firebase("https://trainz.firebaseio.com/");

//global vars--------------------------------------------
	var localName = "";
	var localstarth = 0;
	var localstartm = 0;
	var localnowh = 0;
	var localnowm = 0;
	var localDestination = "";


//onclick function submits new child---------------------
	$('#submit').on('click', function(){

		localName = $('#name').val();
		localstarth = $('#starth').val().trim();
		localstartm = $('#startm').val().trim();
		localnowh = $('#localhours').val().trim();
		localnowm = $('#localminutes').val().trim();
		localDestination = $('#destination').val().trim();

		if (localName == ""){localName = "??????????";}
		if (localstarth == ""){localstarth = 0;}
		if (localstartm == ""){localstartm = 0;}
		if (localnowh == ""){localnowh = 0;}
		if (localnowm == ""){localnowm = 0;}
		if (localDestination == ""){localDestination = "??????????";}

		var newTrain = {

			name: localName,
			starth: localstarth,
			startm: localstartm,
			nowh: localnowh,
			nowm: localnowm,
			destination: localDestination
		}

		FBdata.push(newTrain);

		return false;
	});





//child added function-----------------
	FBdata.on('child_added', function(childSnapshot){

	//set local vars
		var localName = childSnapshot.val().name;
		var localstarth = childSnapshot.val().starth;
		var localstartm = childSnapshot.val().startm;
		var localhours = childSnapshot.val().nowh;
		var localminutes = childSnapshot.val().nowm;
		var localDestination = childSnapshot.val().destination;

	//convert time into gross minutes
		var minStart = tominutes(localstarth, localstartm);
		var minInt = tominutes(localhours, localminutes);
		var minNow = tominutes(new Date().getHours(), new Date().getMinutes());

	//these hold the converted time for departure and intervals
		var tempStart = toTime(localstarth, localstartm);
		var tempInt = toTime(localhours, localminutes);
		// var tempnow = toTime(new Date().getHours(), new Date().getMinutes());
	

	//the goal, and a loop breaker
		var nextTrain = minStart;
		var breaker = 0;

	//consolelog to make sure it's doing what I think it is

	//was having difficulty with the for loop, making sure my vars are int's
	parseInt(minStart);
	parseInt(minInt);
	parseInt(minNow);

	//loop to add intervals to the 
	for (x = 0; x < 2000; x++ ){

		if (nextTrain < minNow) {nextTrain = nextTrain + minInt;}

	}

//log the train schedules in a chart
	writer('#trainname', localName);
	writer('#traindestination', localDestination);
	writer('#traindeparture', tempStart);
	writer('#traininterval', tempInt);
	writer('#trainnextdeparture', toTime(Math.floor(nextTrain/60), (nextTrain%60)));

	},function(errorObject){
		console.log("the read failed: " + errorObject.code);
	});
//end child event ----------------------------------

//appends something into somewhere
	function writer(a, b){
		$(a).append("<br>" + b);
	};

// converts hours and minutes into a string with ":"
	function toTime(a , b){

		var hours = a;
		var minutes = b;
		hours = hours.toString();
		minutes = minutes.toString();
		if (b.length < 2){minutes = "0" + minutes};
		var time = hours + ":" + minutes

		return time;

	};

//converts hours and minutes into gross minutes
	function tominutes(a, b){

		var minutes = (60*parseInt(a, 10)) + parseInt(b, 10);

		return minutes;
	};

	console.log(toTime(3,4));
	console.log(toTime(3,12));
