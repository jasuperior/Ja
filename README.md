Ja
==
Meet Ja, The Real Object library for javascript. This is still largely an experimental build, any many changes could arise which could break your code in the future. Ja allows you to create javascript objects which can act and react just like real world objects -- to other objects and events happening in the world (program).

*What exactly does that mean?*

heres an example

```javascript
//first declare a new object that you would like to make React
var cat = {
	name: "fluffy",
	age: 2,
	color: "black",
	speak: function( self ){
		return "MEOW!"
	}
};

//next add the object as a parameter in the Ja Object
var react_cat = new Ja(cat);

//You can still use the Ja object like you would a normal object
console.log(react_cat.name(true)); // notice that the properties were converted to functions. passing true returns the value. 

//you can also effect changes based on events, defined by the objects methods
react_cat.on('speak', function( self ){
	self.age(3,true);
	console.log('YAY! I finally turned '+ self.age(true));
});

console.log(react_cat.speak());
```

*Cool Right!?*

##So Why Does This Matter?

Because Javascripts events are extremely limited in what they can do, and fail to give you the adequate signals for things which wouldnt necessarily be considered event. What if you wanted to make a DOM object move once a set of values have all be fullfilled? With vanilla javascript, you'd have to do some sort of checking every time a traditional event (such as click) was fired, and utilize some crazy switch statement to validate, or worse if statements everywhere!!!! GASP! and God I hope you dont have an Async value which should also be calculated to signal your DOM object. 

Though the miracle of tooling has given us Promises & Deffereds, a Few Reactive plugins (such as ELM or BACON.js ), and even Jquery's own .trigger(); all of these over complicate the process of true reactionary programming. 

##SO WHAT CAN YOU DO?

Well, I'm glad you asked. Below I'll take you through some of the API. 


###Declarative Methods
**Every object must be initialized using** ```javascript new Ja( value )```

```javascript
	var cat = new Ja('snuggles'); //when any value other than an object is given, the value is applied to the Ja object itself via the .value property
	console.log(cat.value); //outputs 'snuggles'

	var dog = new Ja({ name: "Bark", type: "short-hair"}); //passing an object applies property values to their rightful keys. 

	var human = {
		name: "Ja Superior",
		age: 99,
		bestfriend: {		//You can decend down the tree to give .bestfriend some properties and methods
			value: "Na",  // if you want .bestfriend to output a value, you must apply a value property, else it will be undefined. 
			changeFriend: function( self, value ){
				self.change(value);
				console.log(self.value); //you can access the value property of the parent directly when inside of a function.
			}
		}
	};

	var newJa = new Ja(human);
	console.log(newJa.bestfriend(true)); //outputs "Na"
	newJa.bestfriend().changeFriend('Tony')  //changes the value of .bestfriend to "Tony"
	console.log(newJa.bestfriend(true)); //outputs "Tony"
```
**REMEMBER** that every property is a function. Leaving the function empty returns the pure Ja object of that function. This is used to chain commands and work down the object tree. 

```javascript
	newJa.bestfriend //returns function(){...}
	newJa.bestfriend() //returns Ja methods as well as properties and methods for .bestfriend
	newJa.bestfriend(true) //returns .bestfriend.value or "Tony"

	newJa.bestfriend().value == newJa.bestfriend(true) //true

	newJa.bestfriend("Olivia",true) //changes value to "Olivia"
```

```Ja.set( 'name' , value )``` New values can be added to the object using the .set() method. 
```javascript
	newJa.bestfriend().set('age', 2000);
	newJa.bestfriend().age(true); //outputs 2000
```

```Ja.setMany( object )``` You can also set multiple values at once by using the .setMany() method. 
```javascript
	newJa.setMany({ a: 1, b: 2});
	newJa.a(true); //outputs 1
	newJa.b(true); //outputs 2
```

```Ja.get( key )``` The .get() command simply returns the value of the key given. 
```javascript
	newJa.get('name'); //outputs "Ja Superior"
```

```Ja.define( 'name', function( self, arugments ) )``` The .define() command sets a new Method to the object. 

```javascript
	newJa.set('speed', 1);
	newJa.define('run', function(self, arg ){
		self.speed( arg, true);
	});
	newJa.run(10); //changes the .run property to 10
```
### Event Methods


```Ja.on( 'event' , callback( self ){ ... } )``` is for firing a function once the event/method has fired. The callback takes the parent object itself as an argument. Every value, by default, has a 'change' event which signals once the value has changed (naturally). 

```javascript
	newJa.age().on("change", function(self){
			console.log("I am finally"+self.value);
	});
	newJa.age(20,true); //outputs "I am finally 20!"
```
```Ja.off( 'event' , function )``` is for removing a function from the specified event. Simply name the event you which to affect and input your function reference and your done!

```javascript
	var saysomething = function () { console.log('something'); }
	newJa.age().on('change', saysomething );
	newJa.age().on('change', function(){ console.log('still here!') });

	newJa.age(10,true); //outputs "something" & "still here!"

	newJa.age().off('change', saysomething);

	newJa.age(25,true); //outputs "still here!"
```

```Ja.when( name, pattern ).then( function( self ){ ... } )``` .when(), like the .on() command, awaits a change to perform it's callback which is now defined in the .then() method. However, rather than waiting for a method call, it instead waits for particular values of given keys. You can define a pattern ( object with keys and values ) as a parameter, to track changes in the Ja object for matching keys. **It is important that you use keys which exist in the Ja object, else .when WILL break.** You can also use a function in place of an object. Whether you use an object or function, in either case they must evaluate to true before .when() fires the function declared in it's .then() clause. 

```javascript
//remember that you must name every .when() with a unique name, else it will get overwritten with the newest value. 
	newJa.when('young-run', { age: 21, speed: 12 } ).then(function( self ){
		console.log(" I am running while I'm young! ");
	});

	newJa.age(21,true); //doesnt output anything because speed does not = 12
	newJa.speed(12,true); //outputs " I am running while I'm young! "

// for patterns which require further computation than a simple match (such as inequalities or multiple function calls), use a function

	newJa.when('oldman', function(self){ if(self.age(true) > 100) return true; return false; }).then(function( self ){
		console.log('GOSH IM GETTING OLD!');
	});
	newJa.age(99,true); //does not output because age is still below 100
	newJa.age(101,true); //outputs 'GOSH IM GETTING OLD!'
``` 

###Helper Methods

####Time Methods
**To help with timeouts and intervals, theres a new function that makes it all pretty for you, and works beautifully with your Ja objects.**

```Ja.every( time )[ milli || sec || min || hour ]( 'do' )``` The .every() method doesnt do anything new; it simply creates for you an interval at your set timeframe. The difference is that it is much prettier. :-)

```javascript
	newJa.every(10).sec('run') // every 10 seconds the object will call the .run() method. 
	newJa.every(20).milli('anotheraction'); //err: methods must be defined before you can use them with the .every() method. 
```
```Ja.stopEvery( 'method' )``` stops interval on method specified. 
```javascript
	newJa.stopEvery('run'); //run will stop being called repetitively
```

```Ja.in( time )[ milli || sec || min || hour ]( 'do' )``` creates a timeout for the specified method. 

```javascript
	Ja.in(20).sec('run'); //will call .run() once 20 seconds have passed. 
```

####Grouping/Cursor Methods
So you've got your object, all of your values and methods are sound, but now you need to send this data to another api, or simply want to pass the results of a given set of values to the value of another property or variable. Enters: (wait for it...........) Grouping Methods!! (and their arch nemesis Cursor Methods!!!!)

You have 4 grouping/cursor methods, which takes a set of keys (from your Ja object) and returns an array or value based on the method you used. 

```Ja.both( 'key1', 'key2' )```

```Ja.all(['key1','key2','key3',...])```

```Ja.neither( 'key1', 'key2' )```

```Ja.not(['key1','key2','key3',...])```

```Ja.any(['key1','key2','key3',...])```

Their names pretty much say it all. But I'll show you how they work. with a basic example:

```javascript
	var members = {
		mother: "Tanya",
		father: "Damon",
		sister: "Shay",
		bigbrother: "Lay",
		littlebrother: "Day",
		cousin: "Joe",
		friend: "Vinny"
	};
	var family = new Ja(members);

	var parents = family.both('mother', 'father');
	console.log(parents); //outputs ["Tanya", "Damon"]

	var siblings = family.all(['sister', 'bigbrother', 'littlebrother']);
	console.log(siblings); //outputs [ "Shay", "Lay", "Day" ];

	var 

```