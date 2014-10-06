/**
 * @author Joe Sangiorgio
 * JS Backend for Code Tests
 */

//globals
var verbose = false;
var isDev = true;
var url = (isDev)? "http://0.0.0.0:5000/" :"http://awsflask-d7jzwtbv7t.elasticbeanstalk.com/";

var decode = (function () {
    var decode = {}
    decode.inputBtnArr = []
    decode.reachedScenario = false
    decode.token = ""
    decode.loginSuffix = "/login"
    decode.tokenSuffix = "/token"

    function init() {
        getToken()
    }

    init();

    function getToken() {

        var jqxhr = $.get(url+decode.tokenSuffix, function () {})
            .done(function (response) {
                decode.token = response.split(":")[1];
                console.log("token is : " + decode.token);
                login();

            })
            .fail(function () {
                console.log("error fetching token");
            });

    }
    //    IAM:<challenge number>:<user email address>:at\n
    function login() {

        var jqxhr = $.get(url+decode.loginSuffix, function () {})
            .done(function (response) {

            })
            .fail(function () {
                console.log("error logging in");
            });

    }


    //aux functions
    decode.set = function (name, field) {
        this[name] = field
    }

    //validation functions
    decode.validatePBO = function (isFirst) {

    }


    return decode;
}());


//prototype overrides
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

//util functions
var sort_by = function (field, reverse, primer) {
    var key = function (x) {
        return primer ? primer(x[field]) : x[field]
    };
    return function (a, b) {
        var A = key(a), B = key(b);
        //alert(A + " , " + B)
        return ((A < B) ? -1 :
            (A > B) ? +1 : 0) * [-1, 1][+!!reverse];
    }
};
function contains(test, str) {
    if (test.indexOf(str) != -1) {
        return test
    } else {
        return false
    }

}