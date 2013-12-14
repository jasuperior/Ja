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

**Every object must be initialized using ** ```javascript new Ja( value )```

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


```Ja.on( 'event' , callback( self ){} )``` is for firing a function once the event/method has fired. You only have access to the methods which are direct children to the object that .on() is being applied to. The callback takes the parent object itself as an argument. Every value, by default, has a 'change' event which signals once the value has changed (naturally). 

```
	react_cat.age().on("change", function(self){

	})