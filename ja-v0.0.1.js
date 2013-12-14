(function(){
	Ja = function( value, setter ){
		var that = this;
		//applies a "pseudo event handler" to any property of a ja object.
		this.on = function( name, f ){
			this.signals[name].receivers.push(f); 
		}
		//takes off event handler which was added to property. 
		this.off = function ( name, f ){
			if(f){
				var key = this.signals[name].receivers.indexOf(f);
				if(key>-1)
					this.signals[name].receivers.splice(key, 1);
			}else{
				this.signals[name].receivers = [];
			}
		}

		 function parse( obj, parent ) {
		 	console.log('parse fired: ',obj, parent);
		 	var loop = 0;
		 	obj.map(function(k,v){
		 		console.log( 'OBJECT BEING MAPPED: ', v, type('Object', v) );
		 		if( type('Object', v ) ){
		 			parent.set(k,v.value);
		 			parse( v, parent[k]() );
		 		}else if (type('Function', v) ){
		 			// console.log('detected an function');
		 			parent.define(k,v);
		 		}
		 		else if (k != 'value'){
		 			parent.set(k,v);
		 		}
		 	});
		 	// console.log('finished parse', obj);
		 }

		 var type = function(type, obj) {
		    var clas = Object.prototype.toString.call(obj).slice(8, -1);
		    return obj !== undefined && obj !== null && clas === type;
		}
		//replaces setInterval().
		//uses the following syntax:
		//a = new Ja(). a.every(6).sec('run')
		//"every" take an interger as the value of time you'd like to set as an interval
		//.sec/.milli/.min receives a string argument representing the method you would like to perform every time increment.
		//TODO: allow annonymous functions as an argument in second method. 
		this.every = function ( time ) {
			var obj = {
				time: false,
				milli: function ( method ) {
					this.time = time;
					this.do( method );
				},
				sec: function ( method ) {
					this.time = time * 1000;
					this.do( method );
				},
				min: function ( method ) {
					this.time = time * 60000;
					this.do( method );
				},
				do: function ( method ) {
					// console.log()
					if ( that._intervals[method] ){
						console.log('Interval already exists for method: [[ '+method+' ]]. Choose new method.');
						return false;
					}
					that._intervals[method] = setInterval( function(){
						that[method]();
					}, this.time );
				}
			}
			return obj;
		};

		//stops the increment set in the above .every() function. 
		this.stopEvery = function ( method ) {
			clearInterval(that._intervals[method] );
			delete that._intervals[method];
		};
		this.in = function (time) {
			var obj = {
				time: false,
				milli: function ( method ) {
					this.time = time;
					this.do( method );
				},
				sec: function ( method ) {
					this.time = time * 1000;
					this.do( method );
				},
				min: function ( method ) {
					this.time = time * 60000;
					this.do( method );
				},
				do: function ( method ) {
					// console.log()
					if ( that._waits[method] ){
						console.log('Wait already exists for method: [[ '+method+' ]]. Choose new method.');
						return false;
					}
					setTimeout( function(){
						that[method]();
					}, this.time );
				}
			}
			return obj;
		};
		this._intervals = {};

		//binds that value of the given "key" (property) given to .bind() method.
		//binds the value of the property given to the property being defined. 
		//ex: a.property.bind('run') 
		this.bind = function( key ) {
			// var key = key();
			if ( key  instanceof Ja ){
				this.on('change', function( a ){
					key.change(a.value);
				});
				return true;
			}

			console.log('The key entered is not a Ja object')
			return false;
		};

		// this.states = function ( array ) {
		// 	this._states ={
		// 		states: array,
		// 		interpret: false
		// 	};
		// 	var obj = {
		// 		states: this._states.states,
		// 		interpret: this._states.interpret,
		// 		state: this.state,
		// 		automate: function ( f ){
		// 			this.interpret = f;
		// 		}
		// 	}
		// };


		//for defining methods on a ja object. 
		this.define = function ( name , f ) {
		var that = this;	

			this.signals[name] = {
				action: function (a) {
                            console.log(a);
							var result = f(that, a);
							var functions = this.receivers;
							for ( i = 0; i < functions.length; i++  ) {
									functions[i](that);
							}
							return result;
						},
				receivers: []
			};

			this[name] =  function(argument) {
				return this.signals[name].action(argument);
			}
			
		};

		//for setting properties of a ja object
		this.set = function( name, value ){
			this._arguments[name] = new Ja(value, true);
			this._arguments[name].parent = that;
			this._arguments[name].key = name;
			this[name] = function ( value, change ) {
				if ( change ){
					// this._arguments[name].value = value;
					this[name]().change(value);
					// console.log( 'after change ' );
					this.load();
					// console.log( 'after load() ');
					return value;
				}
				if (value)
					return this._arguments[name].value
				return this._arguments[name]
			}
			this[name].prototype.type = 'property';
		}

		//set many properties at once. receives an object as an argument. 
		this.setMany = function( obj ){
			for ( i in obj ) {
				if (  obj.hasOwnProperty(i) ){
					this.set( i, obj[i] )
				}
					
			}
		}

		
		this.setCopy = function ( name, obj ) {
			var noob = {};
			obj.map(function(k,v){
				var l2 = {};
				console.log(k+': '+v);
				if(typeof v == 'function' && v() != undefined && v() instanceof Ja){
					v().map(function(k2,v2){
						l2[k2] = v2;
					});
				}
				console.log(l2);
				if( l2.size() > 0 )
				noob[k].set(l2,true);
				else
				noob[k] = v;
			});
			this._arguments[name] = noob;
			this._arguments[name].parent = that;
			this._arguments[name].key = name;
			this[name] = function ( value, change ) {
				if ( change ){
					// this._arguments[name].value = value;
					this[name]().change(value);
					// console.log( 'after change ' );
					this.load();
					// console.log( 'after load() ');
					return value;
				}
				if (value)
					return this._arguments[name].value
				return this._arguments[name]
			}
		}
		this.when = function( name, pattern ) {
			var copy = {};
			// console.log(pattern)
			if ( typeof pattern == 'object' ){
				// var i;
				for ( var j in pattern ){
					if ( !this._arguments[j] )
						return false;
					if ( pattern.hasOwnProperty(j) ){
						this[j]().on('change', function(a){
							// console.log(a, a.key);
							// console.log('when fired')
							a.parent._chamber[name].pattern.copy[a.key] = a.value;
								// a._shots.push(name);
						});
						copy[j] = this._arguments[j].value
					}
				}
			}else if ( typeof pattern == 'function' ) {
				copy = true;
			}
			// console.log(copy);
			this._chamber[name] = {
				pattern:{
					value: pattern,
					copy: copy
				},
				shot: undefined
			};
			var that = this;
			obj = {
				parent: that,
				then: function( f ){
					
					this.parent._chamber[name].shot = f;
					// console.log( this.parent._chamber[name] )
				}
			}
			return obj;
		};

		this.change = function (value) {
			this.value = value;
			return this.signals['change'].action();
		}
		this.load = function() {
			var i;
			// console.log('loading')
			for ( i in this._chamber ) {
				// console.log(this._chamber, i, this._chamber.hasOwnProperty(i) )
				if ( this._chamber.hasOwnProperty(i) ){
					var pat = this._chamber[i].pattern.value;
					var match = this._chamber[i].pattern.copy;
					// console.log(pat, match);
					// var mat = {};
					// for ( key in pat ) {
					// 	if (pat.hasOwnProperty(key))
					// 	mat[key] = this[key](true);
					// }
//					 console.log("Load event: ", pat, match );
					if ( typeof pat == 'object'){
						// console.log( match,pat, match.match(pat) )	
							pat = pat.map(function(k,v){
								if( typeof v == 'function' )
									return pat[k](true);
								else
									return v;
							});
							if(match.match(pat))
								this._chamber[i].shot(this)
	
					}
					if ( typeof pat == 'function'){
						if ( pat(this) == match )
							this._chamber[i].shot(this);
					}
				}
				
			}
		}
		this.get = function () {
			return this.value;
		}

		this.algebra = function ( value ) {
			var a = ALG;
			if ( !alg.sign ) {
				alg.x = value;
			}else {
				alg.y = value;
				var result = eval(alg.x+alg.sign+alg.y);
				alg.x = result;
				alg.y = false;
				alg.sign = false;
			}
			return function ( sign ) {
					if(sign) {
						alg.sign = sign;
						return a;
					}
					return alg.x;
			}
		}

		//**------- key selectors --------**

		this.both = function( key1, key2 ){	
			var x1,x2;
			
			x1 =(this[key1])?this[key1](true):false;
			x2 = (this[key2])?this[key2](true):false;
			var	x = [ x1 , x2 ];
			return x;
		}
		this.all = function( array ) {
			//LATER: include function for if array param not present get ALL arguments in Ja object
			if ( typeof array != 'object' && !array.length )
				return false;
			var arr = [];
			for( i = 0; i < array.length; i++ ){
				if(this[array[i]])
				arr[i] = this[array[i]](true);
				else
				arr[i] = false;
			}
			return arr;	
		}
		this.any = function ( array ) {
			var len = array.length;
			var num = Math.floor((Math.random()*len));
			console.log("num: "+num)
			return this[array[num]](true);
		}
		this.neither = function( key1, key2 ){
			var len = this.size();
			len = len - 24;
			var num = Math.floor((Math.random()*len)+1);
			num = num+23;
			var fired = false;
			var count = 0;
			var key = 0;
			var result = false;
			var that = this;
			this.map(function(k,v){	
					if( key == num ){
						if( k!= key1 && k!=key2 && typeof that[k] == 'function' )
							result = that[k](true);
						else
							num++
					}
					key++;
			});
			if ( result === false )
				return this.neither( key1, key2)
			return result;

		}

		this.not = function (key) {
			return this.neither(key, key);
		}

		this._algebra = {
			x: false,
			y: false,
			sign: false
		}
		var alg = this._algebra;
		var ALG = this.algebra;

		this.signals = {
			
			change: {
				action: function () {
							// console.log('change this', this)
							var functions = this.receivers;
							// console.log(functions)
							var i = 0;
							for ( i = 0; i < functions.length; i++  ) {
									functions[i](that);
							}
						},
				receivers: []
			}
		};
		this._arguments = {};
		this._chamber = {};		//this is where it holds all of the patterns to match
		this._shots = {};
		if ( type('Object', value ) && !setter ){
			parse(value, that);
		}else
		this.value = value;
		console.log('this is the JA OBJECT VALUE:::::::::::::::', value, this.value)
	}

















	Object.defineProperty(Object.prototype, 'map', {
	value: function ( callback ) {
		var obj = {}
		var i;
		for ( i in this ) {
			if ( this.hasOwnProperty(i) ){
				obj[i] = callback( i, this[i] )
			}
		}
		return obj;
	},
	enumerable: false, 
	configurable: false, 
	writable: false 
	});
	Object.defineProperty(Object.prototype, 'size', {
	value: function () {
		count = 0;
		var i;
		for (i in this ) {
				if ( this.hasOwnProperty(i) )
					count++
		}
		return count;
	},
	enumerable: false, 
	configurable: false, 
	writable: false 
	});
	Object.defineProperty(Object.prototype, 'match', {
	value: function ( obj ) {
//        console.log('startmap!!!!        ', this , obj);
		var result = true;
		if (this.size() != obj.size() )
			return false;
		this.map(function(k,v) {
			if ( v != obj[k] && !( obj[k] === true && v != undefined ))
				result = false;
		}) ;
		return result;
	},
	enumerable: false, 
	configurable: false, 
	writable: false 
	});

	//** ------------ Na Object represented as "_" -------------**//
	//use this for when i want to represent na as a Ja object, or as its own object with its own set of properties. 
	// _ = function (a) {
	// 	return new Ja(a)
	// }
	// _.prototype.hold = function (a) {

	// }
	_ = {
		hold: function(a) {
			if(a)
			this.rawholds.push(a);
			if(!a){
				var arr = {} ;
				for (i=0; i<this.rawholds.length; i++) {
					arr[this.vars[i]] = this.rawholds[i];
				}
				var til = {
					til: function ( evalualte ){

					}
				}
				// this.til.prototype = arr;
			}
			return this;
		},
		rawholds: [],
		holds: {},
		vars: ['a','b','c','d'],

		join: function(array, whitespace) {
			if( typeof array != 'object' && !array[0] )
				return false;
			var len = array.length;
			var result = '';
			for(i=0; i < len; i++){
				result+= array[i]+((whitespace===true&&i<len-1)?' ':(whitespace&&i<len-1)?whitespace:'');
			}
			return result;
		},
		seperate: function(string, seperator ){
			if ( typeof string != 'string' )
				return false;
			var arr = string.split((seperator===true)?' ':(seperator)?seperator:'');
			return arr;
		},
		any : function ( array ) {
			var len = array.length;
			var num = Math.floor((Math.random()*len));
			console.log("num: "+num)
			return array[num];
		}


		
	}
})();