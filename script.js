
function identity(x) {
    return x;
}

function add(a, b) {
    return a + b;
}

function sub(a, b) {
    return a - b;
}

function mul(a, b) {
    return a * b;
}

function doubl(a) {
    return a + a;
}

function square(a) {
    return a * a;
}

function identityf(a) {
    return function() {
        return a;
    };
}

// addf(3)(4)
function addf(a) {
    return function(b) {
        return a + b;
    };
}

// takes binary function, and makes it callable with two incovations
// liftf(mul)(5)(6) = 30
function liftf(func) {
    return function(b) {
        return function(c) {
            return func(b, c);
        };
    };
}

// takes a function and an argument and returns a function that can take a second argument
// curry(mul, 5)(6) = 30
function curry(func, x) {
    return function(y) {
        return func(x, y);
    };
}

// three ways to create an increment function
var inc = addf(1);
inc = liftf(add)(1);
inc = curry(add, 1);

// takes a binary funciton and returns a unary function that passes
// its argument to the binary function twice
function twice(binary) {
    return function(x) {
        return binary(x, x);
    };
}

// reverses the arguments of a binary function
function reverse(binary) {
    return function(a, b) {
        return binary(b, a);
    };
}

// takes two unary functions and returns a unary function that calls them both
function composeu(f, g) {
    return function(x) {
        return g(f(x));
    };
}

// takes two binary functions and returns a function that calls them both
function composeb(f, g) {
    return function(a, b, c) {
        return g(f(a, b), c);
    };
}

// returns a binary function that can be called only once
function once(binary) {
    var flag = true;
    return function(a, b) {
        if (flag) {
            flag = false;
            return binary(a, b);
        }
        return undefined;
    };
}

// produces a generator that will produce values in a range
function fromTo(a, b) {
    var i = a;
    return function() {
        if (i == b) {
            return undefined;
        }
        i += 1;
        return i - 1;
    };
}

// takes an array and an optional generator and produces a generator
// that will produce the array
function element(arr, generator) {
    if (generator === undefined) {
        generator = fromTo(0, arr.length);
    }

    return function() {
        var i = generator()
        if (i !== undefined) {
            return arr[i];
        }
        return undefined;
    };
}

// collects values from generator into array
function collect(gen, arr) {
    return function() {
        var value = gen();
        if (value !== undefined) {
            array[array.length] = value;
        }
        return value;
    };
}

// only returns results from the generator that fulfill the predicate
function filter(gen, predicate) {
    return function recur() {
        var value = gen();
        var pred = predicate(value);
        if (value === undefined || predicate(value)) {
            return value;
        }
        return recur();
    };
}

// concatenates two generators
function concat(gen1, gen2) {
    return function() {
        var a = gen1();
        if (a !== undefined) {
            return a;
        }
        return gen2();
    };
}

// returns an object containing two functions that implement an up/down counter
// hiding the counter

function counter(num){
    return {
        next: function() {
            num += 1;
            return num;
        },
        prev: function() {
            num -= 1;
            return num;
        }
    };
}

// returns an object that contains a revocable unary function
function revocable(unary) {
    return {
       invoke: function(arg) {
           if (unary !== undefined) {
               return unary(arg);
           }
       },
       revoke: function() {
           unary = undefined;
       }
    };
}

// makes a function that generates unique symbols
function gensymf(x) {
    var i = 0;
    return function() {
        i += 1;
        return '' + x + i;
    };
}

// takes a unary function and a seed and returns a gensymf
function gensymff(unary, seed) {
    return function(x) {
        var i = seed;
        return function() {
            i = unary(i);
            return '' + x + i;
        };
    };
}

function fibonaccif(a, b) {
    return function() {
        var next = a;
        a = b;
        b += next
        return next;
    };
}

// takes a value and optional source and returns an m object
function m(value, source) {
    return {
        value: value,
        source: typeof source == 'string'
            ? source
            : String(value)
    };
}

// takes two m objects and returns an m object
function addm(m1, m2) {
    return m(
        m1.value + m2.value,
        "(" + m1.source + "+" + m2.source + ")"
    );
}

// takes a binary function and a string and returns a function that acts on m objects
function liftm(binary, str) {
    return function(m1, m2) {
        if (typeof m1 === 'number') {
            m1 = m(m1)
        }
        if (typeof m2 === 'number') {
            m2 = m(m2)
        }
        return m(
            binary(m1.value, m2.value),
            "(" + m1.source + str + m2.source + ")"
        );
    };
}

// evalue nested array expressions
function exp(value) {
    return Array.isArray(value)
        ? value[0](
            exp(value[1]),
            exp(value[2])
        )
        : value;
}


// 
// Day 2
//
//

// Write a function addg that adds from many invocations,
// until it sees an empty invocation

function addg(first) {
    function more(next) {
        if (next === undefined) {
            return first;
        }
        first += next;
        return more;
    }

    if (first !== undefined) {
        return more;
    }
}

// takes a binary function and applys it to many invocations
function liftg(f) {
    return function(first) {
        function more(next) {
            if (next === undefined) {
                return first;
            }
            first = f(first, next);
            return more;
        }

        if (first !== undefined) {
            return more;
        }
    }
}

// write a funciton that will build an array from many invocations
function arrayg(first) {
    var arr = [];
    function more(next) {
        if (next === undefined) {
            return arr;
        }
        arr[arr.length] = next;
        return more;
    }

    return more(first);
}

// takes a unary function, and returns a funciton that takes a callback and an argument
function continuize(unary) {
    return function(callback, x) {
        return callback(unary(x));
    };
}

// how would you write an attack to get access to the array
function vector() {
    var array = [];

    return {
        get: function get(i) {
            return array[i];
        },
        store: function store(i, v) {
            array[i] = v;
        },
        append: function append(v) {
            array.push(v);
        }
    };
}

// attack, get array from vector

// var stash;
// myvector.store('push', function() {
//      stash = this;
// });
// myvector.append(); // stash is array


// fixed
function vector2() {
    var array = [];

    return {
        get: function get(i) {
            return array[+i];
        },
        store: function store(i, v) {
            array[+i] = v;
        },
        append: function append(v) {
            array[array.length] = v;
        }
    };
}

// Make a function that makes a publish/subscribe object.
// It will reliably deliver all publications to all subscribers in the right order

// why is this implementaiton faulty
function pubsub() {
    var subscriers = [];
    return {
        subscribe: function(subscriber) {
            subscribers.push(subscriber);
        },
        publish: function(publication) {
            var i, length = subscribers.length;
            for (i = 0; i < length; i += 1) {
                subscribers[i](publication);
            }
        }
    };
}

// fixed;
// setTimeout
// freeze object
// remove for loop
function pubsub() {
    var subscriers = [];
    return Object.freeze({
        subscribe: function(subscriber) {
            subscribers.push(subscriber);
        },
        publish: function(publication) {
            var i, length = subscribers.length;
            subscribers.forEach(function(s) {
                setTimeout(function() {
                    s(publication);
                }, 0);
            });
        }
    });
}


