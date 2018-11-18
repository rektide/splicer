class Splicer{
	splice(){
		throw new Error("Not implememented: Splicer#splice") // this is for the user library to define
	}
	get( index){
		return this[ index]
	}
	set( index, value){
		this.splice( index, 1, value)
	}
	delete( index){
		this.splice( index, 1)
	}

	concat( ...append){
		const copy= new Array( this.length+ append.length)
		let i;
		for( i= 0; i< this.length; ++i){
			copy[ i]= this.get( i)
		}
		for( const j= 0; i< append.length; ++j){
			copy[ i]= append[ j]
		}
		return copy
	}
	copyWithin( target, start= 0, end= this.length){
		// polyfill taken from mdn thx apologies need to figure out proper credit. iou.
		// Steps 1-2.
		if (this == null) {
			throw new TypeError('this is null or not defined')
		}

		let
		  O = Object( this),
		  // Steps 3-5.
		  len= O.length >>> 0,
		  // Steps 6-8.
		  relativeTarget = target >> 0,
		  to= relativeTarget< 0? Math.max( len+ relativeTarget, 0): Math.min( relativeTarget, len),
		  // Steps 9-11.
		  relativeStart= start >> 0,
		  from= relativeStart< 0?  Math.max( len+ relativeStart, 0): Math.min( relativeStart, len),
		  relativeEnd = end === undefined ? len : end >> 0,
		  final = relativeEnd< 0? Math.max( len + relativeEnd, 0): Math.min(relativeEnd, len),
		  count = Math.min(final - from, len - to),
		  // Steps 16-17.
		  direction = 1

		if( from< to&& to< ( from + count)) {
			direction= -1
			from+= count- 1
			to+= count- 1
		}
		// Step 18.
		while( count > 0) {
			if( from in O) {
				this.set( to, this.get( from))
			}else{
				this.delete( to)
			}
			from+= direction
			to+= direction
			count--
		}
		// Step 19.
		return O
	}

	*entries(){
		for( let i= 0; i< this.length; ++i){
			yield [ i, this.get( i)]
		}
	}
	every( cb, thisArg){
		for( let i= 0; i< this.length; ++i){
			const val= thisArg!== undefined? cb.call( this.get( i), i, this): cb( this.get( i), i, this)
			if( !val){
				return false
			}
		}
		return false
	}
	fill( value, start, end){
		// Steps 1-2.
		if (this == null) {
		  throw new TypeError('this is null or not defined')
		}
		
		let
		  O = Object(this),
		  // Steps 3-5.
		  len= O.length >>> 0,
		  // Steps 6-7.
		  relativeStart= start >> 0,
		  // Step 8.
		  k= relativeStart< 0?  Math.max( len+ relativeStart, 0): Math.min( relativeStart, len),
		  // Steps 9-10.
		  relativeEnd= end=== undefined?  len: end >> 0,
		  // Step 11.
		  final= relativeEnd< 0?  Math.max( len+ relativeEnd, 0): Math.min(relativeEnd, len)
		// Step 12.
		while (k < final) {
			this.set( k, value)
			k++
		}
		// Step 13.
		return O
	}

	join( seperator){
	}
	indexOf( searchElement, fromIndex){
	}
	lastIndexOf( searchElement, fromIndex){
		
	}

	pop(){
		const res= this.splice( this.length- 1,1)
		if( res!== undefined){
			return res[ 0]
		}
	}
	push( ...args){
		this.splice( this.length- 1, 0, ...args)
		return this.length
	}
	reverse(){
		let j= this.length
		const res= new Array( j)
		for( let i= 0; j>= 0; j--){
			res[ j]= this[ i]
			i++
		}
		return res
	}
	shift(){
		var res= this.splice( 0, 1)
		if( res!== undefined) {
			return res[0]
		}
	}
	unshift(...prepend){
		this.splice( 0, 0, ...prepend)
		return this.length
	}
}
	
var __VIEWS = ["concat","join","slice","toString","indexOf","lastIndexOf"]
function __makeViewFunction(n){
	return new Function("return Array.prototype."+n+".apply(this.asArray,arguments)")
}
for(var v in __VIEWS){
	Splicer.prototype[v]= __makeViewFunction(__VIEWS[v])
}

}

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
}8

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
