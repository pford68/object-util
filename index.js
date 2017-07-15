/**
 * A small set of utilities for use with JavaScript objects.
 */
'use strict';

function _extend(obj1, obj2) {
    for (let i in obj2) {
        if (obj2.hasOwnProperty(i)) {
            obj1[i] = obj2[i];
        }
    }
    return obj1;
}

if (typeof Array.from !== 'function'){
    Array.from = function($arguments, transformer){
        let $_ = Array.prototype.slice.call($arguments);
        if (typeof transformer === 'function'){
            return $_.map(transformer);
        }
        return $_;
    }
}


let $public = {

    /**
     * Exactly like jQuery's/underscore's version...functionally.  Copies properties from the second object to the first.
     * <p>Note that this is a memory-efficient way to create new objects because, when we copy the properties, we are copying
     * references to the same values or functions.  Thus, only one copy of each function or object will exist.
     * This does mean, however, that extend() makes a shallow copy, and if you are expecting a clone, and
     * expecting to make changes in one object that do not effect the others, you will be disappointed, unless
     * you add an empty object as the first parameter.</p>
     */
    extend: function(that, ...varargs) {
        let args = [...varargs];
        // Mix each argument, starting from the left (not the right) into the first argument
        // Do not mix args[n] into args[n-1]..., because that alters each argument.
        // Similarly, do not start from the right, because then the overriding of properties takes
        // place form left-to-right instead of the intended right-to-left.
        for (let i = 0, len = args.length; i < len; i++) {
            _extend(that, args[i]);
        }
        return that;   // For chaining
    },



    /**
     * Copies properties from the second object to the first object (that) <strong>iff</strong> the property
     * does not exist in the first or is null.
     */
    augment: function(that, props) {
        for (let i in props) {
            if (props.hasOwnProperty(i)) {
                if (that[i] == null) {  // Yes, we want the type coercion.
                    that[i] = props[i];
                }
            }
        }
        return that;
    },


    /**
     * Copies properties from the second object to the first iff the property <strong>exists</strong>
     * in the first.
     */
    override: function(that, props) {
        for (let i in props) {
            if (props.hasOwnProperty(i)) {
                if (i in that) {
                    that[i] = props[i];
                }
            }
        }
        return that;
    },

    /**
     * <p>Returns true/false for whether the specified value is an Object, and works for Objects created in other
     * frames as well.  If the "pure" flag is "true" then isObject() should return true only if the value belongs
     * exclusively to the Object type, not to any sub-type.</p>
     *
     * @param {*} value
     * @param {boolean} [pure] Whether to restrict the objects to the Object type.
     */
    isObject: function(value, pure) {
        // The last condition is needed to test objects from other frames/windows accurately.
        if (value === null || value === undefined) return false;
        if (pure) return ( value.constructor && value.constructor.name === 'Object');
        return (typeof value === 'object' || value.constructor === Object);
    }

};


let spec = {
    extend: function(...varargs){
        return $public.extend(this, ...varargs);
    },
    augment: function(args){
        return $public.augment(this, args);
    },
    override: function(args){
        return $public.override(this, args);
    }
};

/**
 * Mixes the utility methods into the specified object.
 * @param that
 */
$public.mixin = function(that){
    return $public.extend(that, spec);
};


module.exports = $public;
