/**
 * @author Joe Sangiorgio
 * JS Backend for Javascript Selection Engine
 */


/**
 *  Used to grab elements from the page
 * * @param {string} selector - The jquery-style selector string
 */
var $ = function (selector) {
    var elements = [];

    //characters that the selector can contain
    var searchChars = {
        "#": "id",
        ".": "className"
    }
    // will be populated depending on input selector string
    var hasBoth = 0;

    //only valid if one type is used
    var currType;

    var currInd;

    //determine how to handle the input, whether complicated processing is necessary
    for (var i in searchChars) {
        currInd = selector.indexOf(i)
        if (currInd != -1) {
            hasBoth++;
            currType = searchChars[i];
        } else {
        }
    }

    //input is just a html element tag, can simply get using that.
    if (hasBoth == 0) {
        elements = document.getElementsByTagName(selector)
        console.log("only tag, elements are ")
        console.log(elements)
    }

    //input has both id and class information
    else if (hasBoth == 2) {
        var idInd = selector.indexOf("#")
        var classInd = selector.indexOf(".")
        var name;

        //want name array to be of form: type,id,class

        //id comes first in selector string
        if (classInd > idInd) {
            var tempArr = selector.split("#")
            name = (tempArr[1].split("."))
            name.unshift(tempArr[0])
        }
        //class comes first in selector string
        else {
            var tempArr = selector.split(".")
            name = (tempArr[1].split("#"))
            name.unshift(tempArr[0])
            //swap the last two elements so it matches array form we desire
            name.swap(1, 2)
        }

        //get all elements using tag
        var currElems = document.getElementsByTagName(name[0])

        //check that these elements match the given id and className
        for (var i = 0; i < currElems.length; i++) {
            if (currElems[i].id == name[1] && currElems[i].className.indexOf(name[2]) != -1  ) {
                elements.push(currElems[i])
            } else {}
        }
        console.log("had both id and class, elements are ")
        console.log(elements)
    }
    //selector contains only id or className
    else {

        switch (currType) {
            case "id":
                var name = selector.split("#")

                //simple selector input, no tag involved
                if (name[0] == "") {
                    elements.push(document.getElementById(name[1]))
                    console.log("only id, elements are ")
                    console.log(elements)
                } else {
                    //using tag and id to get, testing id matches the one we're looking for
                    var currElems = document.getElementsByTagName(name[0])
                    for (var i = 0; i < currElems.length; i++) {
                        if (currElems[i][currType].indexOf(name[1]) != -1) {
                            elements.push(currElems[i])
                        } else {
                        }
                    }
                    console.log("using id and type, elements are: ")
                    console.log(elements)
                }

                break;
            case "className":
                var name = selector.split(".")
                if (name[0] == "") {
                    //simple selector input, no tag involved
                    elements = document.getElementsByClassName(name[1])
                    console.log("only class, elements are: ")
                    console.log(elements)
                } else {
                    //using tag and class to get, testing class matches the one we're looking for
                    var currElems = document.getElementsByTagName(name[0])
                    for (var i = 0; i < currElems.length; i++) {
                        if (currElems[i][currType].indexOf(name[1]) != -1) {
                            elements.push(currElems[i])
                        } else {
                        }
                    }
                    console.log("using class and type, elements are ")
                    console.log(elements)

                }

                break;

            default :
                console.log("default, error")
                break;
        }
    }

    console.log("--------------")

    return elements;
}

/**
 *  Used to swap two elements in an array
 * * @param {Number} x index of the first element
 * * @param {Number} y index of the second element
 */
Array.prototype.swap = function (x, y) {
    var b = this[y];
    this[y] = this[x];
    this[x] = b;
};