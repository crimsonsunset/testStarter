/**
 * @author Joe Sangiorgio
 * JS Backend for airtime code test
 * http://challenge2.airtime.com:7182/
 */

//globals
var isDev = false;
var url = (isDev) ? "http://0.0.0.0:5000" : "http://awsflask-d7jzwtbv7t.elasticbeanstalk.com/"

//routes for URL endpoints
START_ROUTE = "/start"
EXITS_ROUTE = "/exits"
MOVE_ROUTE = "/move"
WALL_ROUTE = "/wall"
REPORT_ROUTE = "/report"

var maze = (function () {
    var maze = {}
    maze.startRoom = ""
    //data object that will be used to store information about the maze
    maze.roomRef = {}
    //used as stack for the depth-first search
    maze.stack = []
    //rooms with lights on
    maze.workingRooms = []
    //rooms with lights off
    maze.brokenRooms = []
    maze.message = ""
    maze.curr = ""

    /**
     * Used to get the roomId of the first room
     */
    function start() {
        $.ajax({
            url: url + START_ROUTE,
            type: "GET",
            async: false,
            success: function (data) {
                var d = (JSON.parse(String(data)));
                maze.startRoom = d.roomId
                console.log("startRoom is: " + maze.startRoom)
                //initiate the search with the first node: the start room
                maze.dfs(maze.startRoom)
            }
        });
    }

    /**
     * Used to sort an array of objects.
     * * @param {string} field - The field you wish to sort by
     * * @param {boolean} reverse - sort in ascending/descending order
     * * @param {function} primer - function that tells how to sort
     */
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

    /**
     * Convenience function used to fully populate a new room reference object
     * @param {string} currRoom - The room to initiate.
     */
    maze.newRoom = function (currRoom) {
        maze.examineRoom(currRoom)
        maze.checkWall(currRoom)
    }

    //util wrapper functions

    /**
     * Used to initialize a new room reference object and populate its exits object
     * @param {string} roomId - The room to examine.
     */
    maze.examineRoom = function (roomId) {
        $.ajax({
            url: url + EXITS_ROUTE + "?roomId=" + roomId,
            type: "GET",
            async: false,
            success: function (data) {
                var d = (JSON.parse(String(data)));
                //start building out this room's reference object.
                maze.roomRef[roomId] = {}
                maze.roomRef[roomId].exits = {}
                _.each(d.exits, function (e, i, l) {
                    maze.moveToRoom(roomId, e)
                    //populate the exits object with the IDs of rooms in corresponding directions
                    maze.roomRef[roomId].exits[e] = maze.curr
                });

                console.log("EXAMINED roomID: " + roomId)
            }
        });
    }

    /**
     * Used to populate room reference object's wallInfo property
     * @param {string} roomId - The room to check.
     */
    maze.checkWall = function (roomId) {
        $.ajax({
            url: url + WALL_ROUTE + "?roomId=" + roomId,
            type: "GET",
            async: false,
            success: function (data) {
                var d = (JSON.parse(String(data)));
                if (!maze.roomRef[roomId].wallInfo) {
                    //populate data about this room in its respective object
                    maze.roomRef[roomId].wallInfo = d
                } else {
                }
                maze.roomRef[roomId].checked = true;
                console.log("CHECKED roomID: " + roomId)
            }
        });
    }

    /**
     * Used to move from one room to a new one in a given direction
     * @param {string} roomId - The roomId of the room you're leaving
     * @param {string} exit - The direction you wish to leave in.
     */
    maze.moveToRoom = function (roomId, exit) {
        $.ajax({
            url: url + MOVE_ROUTE + "?roomId=" + roomId + "&exit=" + exit,
            type: "GET",
            async: false,
            success: function (data) {
                var d = (JSON.parse(String(data)));
                var newId = d.roomId
                console.log("moving " + exit + " from room Id: " + roomId + " to a new room: " + newId)
                if (!maze.roomRef[newId]) {
                    //add new room to refObj
                    maze.roomRef[newId] = {}
                    //use this id to populate exits object in callback
                    maze.curr = newId
                } else {
                    console.log("already here, and checked is: " + maze.roomRef[newId].checked)
                }
            }
        });
    }

    /**
     * Once data is aggregated and sorted, use this to POST findings to the mothership
     */
    maze.sendReport = function () {
        //can be called after collectData runs
        $.ajax({
            url: url + REPORT_ROUTE,
            type: "POST",
            async: false,
            data: {
                roomIds: maze.brokenRooms,
                challenge: maze.message
            },
            success: function (data) {
                var d = (String(data));
                console.log(d)
                alert(d)
            }
        });
    }

    //aux functions

    /**
     * Used to aggregate and sort data collected after searching the maze.
     * Will populate workingRooms, brokenRooms, and message as prep before the POST
     */
    maze.collectData = function () {
        _.each(maze.roomRef, function (e, i, l) {
            if (e.wallInfo.order == -1) {
                maze.brokenRooms.push(i)
            } else {
                var d = {
                    "writing": e.wallInfo.writing,
                    "order": e.wallInfo.order
                }
                maze.workingRooms.push(d)
            }
        });

        maze.workingRooms.sort(sort_by('order', true, function (a) {
            return a
        }));

        _.each(maze.workingRooms, function (e, i, l) {
            maze.message += e.writing
        });

        maze.sendReport();

    }

    /**
     * Implementation of depth-first search. Used to explore all nodes of the maze
     * @param {string} currRoom - The room you start in
     */
    maze.dfs = function (currRoom) {
        maze.stack.push(currRoom)
        while (maze.stack.length != 0) {
            var useRoom = maze.stack.pop()
            if ($.isEmptyObject(maze.roomRef[useRoom])) {
                console.log("found one thats not checked-- " + useRoom)
                maze.newRoom(useRoom)
                _.each(maze.roomRef[useRoom].exits, function (e, i, l) {
                    maze.stack.push(e)
                });

            }

        }

    }

    maze.init = function() {
        $("#label").show();
        start();
        maze.collectData();
    }

    return maze;
}());
