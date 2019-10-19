$(document).ready(function(){
    
    //Fire Base //
    var firebaseConfig = {
        apiKey: "AIzaSyA76LVKWgZ6VBsGonlNDoN_3tKX9SF-pIo",
        authDomain: "happy-hour-a23a6.firebaseapp.com",
        databaseURL: "https://happy-hour-a23a6.firebaseio.com",
        projectId: "happy-hour-a23a6",
        storageBucket: "happy-hour-a23a6.appspot.com",
        messagingSenderId: "256506802274",
        appId: "1:256506802274:web:eb8cd371f10b31a1d5613b",
        measurementId: "G-JYTZMWB1SZ"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Multiplayer Firebase Variables

    var database = firebase.database();

    var x=0;
    var y=0;
    var maze = [];
    var player = {
        x:      null,
        y:      null,
        loc:    null,
        moves:  null,
        status: false
    };
    var playersRef = database.ref("/players");
    var playerNum = null;
    var username = "";
    var userImageURL = "";
    var playerOneExists = false;
    var playerTwoExists = false;
    var playerOneData = null;
    var playerTwoData = null;

    var template = [

    // 0 is wall ; 1 is empty
    //1
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    //2
        0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,
    //3
        0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,
    //4
        0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,
    //5
        0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,
    //6
        0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,
    //7
        0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,
    //8
        0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
    //9
        0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,0,0,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
    //10
        0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,
    //11
        0,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,
    //12
        0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,1,1,1,1,1,0,1,0,
    //13
        0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,0,0,0,1,0,
    //14
        0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,1,1,1,0,
    //15
        0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,0,0,0,1,0,
    //16
        0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,0,1,0,
    //17
        0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,1,0,
    //18
        0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,1,0,
    //19
        0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,0,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,1,0,
    //20
        0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,
    //21
    //22
        0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1,0,
    //23
        0,0,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,
    //24
        1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,2,
    //25
        0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,
    //26
        1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,
    //27
        0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,
    //28
        0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,
    //29
        0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,
    //30
        0,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,
    //31
        0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
    //32
        0,1,0,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
    //33
        0,1,0,1,0,1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,
    //34
        0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,
    //35
        0,1,0,1,0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,
    //36
        0,1,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,
    //37
        0,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,
    //38
        0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,0,1,1,1,0,
    //39
        0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,0,0,0,
    //40
        0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1,1,1,1,0,
    //41
        0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,0,
    //42
        0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,0,1,0,
    //43
        0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,
    //44
        0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,
    //45
        0,1,0,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,
    //46
        0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,
    //47
        0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,
    //48
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        
    ];

    var canvas = document.getElementById("canvas");
            
    var ctx = canvas.getContext("2d");
    
    var greenKnight = new Image();
    greenKnight.src = "assets/images/greenKnight.png";

    var ninja = new Image();
    ninja.src = "assets/images/ninja.png";
    
    var treasure = new Image();
    treasure.src = "assets/images/treasure.png";
    
    var wall = new Image();
    wall.src = "assets/images/wall.png";

    //Set up start location of player 1
    var player1 = new Object ({
        x   :0,
        y   :22,
        loc :1166,
        moves:0,
        status: false
    });
    
    //Set up start location of player 1
    var player2 = new Object ({
        x   :0,
        y   :24,
        loc :1272,
        moves:0,
        status: false
    });

    //Save maze states in each cell
    for (var i = 0; i < ((53 * 47) + 1) ; i++) {
        maze.push ({
            "x"     : x , 
            "y"     : y , 
            "state" : template[i]
        });
            if (x == 52){
                y++;
                x = 0;
            }
            else {
                x++;
        }
    }

    //Generate key in function for moving
    document.onkeydown = function (event) {

        switch (event.keyCode) {

            //Right
            case 68:
                //Once players click right key, players x loction will add 1 and moves willl increase 1. If hitting the wall, the right key wont't do anything. 
                // if (playerNum === 1 && playerOneData.x !== 52) {
                
                    player.loc ++;
                    if (maze[player.loc].state != 0 ){

                        ctx.clearRect(playerOneData.x * 15, playerOneData.x * 15, 15 ,15);
                        ctx.clearRect(playerTwoData.x * 15, playerTwoData.x * 15, 15 ,15);
                        //Paint where players were before they click keys
                        // player.x * 
                        // ctx.rect(player.x * 15, player.y * 15, 15 ,15);
                        // ctx.fill();
                        player.x ++;
                        player.moves ++;
                    }
                    else (player.loc--);
                // }
                break;
        
            //Left
            case 65:
                //Once players click left key, players x loction will decrease 1 and moves willl increase 1. If hitting the wall, the left key wont't do anything.

                if (player.x !== 0){
                    player.loc --;
                    if (maze[player.loc].state != 0 ){

                        ctx.clearRect(playerOneData.x * 15, playerOneData.x * 15, 15 ,15);
                        ctx.clearRect(playerTwoData.x * 15, playerTwoData.x * 15, 15 ,15);
                        //Paint where players were before they click keys
                        // ctx.rect(player.x * 15, player.y * 15, 15 ,15);
                        // ctx.fill();
                        player.x --;
                        player.moves ++;
                    }
                    else (player.loc++);
                }
                break;

            //Down
            case 83:
                //Once players click down key, players y loction will increase 1 and moves willl increase 1. If hitting the wall, the down key wont't do anything. 
                
                if (player.y !== 46){

                    //player.loc += 53;
                    player.loc += 53;
                    if (maze[player.loc].state != 0 ){

                        ctx.clearRect(playerOneData.x * 15, playerOneData.x * 15, 15 ,15);
                        ctx.clearRect(playerTwoData.x * 15, playerTwoData.x * 15, 15 ,15);
                        //Paint where players were before they click keys
                        // ctx.rect(player.x * 15, player.y * 15, 15 ,15);
                        // ctx.fill();
                        player.y ++;
                        player.moves ++;
                    }

                    else (player.loc -= 53);
                    
                }
                break;
            
            //Up
            case 87:
                //Once players click up key, players y loction will increase 1 and moves willl increase 1. If hitting the wall, the up key wont't do anything.

                if (player.y !=0){

                    player.loc -= 53;
                    if (maze[player.loc].state != 0 ){

                        ctx.clearRect(playerOneData.x * 15, playerOneData.x * 15, 15 ,15);
                        ctx.clearRect(playerTwoData.x * 15, playerTwoData.x * 15, 15 ,15);
                        //Paint where players were before they click keys
                        // ctx.rect(player.x * 15, player.y * 15, 15 ,15);
                        // ctx.fill();
                        player.y --;
                        player.moves ++;
                    }

                    else (player.loc += 53);
                }
                break;
        }

        playersRef.child(playerNum).update({
            x:      player.x,
            y:      player.y,
            loc:    player.loc,
            moves:  player.moves
            });

        console.log(playerNum);
        console.log(playersRef.child(playerNum));
    }

//------------------------iamge creation------------------------//
    // Image scroll display
    AOS.init();

    // Get IG image
    $("#getIGImage").on("click", function(){

        var token = "22117331751.0da22be.d1003c3b370f47b390079af113bd34be";
        
        // var currentLocation = window.location.href;
        // console.log(currentLocation);
        // var token = currentLocation.slice();
        
        // var username ="h707743";
        // var num_photos = 1;
        // $("#playerImage").html("");
        //     $.ajax({

        //         url: "https://api.instagram.com/v1/users/" + username + "/media/recent", // specify the ID of the first found user
        //         dataType: "jsonp",
        //         type: "GET",
        //         data: {access_token: token, count: num_photos},
        //         success: function(data){
        //             console.log(data);
        //             for( x in data.data ){
        //                 var igImage = $("#playerImage");
        //                 igImage.attr("src",data.data[x].images.low_resolution.url);
        //                 $("#playerImage").attr("style","display:block");
        //                 $("#player1").append(igImage);
        //             }
        //         },
        //         error: function(data2){
        //             console.log(data2);
        //         }
        //     });
        $("#image-display").html("");
        // first var token = "22117331751.0da22be.d1003c3b370f47b390079af113bd34be";
        var token = "22117331751.3aaa3da.94e479597e8345899f9bdb342937150e";
        num_photos = 1;
        $.ajax({
            url: "https://api.instagram.com/v1/users/self/media/recent",
            dataType: "jsonp",
            type: "GET",
            data: {access_token: token, count: num_photos},
            success: function(data){
                console.log(data);
                for( x in data.data ){
                    var imageDiv = $('<div data-aos="flip-right" data-aos-easing="ease-out-cubic" data-aos-duration="2000">');
                    var playerImage = $("<img id='playerImage'>");
                    playerImage.attr("src",data.data[x].images.low_resolution.url);
                    playerImage.attr("alt","If no picture shown, choose other heros.");
                    playerImage.attr("style","height: 400px;")
                    $(imageDiv).append(playerImage);
                    $("#image-display").append(imageDiv);
                }
            },
            error: function(data){
                console.log(data);
            }
        });
    });
    
    // Get random hero name and image
    $("#randomHero").on("click", function(event){
        $("#image-display").html("");
        var randomID = Math.floor(Math.random()*731) + 1;
        var queryURL = "https://www.superheroapi.com/api.php/2539613446097074/" + randomID;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
            var randomName = response.name;
            console.log(randomName);
            $("#usernameEnter").attr("value",randomName);
            var imageDiv = $('<div data-aos="flip-right" data-aos-easing="ease-out-cubic" data-aos-duration="2000">');
            var playerImage = $("<img id='playerImage'>");
            playerImage.attr("src",response.image.url);
            playerImage.attr("alt","If no picture shown, choose other heros.");
            playerImage.attr("style","height: 400px;")
            $(imageDiv).append(playerImage);
            $("#image-display").append(imageDiv);
        })
    });
    //------------------------iamge creation------------------------//

    //------------------------name creation------------------------//
    // Function to capitalize usernames
    function capitalize(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    //Once player decides name and image, click enter button to start the game
    $("#plyerNameEnter").on("click", function(event){
        event.preventDefault();
        if ($("#username").val() !== "") {
            username = capitalize($("#usernameEnter").val().trim());
            userImageURL = $("#playerImage").attr("src");
            $("#playerContainer").attr("style","display: none;");
            $("#gameContainer").attr("style","display: block;");
            logInGame();
        }
    });
    //------------------------name creation------------------------//


    // Tracks changes in key which contains player objects
    playersRef.on("value", function(snapshot) {
    
        // Check to see if players exist
        playerOneExists = snapshot.child("1").exists();
        playerTwoExists = snapshot.child("2").exists();
    
        // Player data objects
        playerOneData = snapshot.child("1").val();
        playerTwoData = snapshot.child("2").val();

        console.log(playerOneData);
        console.log(playerTwoData);
    
        // If theres a player 1, fill in user 1 data
        if (playerOneExists) {
            $("#player1-name").text(playerOneData.name);
            $("#player1-image").attr("src",playerOneData.iamge);
            $("#player1-moves").text("Moves: " + playerOneData.moves);
        } 
        
        else {
        // If there is no player 1, clear image/moves and show waiting
            $("#player1-name").text("Waiting for Player 1");
            $("#player1-image").empty();
            $("#player1-moves").empty();
        }
    
        // If theres a player 2, fill in user 2 data
        if (playerTwoExists) {
            $("#player2-name").text(playerTwoData.name);
            $("#player2-image").attr("src",playerTwoData.iamge);
            $("#player2-moves").text("Moves: " + playerTwoData.moves);
        } 
        
        else {
        // If no player 2, clear image/moves and show waiting
            $("#player2-name").text("Waiting for Player 2");
            $("#player2-image").empty();
            $("#player2-moves").empty();
        }

        if (playerOneExists && playerTwoExists) {

            console.log(playerOneExists);
            console.log(playerTwoExists);

            $("#instruction").attr("style","display: block;");

            $("#ready").on("click", function(){

                player.status = true;
                
                playersRef.child(playerNum).update({
                    status: player.status
                });

                $("#instruction").text("Waiting for the other player ready.");

                if (playerOneData.status && playerTwoData.status) {

                    $("#instruction").attr("style","display: none;");

                    for(var i=0; i < ((53 * 47) + 1) ; i++){

                        if (maze[i].state == 0 || maze[i].state == "0") {
                            ctx.drawImage(wall, maze[i].x * 15, maze[i].y * 15, 15, 15);
                        }
                        
                        if (maze[i].state == 2 || maze[i].state == "2") {
                            ctx.drawImage(treasure, maze[i].x * 15, maze[i].y * 15, 15, 15);
                        }
                    }
        
                    console.log(playerOneData.x);
                    console.log(playerOneData.y);
                    console.log(playerTwoData.x);
                    console.log(playerTwoData.y);
        
                    //Put image of where player2 is
                    ctx.drawImage(ninja, playerTwoData.x * 15, playerTwoData.y * 15, 15, 15);
        
                    //Put image of where player1 is
                    ctx.drawImage(greenKnight, playerOneData.x * 15, playerOneData.y * 15, 15, 15);
        
                    if (maze[playerOneData.loc].state == 2) {
                        $("#gameContainer").html(playerOneData.name + "wins");
                    }
        
                    if (maze[playerTwoData.loc].state == 2) {
                        $("#gameContainer").html(playerTwoData.name + "wins");
                    }
                }
            })
        }
    });

    // Function to get in the game
    function logInGame() {
    
        // Checks for current players, if theres a player one connected, then the user becomes player 2.
        // If there is no player one, then the user becomes player 1

        if (playerOneExists) {

            playerNum = 2;
            player = player2;
            $("#player2-image").attr("style","border: 3px solid goldenrod;");

        } 
        
        else {
            
            playerNum = 1;
            player = player1;
            $("#player1-image").attr("style","border: 3px solid goldenrod;");

        }

        // Creates key based on assigned player number
        playersRef.child(playerNum).update({
            name:   username,
            iamge:  userImageURL,
            x:      player.x,
            y:      player.y,
            loc:    player.loc,
            moves:  player.moves,
            status: player.status
            });

        // On disconnect remove this user's player object
        playersRef.child(playerNum).onDisconnect().remove();
    }
});