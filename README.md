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
	color: black,
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
