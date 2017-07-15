/*
Unit tests for object utils
 */
'use strict';

describe("object-utils",() => {
    const utils = require("../../index"),
          extend = utils.extend,
          augment = utils.augment,
          override = utils.override,
          clone = utils.clone,
          isObject = utils.isObject;

    let $ = {};

    afterEach(() => {
        delete $.id;
        delete $.name;
    });

    describe("extend()",() => {
        afterEach(() => {
            delete $.author;
        });

        it("should mix the second argument into the first argument", () => {
            let obj = { id: 3 };
            let obj2 = {author: "Philip Ford"};
            extend(obj, obj2);
            expect(obj.author).toBe("Philip Ford");
            expect(obj2.id).toBeUndefined();
        });

        it("should mix all other arguments into the first argument", () => {
            let obj = { id: 3 };
            let obj2 = {author: "Philip Ford"};
            let obj3 = {copyright: "July 2012"};
            extend(obj, obj2, obj3);
            expect(obj.author).toBe("Philip Ford");
            expect(obj.copyright).toBe("July 2012");
            expect(obj2.copyright).toBeUndefined();
        });

        it("if the arguments length is greater than 1, should return arguments[0]", () => {
            let that = {};
            expect(extend(that, {id: 3, name: "John"})).toBe(that);
        });
    });



    describe("augment()", () => {
        let that,
            mixin = {
                id: 'mixin',
                bgColor: 'red',
                rank: '99%',
                active: true,
                getAge: function(){
                    return 23;
                },
                execute: function(){
                    return "Hello!";
                },
                getBgColor: function(){
                    return this.bgColor;
                }
            };

        beforeEach(() => {
            that = {
                id: 'test',
                active: false,
                bgColor: null,
                getAge: function(){
                    return 21;
                }
            };
        });

        it("should add new properties to an object", () => {
            augment(that, mixin);
            expect(that.bgColor).not.toBeNull();
            expect(that.bgColor).toEqual('red');
            expect(that.rank).toEqual('99%');
            expect(that.getBgColor()).toEqual('red');
            expect(that.execute()).toEqual('Hello!');
        });

        it("should not override existing properties, even if they are null or false", () => {
            augment(that, mixin);
            expect(that.id).toEqual('test');
            expect(that.getAge()).toEqual(21);
            expect(that.active).toBeFalsy();
        });

        it("should not remove any existing properties", () => {
            augment(that, mixin);
            expect(that.id).not.toBeNull();
            expect(that.getAge).not.toBeNull();
            expect(that.bgColor).not.toBeNull();
            expect(that.active).not.toBeNull();

            expect(that.id).toBeDefined();
            expect(that.getAge).toBeDefined();
            expect(that.bgColor).toBeDefined();
            expect(that.active).toBeDefined();
        });

        it("if the arguments length is greater than 1, should return arguments[0]", () => {
            let that = {};
            expect(augment(that, {id: 3, name: "John"})).toBe(that);
        });
    });



    describe("override()", () => {
        let that,
            mixin = {
                id: 'mixin',
                bgColor: 'red',
                rank: '99%',
                active: true,
                getAge:() => {
                    return 23;
                },
                execute:() => {
                    return "Hello!";
                },
                getBgColor:() => {
                    return this.bgColor;
                }
            };

        beforeEach(() => {
            that = {
                id: 'test',
                active: false,
                bgColor: null,
                getAge:() => {
                    return 21;
                }
            };
        });

        it("should not add new properties an object", () => {
            override(that, mixin);
            expect(that.rank).not.toBeDefined();
            expect(that.getBgColor).not.toBeDefined();
            expect(that.execute).not.toBeDefined();
        });

        it("should override any corresponding existing properties, even if they are null or false",() => {
            override(that, mixin);
            expect(that.bgColor).toEqual('red');
            expect(that.id).toEqual('mixin');
            expect(that.getAge()).toEqual(23);
            expect(that.active).toBeTruthy();
        });

        it("should not remove any existing properties",() => {
            override(that, mixin);
            expect(that.id).not.toBeNull();
            expect(that.getAge).not.toBeNull();
            expect(that.bgColor).not.toBeNull();
            expect(that.active).not.toBeNull();

            expect(that.id).toBeDefined();
            expect(that.getAge).toBeDefined();
            expect(that.bgColor).toBeDefined();
            expect(that.active).toBeDefined();
        });

        it("if the arguments length is greater than 1, should return the first argument",() => {
            let that = {};
            expect(override(that, {id: 3, name: "John"})).toBe(that);
        });
    });



    describe("isObject()",() => {
        function Test(){

        } /*  This will cause isObject(new Test(), true) to return true, when we'd probably expect it to be false.
         Test.prototype = {
         add:() => { return 2+2; }
         };  */
        //Test.prototype.add =() => { return 2 + 2; };  // This works fine with isObject(new Test(), true).
        extend(Test.prototype, {
            add: function(){ return 2+2; }
        });


        it("should correctly identify an object created in the current window",() => {
            expect(isObject({})).toBeTruthy();

            let a = {};
            expect(isObject(a)).toBeTruthy();
            expect(isObject({ id: 34, test:() => {} }, true)).toBeTruthy();
            expect(isObject([])).toBeTruthy();
            expect(isObject(new Array(100))).toBeTruthy();
        });

        xit("should correctly identify an object created in another window/frame", done => {
            let resume = false;

            setTimeout(function(){
                resume = true;
            }, 1500);

            expect(isObject(window.frames[0].map, true)).toBeTruthy();
            done();
        });

        it("should correctly identify that literals are not objects",() => {
            expect(isObject(true)).toBeFalsy();
            expect(isObject(3)).toBeFalsy();
        });

        it("should correctly identify that nulls are not objects",() => {
            expect(isObject(null)).toBeFalsy();
            expect(isObject(undefined)).toBeFalsy();
            expect(isObject(null, true)).toBeFalsy();
            expect(isObject(undefined, true)).toBeFalsy();
        });

        it("should correctly identify that instances of subclasses are objects, if pure is false",() => {
            expect(isObject(new Date())).toBeTruthy();
            expect(isObject(new String("fjdgkfdg"))).toBeTruthy();    // A String literal will be false
            expect(isObject(new Number(3))).toBeTruthy();
            expect(isObject(new function(){})).toBeTruthy();
            expect(isObject(new Test())).toBeTruthy();
        });

        it("should correctly identify that instances of subclasses are not objects, if pure is true",() => {
            expect(isObject(new Date(), true)).toBeFalsy();
            expect(isObject("fjdgkfdg", true)).toBeFalsy();
            expect(isObject(new String("fjdgkfdg"), true)).toBeFalsy();
            expect(isObject(new Number(3), true)).toBeFalsy();
            expect(isObject(() => {}, true)).toBeFalsy();
            expect(isObject(new Test(), true)).toBeFalsy();
        });

        it("should correctly identify that instances of Object instance when pure is true",() => {
            expect(isObject({}, true)).toBeTruthy();
            expect(isObject({ id: 34, test:function(){} }, true)).toBeTruthy();
            expect(isObject({}, true)).toBeTruthy();
        });
    });

});
