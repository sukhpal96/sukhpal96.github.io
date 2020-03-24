// Connecting to the Firebase database
var db = firebase.database();

// Going to where the cars are in the database
var ref = db.ref('cars');

// Getting the data from the database
ref.on('value', gotData, gotError);

// Setting the variables for later
var vehicles;
var manufacturers = [];
var youtube_response;
var nc_manufacturer;

// Creating the variables to use as part of the login
let myCar, newCar;

// A message appears when logged in
let logged_in = localStorage.getItem('logged_in');

// Creating temporary variables to check if they're blank or not
let t_newCar, t_oldCar;

// The API key for the Google Maps
const MAPS_API_KEY = "AIzaSyDO52MlxFomqwCbpDXLHt2n3IVNgMvWP-M";

// Obtaining the new car details (checking if there's a saved car)
t_newCar = localStorage.getItem("newCar");

// Obtaining the data for the old car (checking if there's a saved car)
t_oldCar = localStorage.getItem("data");

// Hiding the clear car button
$('#clear_car').hide();

// Setting a time out so that the YouTube video appears as it was getting ahead of it self and taking too long to obtain the gapi
setTimeout(() => {
	if(logged_in == 'true' && t_oldCar != "" && t_newCar != ""){
		$('#quiz_questions').hide();
		$('#quiz_answers').show();
		$('#clear_car').show();
		oldCar();
		getNewCar();
	}
},1000);

// Successfully got the data from the data then..
function gotData(data) {
	vehicles = data.val();
//	console.log(vehicles);
	getManufacturers(vehicles);
}

// If an error occurrs when retrieving the data..
function gotError(err) {
	console.error(err);
}

// Create temporary text to create a json object
var text = `{
	  "co2":"", 
	  "fuel_type":"",
	  "range":"",
	  "engine_capacity":"",
	  "transmission":"",
	  "manufacturer":"",
	  "model":""
	  }
`

//$('#quiz_questions').hide();
//$('#quiz_answers').show();
$('#quiz_answers').hide();
$('#errormessage').hide();

// Giving the answers a specific location
var answers = JSON.parse(text);

// Function for when 'Get Reccomendation' button is clicked
function getRecommendation(e) {

	// Stop page refreshing
	e.preventDefault();

	// Hide the error message 
	$('#errormessage').hide();

	// Create a new array for the cars
	var cars = [];
	
	// Store user inputs in json
	answers.co2 = $('#co2').val();
	answers.fuel_type = $('#fuel_type').val();
	answers.range = $('#range').val();
	answers.engine_capacity = $('#engine_capacity').val();
	answers.transmission = $('#transmission').val();
	answers.manufacturer = $('#manufacturer').val();
	answers.model = $('#model').val();
	
	// Test json output
	// console.log(answers);
	
	// Splits the data from the inputted value into an array shown in [ ]
	// eg. "0/99" = ["0","99"]
	
	// C02
	answers.co2 = answers.co2.split("/")
	

	// Changing the strings in the brackets to integer values
	answers.co2[0] = parseInt(answers.co2[0]);
	answers.co2[1] = parseInt(answers.co2[1]);


	// Range
	answers.range = answers.range.split("/")
	

	// Changing the strings in the brackets to integer values
	answers.range[0] = parseInt(answers.range[0]);
	answers.range[1] = parseInt(answers.range[1]);


	// Engine Capacity
	answers.engine_capacity = answers.engine_capacity.split("/")
	

	// Changing the strings in the brackets to integer values
	answers.engine_capacity[0] = parseInt(answers.engine_capacity[0]);
	answers.engine_capacity[1] = parseInt(answers.engine_capacity[1]);

	//console.log(vehicles);

	vehicles.forEach(car => {

		var C02_check = false;
		var Fuel_check = false;
		var Range_check = false;
		var Engine_check = false;
		var Trans_check = false;
		var Manuf_check = false;
		var Model_check = true; // temporarily true
		var Cost_check = true;


		// Check the C02
		if(car.CO2 >= answers.co2[0] && car.CO2 <= answers.co2[1]) {
			C02_check = true;
		// If the user left this blank then proceed
		} else if(isNaN(answers.co2[0]) && isNaN(answers.co2[1])) {
			C02_check = true;
		}

		// Check the fuel type
		if(car.fuelType == answers.fuel_type) {
			Fuel_check = true;
		// If the user left this blank then proceed
		} else if(answers.fuel_type == "") {
			Fuel_check = true;
		}

		// Check the Range
		if(car.maxRange >= answers.range[0] && car.maxRange <= answers.range[1]) {
			Range_check = true;
		// If the user left this blank then proceed
		} else if(isNaN(answers.range[0]) && isNaN(answers.range[1])) {
			Range_check = true;
		}	

		// Check if the user selected Electric or Hybrid
		if(!answers.fuel_type.includes("Electric") && !answers.fuel_type.includes("Hybrid")) {
			Range_check = true;
		}
		
		// Check the Engine Capacity
		if(car.engineCapacity >= answers.engine_capacity[0] && car.engineCapacity <= answers.engine_capacity[1]) {
			Engine_check = true;
		// If the user left this blank then proceed
		} else if(isNaN(answers.engine_capacity[0]) && isNaN(answers.engine_capacity[1])) {
			Engine_check = true;
		}

		//console.log(car.manufacturer == answers.manufacturer)

		// Check the manufacturer type
		if(car.manufacturer == answers.manufacturer) {
			Manuf_check = true;
		// If the user left this blank then proceed
		} else if(answers.manufacturer == "") {
			Manuf_check = true;
		}

		// Check the transmission
		// If there is an m in the tranmission type then the vehicle comes up under manual
		if(car.transmission.toLowerCase().includes("m") && answers.transmission == "Manual") {
			// Mark the selection as true and return
			Trans_check = true;
			// If there is an a in the transmission type then it is automatic and is not N/A 
		} else if(car.transmission.toLowerCase().includes("a") && answers.transmission == "Automatic" && car.transmission != "N/A") {
			Trans_check = true;
			// Otherwise, return any
		} else if(answers.transmission == "") {
			Trans_check = true;
		}

		//console.log(answers);
		//console.log(C02_check,Fuel_check,Range_check,Engine_check)

		// Check all above conditions 
		if(C02_check && Fuel_check && Range_check && Engine_check &&
		   Trans_check && Manuf_check && Model_check && Cost_check) {
			cars.push(car);
		} 
		
	});

	// Looks into the variable to see its contents
	//console.log(cars);
	//console.log(cars[0]);

	/* Quiz Complete */
	if(cars[0] != undefined){
		$('#quiz_questions').hide();
		$('#quiz_answers').fadeIn();

		oldCar();

		// Finding a car with lower CO2 than mine, if possible.
		cars.forEach((nc) => {
			if (nc.co2 < myCar.co2Emissions){
				newCar = nc;
			}
		})

		// No car with lower CO2 found
		if (newCar == undefined){
			newCar = cars[0];
		}

		localStorage.setItem('newCar',JSON.stringify(newCar));

		getNewCar();

	// Fade in error message
	} else {
		$('#errormessage').fadeIn();
	}
	
}

function oldCar() {
		// Get myCar from previous page
		myCar = JSON.parse(localStorage.getItem("data"));

		// Attributes being displayed in quiz form
		$('#registration_number').text(myCar.registrationNumber);
		$('#co2_figure').text(myCar.co2Emissions);
		$('#fuel').text(myCar.fuelType);
		$('#colour').text(myCar.colour);
		$('#make').text(myCar.make);
		$('#year').text(myCar.yearOfManufacture);
		$('#enginesize').text(myCar.engineCapacity);
		$('#axle').text(myCar.wheelplan);
}

function getNewCar() {
	// Getting the new car from previous login
	newCar = JSON.parse(localStorage.getItem("newCar"));

	// Attributes being displayed in quiz form
	$('#manufacturers').text(newCar.manufacturer);
	$('#models').text(newCar.model);
	$('#enginecapacities').text(newCar.engineCapacity);
	$('#fueltypes').text(newCar.fuelType);
	$('#CO2values').text(newCar.CO2);
	$('#fuelcosts').text(newCar.fuelCost);
	$('#enginespower').text(newCar.enginePower);
	$('#euroratings').text(newCar.euro);

	// Button for manufactuer website
	$('#manu').text(newCar.manufacturer);

	// Updating the new car description
	$('#description').text(newCar.model + " | " + newCar.description);

	//Adding the link to the button
	$('#manu-link')[0].href = "https://www." + newCar.manufacturer.replace(" ","")  + ".co.uk";

	//Putting in the logo for each manufacturer
	$('#manufacturer_logo')[0].src = "./images/icons/icon" + fixManufacturer(newCar.manufacturer) + ".png"

	nc_manufacturer = fixManufacturer(newCar.manufacturer)

	// Getting the appopriate YouTube video
	search(newCar.manufacturer + " " + newCar.model);


}

// Function to remove dots, spaces and hyphens 

function fixManufacturer(manufacturer) {
	manufacturer = manufacturer.replace(/\./g," ") 
	manufacturer = manufacturer.replace(/-/g,"");
	manufacturer = manufacturer.replace(/ /g,"");
    return manufacturer;
}

// Get a list of the manufacturers from the database

function getManufacturers(list) {

	var found = false;

	// Going through the list of cars from the database
	list.forEach((car) => {

		found = false;
		// Checking to see if the manufacturers have already been added when they are found
		manufacturers.forEach((manuf) => {
			if(manuf == car.manufacturer){
				found = true;
			}
		})
		// If not found in the list of manufacturers then add it
		if(!found){
			manufacturers.push(car.manufacturer);
		}

	})

	// Selecting the manufactuer drop down list on the quiz more page
	var mySelect = $('#manufacturer');
	// Adding the manufacturers to the drop down list 
	$.each(manufacturers, function(index, text) {
		mySelect.append(
			$('<option></option>').val(text).html(text)
		);
	});

	// Disable to get recommendation button until all data is available
	$('#getRec').prop('disabled',false);

}

// **YOUTUBE API**
// https://www.codexpedia.com/api/youtube-search-api-example-with-javascript-and-html
// https://developers.google.com/youtube/v3/docs/search/list#parameters
// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}
// Called automatically when YouTube API interface is loaded.
function onYouTubeApiLoad() {
    gapi.client.setApiKey('AIzaSyD9XCEHkCBzgy9CZVvP2acVqgP5FNYbfxY');
}
 
// Called when the search button is clicked in the html code
function search(search_term) {

	// Creating the query to find the video
	var query = search_term + " carwow review";
	
	// Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list({
		part: 'snippet',
        q:query
	});
	
    // Send the request to the API server, call the onSearchResponse function when the data is returned
    request.execute(onSearchResponse);
}

// Triggered by this line: request.execute(onSearchResponse);
function onSearchResponse(response) {
	
	// Response from Youtube API with video
	var responseString = JSON.stringify(response, '', 2);
	// Parse the Youtube response to get video links
	youtube_response = JSON.parse(responseString);

	// Extra variables
	let video = false;
	let videoId = "";

	// Loop through the Youtube response to find a video
	// Response contains channels and other data
	youtube_response["items"].forEach((el) => {
		// Check to only get one video
		if(!video){
			// Check if this is a video
			if(el.id.kind = "youtube#video") {
				// Save the video ID
				videoId = el.id.videoId;
				// Video found
				video = true;
			}
		}
	})

	// Embedding the video onto the page
	$('#youtube_video')[0].src = "https://www.youtube.com/embed/" + videoId;

}

function getMap(){

	// Taking in the postcode
	let postcode = $('#postcode')[0].value;

	//Removing all spaces from the postcode or city name
	postcode = postcode.replace(/ /g,"");

	// Passing through the Google API and setting parameters for searching 
	$('#g_map')[0].src = "https://www.google.com/maps/embed/v1/place?q=" + postcode + "+dealer+" + nc_manufacturer + "&key=" + MAPS_API_KEY;

}