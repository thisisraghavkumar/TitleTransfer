App = {
  web3Provider: null,
  contracts: {},
  owner: null,
  caller: null,
  
  init: function() {
	$('#content').hide();
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined'){
		App.web3Provider = web3.currentProvider;
		web3 = new Web3(web3.currentProvider);
	}else{
		App.web3Provider = new Web3.providers.HttpProvider('localhost:8545');
		web3 = new Web3(App.web3Provider);
	}
	web3.eth.getAccounts(function(err,res){
			App.caller = res[0];
			console.log("Caller "+App.caller);
	});
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Title.json",function(title){
		App.contracts.Title = TruffleContract(title);
		App.contracts.Title.setProvider(App.web3Provider);
		$('#content').show();
		App.listenContractEvents();
		App.contracts.Title.deployed().then(function(instance){
			return instance.get_owner.call();
		}).then(function(result){
			App.owner = result;
			console.log("Owner "+App.owner);
			App.showAdmin();
		}).catch(function(error){
			console.warn(error);
		});
	});
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#register-indi-btn', App.registerIndividual);
	$(document).on('click', '#register-prop-btn', App.registerProperty);
	$(document).on('click', '#transfer-btn', App.transfer);
  },

  listenContractEvents : function(){
	  App.contracts.Title.deployed().then(function(instance){
		  instance.identity_mismatch().watch(function(error,result){
		  if (!error){
			  alert(result.args.ssn + " is not registered with current account " + result.args.adr);
		  }else{
			  console.log("Error in calling identity mismatch event");
		  }
		});
	  });
	  
	  App.contracts.Title.deployed().then(function(instance){
		 instance.property_mismatch().watch(function(error,result){
		  if (!error){
			  alert(result.args.pid + " is not registered with SSN " + result.args.ssn);
		  }else{
			  console.log("Error in calling identity mismatch event");
		  }
		});
	  });
  },
  
  registerIndividual: function(event) {
    event.preventDefault();
    var ssn = parseInt($('#ssn1').val());
	
	// Action
	App.contracts.Title.deployed().then(function(instance){
		return instance.register_ssn(ssn);
	}).catch(function(error){
		console.warn(error);
	});
	
	$('#ssn1').val('');
  },
  
  registerProperty: function(event) {
	  event.preventDefault();
	  
	  var ssn = parseInt($('#ssn2').val());
	  var pid = parseInt($('#pid1').val());
	  
	  //Action
	  App.contracts.Title.deployed().then(function(instance){
		  return instance.resgister_pid(pid,ssn);
	  }).catch(function(err){
		  console.warn(err);
	  });
	  
	  $('#ssn2').val('');
	  $('#pid1').val('');
  },
  
  transfer: function(event){
	  event.preventDefault();
	  
	  var seller = parseInt($('#ssn3').val());
	  var buyer = parseInt($('#ssn4').val());
	  var pid = parseInt($('#pid2').val());
	  
	  //Action
	  App.contracts.Title.deployed().then(function(instance){
		  return instance.transfer_pid(pid,seller,buyer);
	  }).catch(function(err){
		  console.warn(err);
	  });
	  
	  $('#ssn3').val('');
	  $('#ssn4').val('');
	  $('#pid2').val('');
  },
  
  showAdmin: function(){
	  if (App.owner != App.caller){
		  console.log("Viewing rights not available to "+App.caller);
		  $("#admin").hide();
		  return;
	  }
	  var num;
	  App.contracts.Title.deployed().then(function(instance){
		  titleInstance = instance;
		  return instance.get_properties_length.call();
	  }).then(function(p_len){
		  var pid;
		  var ssn;
	      var i;
		  console.log(p_len+" properties detected.");
		  for (i=0;i<p_len;i++){
			  titleInstance.get_pid.call(i).then(function(result){		pid = result[0];
																		console.log("PID " + result[0] + " detected owned by "+result[1]);
																		App.putInTable(result[0],result[1])
																		return result;
			  });
		  }
	  }).catch(function(error){
		  console.log("error: showadmin");
		  console.warn(error);
	  });
	  
  },
  
  putInTable: function(pid,ssn) {
	  $('#admin-table').append("<tr><td>"+pid+"</td><td>"+ssn+"</td></tr>");
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
