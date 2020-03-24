

// Link to DVLA API (AWS Gateway API now used)
const API_URL = "https://57jhp2w0vi.execute-api.us-east-2.amazonaws.com/Live";
const API_KEY = "1fwd9hRKHQ3SZjF2HmBCD5AxP5p2CHCH8QXQfFxV";

$('#errormessage').hide();

// findMyCar function, identifying various attributes to display
function findMyCar(){

	// Setting the car data to send to the DVLA API
	let carReg = $('#reg_number')[0].value;
	let carJSON = `{
		"registrationNumber":"` + carReg + `"
	}`

	// Posting the carJSON to DVLA API
	$.ajax({
		url: API_URL,
		headers: {
			'x-api-key': API_KEY,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		dataType: 'json',
		data: carJSON,
	
		// It worked..
		success: function(data){

			// Convert the response from JSON to a string so it can be stored in local storage
			let responseJson = JSON.stringify(data);

			// Put it into local storage
			localStorage.setItem('data', responseJson);

			// Storing the response in 'data' variable
			let outputJSON = data;

			// Car registration not found
			if (outputJSON.errors != undefined){

				// Show the error message
				$('#errormessage').show();

				// Hide the "continue" button
				$('#findMyCarBTN').prop('hidden',true)
				
			} else {

				// Hide the error message
				$('#errormessage').hide();

				// Show the "continue" button
				$('#findMyCarBTN').prop('hidden',false)

				// Attributes being displayed in quiz form
				$('#registration_number').text(outputJSON.registrationNumber);
				$('#co2_figure').text(outputJSON.co2Emissions);
				$('#fuel').text(outputJSON.fuelType);
				$('#colour').text(outputJSON.colour);
				$('#make').text(outputJSON.make);
				$('#year').text(outputJSON.yearOfManufacture);
				$('#enginesize').text(outputJSON.engineCapacity);
				$('#axle').text(outputJSON.wheelplan);
			}

			// 
		},
		error: function(data){
			alert("Something went wrong with the DVLA API...")
			console.error(data)
		}
	});

	
	
	
}