import ./Title.sol ;

contract test_Title is Title{
	function test_register_ssn(){
		register_ssn(100); 	// register ssn 100 with the current account address
		register_ssn(150);	// register ssn 150 with the current account address
	}
	
	function test_register_pid() {
		register_pid(123,100);	// register Prescription number 123 with SSN 100
	}
	
	function test_transfer_pid() {
		transfer_pid(123,100,150);	// transfer Prescription Number 123 from SSN 100 to SSN 150
	}
	
	function test_get_properties_length(){
		get_properties_length();
	}
	
	function test_get_owner() {
		get_owner();
	}
	
	function test_get_pid() {
		get_pid(0);	// get PID and owner SSN of Prescription Number registered at index 0 of array of Prescription Numbers
	}
	
	function test_get_ssn() {
		get_ssn(123); // get owner of Prescription Number 123
	}
	
}