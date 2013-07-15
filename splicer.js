var __splice= Array.prototype.splice
function __spliceN(arr,args){
	return __splice.apply(arr,args)
}
function __hiddenAccessor(name){
	var get= new Function("return "+name),
	  set= new Function("val","this."+name+"= val")
	return {get:get,
	  set:set,
	  enumerable: false}
}

/**
  Splicer implements most of Array where all functions flow through splice. This can be handy if one wants to compose.
*/
function Splicer(){
	this.__initialize(__splice.call(arguments,0))
	delete this.__initialize
}

// BASE IMPLEMENTATION - to change the behavior of Splicer, only these
// three need attention

Splicer.prototype.__initialize= function(arr){
	this.array= arr
}

Object.defineProperty(Splicer.prototype, "asArray", __hiddenAccessor("array"))	

Object.defineProperty(Splicer.prototype, "length", function(){
	return this.array.length
})

Object.defineProperty(Splicer.prototype, "__spliceN", {
	value:function(args){
		return __spliceN(this.array,args)},
	enumerable: false
})

Splicer.prototype.splice= function(i,removeCount,inserts__,inserts___){
	if(arguments.length>4)
		return __spliceN(this.array,arguments)
	else
		return __splice.call(this.array,i,removeCount,inserts__,inserts___)
}



// DERIVED IMPLEMENTATIONS - these methods rely on the BASE and ought
// require no attention

Splicer.prototype.pop= function(){
	var res= this.splice(this.length-1,1)
	if(res) return res[0]
}
Splicer.prototype.push= function(){
	var len= this.length,
	  args= __splice.call(arguments,0,len,0), // prepend len,0 on args
	  addLen= args.length
	this.__spliceN(args)
	return len+addLen-2
}
Splicer.prototype.reverse= function(){
	var len= this.length
	this.splice(len,0,len,0) // splice onto end len,0
	  all= this.splice(0,len+2).reverse() // take all
	this.__spliceN(all)
	return this.asArray
}
Splicer.prototype.shift= function(){
	var res= this.splice(0,1)
	if(res) return res[0]
}
Splicer.prototype.sort= function(){
	var len= this.length,
	  all= this.splice(0,len)
	all.sort.apply(all,arguments)
	__splice.call(all,0,0,0,0)
	this.spliceN(all)
	return this.asArray
}
Splicer.prototype.unshift= function(){
	var args= __splice.call(arguments,0,0,0,0)
	this.spliceN(args)
	return this.length
}

var __VIEWS = ["concat","join","slice","toString","indexOf","lastIndexOf"]
function __makeViewFunction(n){
	return new Function("return Array.prototype."+n+".apply(this.asArray,arguments)")
}
for(var v in __VIEWS){
	Splicer.prototype[v]= __makeViewFunction(__VIEWS[v])
}
