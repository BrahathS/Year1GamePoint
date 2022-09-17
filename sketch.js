/*

Game Project 8 - Make it Awesome 

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var game_score;
var lives;
var flagpole;

var jumpSound;
var collectSound;
var winSound;
var enemies;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    collectSound = loadSound('assets/collect_item.mp3');
    collectSound.setVolume(0.2);
    winSound = loadSound('assets/win.wav');
    winSound.setVolume(0.01);
}


function setup()
{
	createCanvas(1024, 576);
    lives = 4;
    textSize(20);
    
    startGame();
}
function startGame()
{
	
	floorPos_y = height * 3/4;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    trees_x = [];
    clouds = [
        {posX:250, posY:120},
        {posX:50, posY:90},
        {posX:750, posY:90},
        {posX:-350, posY:90}
    ];
    mountains = [
        {pos_x: 100,pos_y: 432},
        {pos_x: 1000,pos_y: 432},
        {pos_x: 1500,pos_y: 432},
        {pos_x: -500,pos_y: 432}
    ];

     collectables = [
        {pos_x: 50,
        pos_y: 405,
        size: 50,
        isFound: false}, 
        
        {pos_x: 150,
        pos_y: 405,
        size: 50,
        isFound: false},
         
        {pos_x: 350,
        pos_y: 405,
        size: 50,
        isFound: false},
         
        {pos_x: 450,
        pos_y: 405,
        size: 50,
        isFound: false},
         
        {pos_x: 800,
        pos_y: 405,
        size: 50,
        isFound: false},
         
        {pos_x: 865,
        pos_y: 350,
        size: 50,
        isFound: false},
         
        {pos_x: 1035,
        pos_y: 405,
        size: 50,
        isFound: false},          
        
        {pos_x: 1100,
        pos_y: 405,
        size: 50,
        isFound: false}, 
        
        {pos_x: 1250,
        pos_y: 350,
        size: 50,
        isFound: false},
        
        {pos_x: 1350,
        pos_y: 405,
        size: 50,
        isFound: false},
        
        {pos_x: 1450,
        pos_y: 405,
        size: 50,
        isFound: false},
        
        {pos_x: 1500,
        pos_y: 405,
        size: 50,
        isFound: false},
         
        {pos_x: 1550,
        pos_y: 405,
        size: 50,
        isFound: false},
        
    ];

     canyons = [
         {posX: 150,
          width: 100,
          height: 200},
         
         {posX: 550,
          width: 100,
          height: 200},
         
         {posX: 900,
          width: 100,
          height: 200},
         
         {posX: 1200,
          width: 100,
          height: 200},
         
    ];
    
    // game counter score
    game_score = 0;
    
    //flag pole position 
    flagpole = {x_pos: 1625, isReached: false, height: 300}
    
    //game character lives counter 
    lives -= 1;
    
    //enemies added 
    enemies = [];
    enemies.push(new Enemy(300,floorPos_y,100));
    enemies.push(new Enemy(675,floorPos_y,200));
    enemies.push(new Enemy(1400,floorPos_y,200));
    
    
    //array.push for the trees to place it in a random spot on the canvas 
    for (var i = 0; i < 5; i++)
    {
        x = random (50, 1500);
        trees_x.push(x);
    }
          
}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos, 0);
    
    // Draw clouds.
      drawClouds();
    
	// Draw mountains.
      drawMountains();
    
	// Draw trees.
       drawTrees();
    
    // Draw collectable items.
    for (var i = 0; i < collectables.length; i++)
    {
        if (!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);   
        }
    }
        
	// Draw canyons.
    for (var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
    
    if (!checkFlagpole.isReached)
    {
        checkFlagpole(flagpole);
    }
    
        //Draw the flagpole
        drawFlagpole(flagpole);
    
    //Draw Enemies 
    for (var i= 0;  i < enemies.length; i++)
    {
        enemies[i].update();
        enemies[i].draw(); 
        if (
            enemies[i].isContact(gameChar_world_x, gameChar_y)
            )
            {
                startGame();
                break;
            }
    }
    
   pop();

	   // Draw game character.
        drawGameChar();   
    
    // score and lives counter display
    textFont('Monospace');
    stroke(255,0,0);
    
    text("Score: " + game_score, 20, 40);
    text("Lives: " + lives, 20, 60);
    
    // text for instruction  
    //    text("Press W for jump", width/4, height/4);
    //    text("Press A to move left and D to move right", width/4, height/3);
 
    //conditional statement for game over and game complete
    if (lives < 1)
    {
        text("Gameover - Press SPACE to continue", width/2 - 100, height/2);
        
        return;
    }
    
    else if(flagpole.isReached)
    {
        text("Level Complete - Press SPACE to continue", width/2 - 100, height/2);
        
         return;
    }
       
    if (gameChar_y > height)
    {
        if (lives > 0)
        {
            startGame();
        }
    }
    
	// Logic to make the game character move or the background scroll.
    
    //////// Game character logic ///////
	// Logic to move
    
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 3;
		}
		else
		{
			scrollPos += 5; // positive for moving against the background
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.2)
		{
			gameChar_x  += 2;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.

    ///////////INTERACTION CODE//////////
	//Put conditional statements to move the game character below here

    //walking side to side
    if (isLeft)
    {
        isPlummeting = false;
        gameChar_x -= 1; //character move left speed 2x 
    }

    if (isRight)
    {
        isPlummeting = false;
        gameChar_x += 1; //character move right speed 2x
    }

    //jumping the character with gravity

    if (floorPos_y > gameChar_y)
    {
        gameChar_y += 2.5;
        isFalling = true;
    }
    else
    {
        isFalling = false;
    }
       
    
    //walking side to side
    if (isLeft)
    {
            gameChar_x -= 5;
    }

    if (isRight)
    {
            gameChar_x += 5;
    }

    //jumping the character with gravity

    if (floorPos_y > gameChar_y)
    {
            gameChar_y += 4;
            isFalling = true;
    }
    else
    {
            isFalling = false;
    }


	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

};

// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{

    if (keyCode == 65) //a key when pressed goes left
    {
        isLeft = true;
    }

    if (keyCode == 68) //d key  when pressed goes right
    {
        isRight = true;
    }
    if (keyCode == 87 && gameChar_y == floorPos_y) //w key when pressed jump top
    {
        isFalling = true;
        gameChar_y -= 100;
        jumpSound.play();
    }
    
    // space key pressed to restart th game
     if (flagpole.isReached && keyCode == 32)
    {
        nextLevel();
    }
    else if (lives == 0 && keyCode == 32)
    {
        returnToStart();
    }

}

function keyReleased()
{
    if (keyCode == 65)
    {
            isLeft = false;
    }

    if (keyCode == 68)
    {
            isRight = false;
    }

}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    
    if(isLeft && isFalling)
	{
		// add your jumping-left code

        //head
			fill(299,144,90);
			ellipse (gameChar_x, gameChar_y - 60, 20, 25);
            //headband
            fill(255,0,0);
            rect (gameChar_x - 10, gameChar_y - 68, 20, 5, 20);
            // eyes
            fill(0);
            ellipse(gameChar_x  - 5, gameChar_y - 60, 5, 5);


				//foot
				fill(0);
				rect(gameChar_x + 1, gameChar_y - 14, 13, 8); // right foot

			//body
			fill(0,0,255);
			rect(gameChar_x - 12 ,gameChar_y - 50, 25, 40, 5);

			//hands
			fill(299,144,90);
				// rect(gameChar_x - 15, gameChar_y - 50, 5, 30); // right hand
			rect(gameChar_x + 3, gameChar_y - 45, -23, 5); // left hand

			//foot
			fill(0);
			rect(gameChar_x - 16, gameChar_y - 18, 13,8); //left foot


	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code

		//head
		fill(299,144,90);
		ellipse (gameChar_x, gameChar_y - 60, 20, 25);
        //handband
        fill(255,0,0);
        rect (gameChar_x - 10, gameChar_y - 68, 20, 5, 20);
        //eyes
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);

			//foot
			fill(0);
			rect(gameChar_x - 14, gameChar_y - 15, 13,8); // left foot

		//body
		fill(0,0,255);
		rect(gameChar_x - 12 ,gameChar_y - 50, 25, 40, 5);

		//hands
        fill(299,144,90);
        rect(gameChar_x - 7, gameChar_y - 45, 25, 5); // right hand
        //rect(gameChar_x, gameChar_y - 45, 5, 30); // left hand

		//foot
		fill(0);
		rect(gameChar_x + 3, gameChar_y - 18, 13, 8); // right foot


	}
	else if(isLeft)
	{
		// add your walking left code

        //head
		fill(299,144,90);
		ellipse (gameChar_x, gameChar_y - 60, 20, 25);
        //headband
        fill(255,0,0);
        rect (gameChar_x - 10, gameChar_y - 68, 20, 5, 20);
        // eyes
        fill(0);
        ellipse(gameChar_x  - 5, gameChar_y - 60, 5, 5);

			//foot
			fill(0);
			rect(gameChar_x - 16, gameChar_y - 8, 13,8); // left foot

		//body
		fill(0,0,255);
		rect(gameChar_x - 12 ,gameChar_y - 50, 25, 45, 5);

		//hands
		fill(299,144,90);
			// rect(gameChar_x - 15, gameChar_y - 50, 5, 30); // right hand
		rect(gameChar_x + 3, gameChar_y - 45, 5, 25); // left hand

		//foot
		fill(0);
		rect(gameChar_x + 0.5, gameChar_y - 8, 13, 8); // right foot


	}
	else if(isRight)
	{
		// add your walking right code

        //head
		fill(299,144,90);
		ellipse (gameChar_x, gameChar_y - 60, 20, 25);
        //handband
        fill(255,0,0);
        rect (gameChar_x - 10, gameChar_y - 68, 20, 5, 20);
        //eyes
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);

			//foot
			fill(0);
			rect(gameChar_x + 4, gameChar_y - 8, 13, 8); // right foot

		//body
		fill(0,0,255);
		rect(gameChar_x - 12 ,gameChar_y - 50, 25, 45, 5);

		//hands
		fill(299,144,90);
		rect(gameChar_x - 7, gameChar_y - 45, 5, 25); // right hand
			//rect(gameChar_x, gameChar_y - 45, 5, 30); // left hand

		//foot
		fill(0);
		rect(gameChar_x - 13.2, gameChar_y - 8, 13,8); //left foot


	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code

        //head
		fill(299,144,90);
		ellipse (gameChar_x + 1, gameChar_y - 60, 20, 25);
        // headband
        fill(255,0,0);
        rect (gameChar_x - 10, gameChar_y - 68, 20, 5, 20);
        //eyes
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);
        ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);

		//hands
		fill(299,144,90);
		rect(gameChar_x - 15, gameChar_y - 60, 5, 30); // right hand
		rect(gameChar_x + 12, gameChar_y - 60, 5, 30); //left hand
		//body
		fill(0,0,255);
		rect(gameChar_x - 12 ,gameChar_y - 50, 25, 40, 5);
		//feet
		fill(0);
		rect(gameChar_x - 16, gameChar_y - 25, 13, 8); // left foot
		rect(gameChar_x + 2, gameChar_y - 25, 13, 8); // right foot

	}
	else
	{
		// add your standing front facing code

        //head
		fill(299,144,90);
		ellipse (gameChar_x, gameChar_y - 60, 20, 25);
        // headband
        fill(255,0,0);
        rect (gameChar_x - 10, gameChar_y - 68, 20, 5, 20);
        //eyes
        fill(0);
        ellipse(gameChar_x + 5, gameChar_y - 60, 5, 5);
        ellipse(gameChar_x - 5, gameChar_y - 60, 5, 5);
		//hands
		fill(299,144,90);
		rect(gameChar_x - 15, gameChar_y - 45, 5, 30); // right hand
		rect(gameChar_x + 12, gameChar_y - 45, 5, 30); // left hand
		//body
		fill(0,0,255);
		rect(gameChar_x - 12 ,gameChar_y - 50, 25, 45, 5);
		//feet
		fill(0);
		rect(gameChar_x - 16, gameChar_y - 8, 13, 8); // left foot
		rect(gameChar_x + 2, gameChar_y - 8, 13, 8); // right foot

	}
    
    
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.

function drawClouds()
{
    for (var i = 0; i < clouds.length; i++)
    {

        noStroke();
        fill(255);
         //text("cloud", 550, 75);
        //left side
        ellipse(clouds[i].posX, clouds[i].posY, 100, 75); /* middle */
        ellipse(clouds[i].posX + 65, clouds[i].posY, 75, 50); /*1side*/
        ellipse(clouds[i].posX - 65, clouds[i].posY, 75, 50); /*1side*/
        ellipse(clouds[i].posX - 100, clouds[i].posY, 50, 25);/*endsides*/
        ellipse(clouds[i].posX + 100, clouds[i].posY, 50, 25);/*endsides*/

          //right side
        ellipse(clouds[i].posX + 500, clouds[i].posY - 20, 100, 100);
        ellipse(clouds[i].posX + 450, clouds[i].posY - 20, 75, 75);
        ellipse(clouds[i].posX + 550, clouds[i].posY - 20, 75, 75);
        ellipse(clouds[i].posX + 410, clouds[i].posY - 20, 25, 25);
        ellipse(clouds[i].posX + 590, clouds[i].posY - 20, 25, 25);

          //small clouds
        ellipse(clouds[i].posX + 225, clouds[i].posY - 50, 50, 50);
        ellipse(clouds[i].posX + 250, clouds[i].posY - 50, 25, 25);
        ellipse(clouds[i].posX + 200, clouds[i].posY - 50, 25, 25);
        ellipse(clouds[i].posX + 186, clouds[i].posY - 50, 13, 15);
        ellipse(clouds[i].posX + 266, clouds[i].posY - 50, 13, 15);

          //small clouds
        ellipse(clouds[i].posX + 725, clouds[i].posY + 50, 100, 50);
        ellipse(clouds[i].posX + 775, clouds[i].posY + 50, 75, 25);
        ellipse(clouds[i].posX + 675, clouds[i].posY + 50, 75, 25);
        ellipse(clouds[i].posX + 635, clouds[i].posY + 50, 23, 15);

    }
}

// Function to draw mountains objects.

function drawMountains()
{
    for (var i = 0; i < mountains.length; i++)
    {

    //Main Mountain
        noStroke();
        fill(153, 63, 0);
        triangle(mountains[i].pos_x,
                 mountains[i].pos_y,
                 mountains[i].pos_x + 400,
                 mountains[i].pos_y,
                 mountains[i].pos_x + 200,
                 mountains[i].pos_y - 232); //main mountain

        triangle(mountains[i].pos_x + 50,
                 mountains[i].pos_y,
                 mountains[i].pos_x - 220,
                 mountains[i].pos_y,
                 mountains[i].pos_x - 100,
                 mountains[i].pos_y - 182); //small mountain

        fill(204, 255, 255);
        triangle(mountains[i].pos_x + 200,
                 mountains[i].pos_y - 232,
                 mountains[i].pos_x + 113,
                 mountains[i].pos_y - 132,
                 mountains[i].pos_x + 200,
                 mountains[i].pos_y - 182); //main mountain left ice triangle

        triangle(mountains[i].pos_x - 100,
                 mountains[i].pos_y - 182,
                 mountains[i].pos_x - 180,
                 mountains[i].pos_y - 60,
                 mountains[i].pos_x - 100,
                 mountains[i].pos_y - 147); //small mountain

        fill(204, 255, 255);
        triangle(mountains[i].pos_x + 100 + 100,
                 mountains[i].pos_y - 232,
                 mountains[i].pos_x + 200 + 87,
                 mountains[i].pos_y - 132,
                 mountains[i].pos_x + 200,
                 mountains[i].pos_y - 182); //main mountain right ice triangle

        triangle(mountains[i].pos_x - 100,
                 mountains[i].pos_y - 182,
                 mountains[i].pos_x,
                 mountains[i].pos_y - 62,
                 mountains[i].pos_x - 100,
                 mountains[i].pos_y - 147); //small mountain
    }

}

// Function to draw trees objects.
function drawTrees()
{
    for (var i = 0; i < trees_x.length; i++)
    {
      noStroke();
        fill(180, 80, 0);
        rect(trees_x[i] - 20, floorPos_y - 107, 46, 108);
        triangle(trees_x[i] - 10,
                 floorPos_y - 80,
                 trees_x[i] - 10,
                 floorPos_y - 50,
                 trees_x[i] - 50,
                 floorPos_y - 110);

        fill(0, 180, 0);
        ellipse(trees_x[i], floorPos_y - 135, 250, 75);
        ellipse(trees_x[i], floorPos_y - 175, 220, 75);

          //2nd tree tall
        fill(180, 80, 0);
        rect(trees_x[i] + 105, floorPos_y - 125, 25, 125);

        triangle(trees_x[i] + 105,
                 floorPos_y - 80,
                 trees_x[i] + 105,
                 floorPos_y - 100,
                 trees_x[i] + 75,
                 floorPos_y - 115);

        fill(0, 200, 0);
        ellipse(trees_x[i] + 120, floorPos_y - 150, 250, 75);
        ellipse(trees_x[i] + 120, floorPos_y - 200, 220, 75);
    }

}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------
// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    //for loop for canyons to being drawn
    noStroke();
    fill(255);
    fill(128, 128, 128);
    rect(t_canyon.posX, 
         floorPos_y, 
         t_canyon.width, 
         t_canyon.height);
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    // canyons
    if (gameChar_world_x > t_canyon.posX && 
        gameChar_world_x < t_canyon.width + t_canyon.posX - 7 && 
        isFalling == false)
    {
        isPlummeting = true;
        gameChar_y += 25;
    }
        
    if (gameChar_world_x > t_canyon.posX && 
        gameChar_world_x < t_canyon.width + t_canyon.posX - 7 && 
        isPlummeting == true)
    {
        isLeft == false;
        isRight == false;
    }
}

// ----------------------------------
// Flag pole render and check functions
// ----------------------------------

//Function to draw flag pole 
function drawFlagpole(t_flagpole)
{
    push();
    strokeWeight(15);
    stroke(200);
    line(t_flagpole.x_pos, floorPos_y, t_flagpole.x_pos, floorPos_y - flagpole.height);
    pop();
    
    if (t_flagpole.isReached)
    {
        fill (255,0,0);
        rect(t_flagpole.x_pos, floorPos_y - 
        flagpole.height, 60 , 40)
    }
}

//Function to check character reached the flag pole
function checkFlagpole(t_flagpole)
{
    if (dist(gameChar_world_x, 0, flagpole.x_pos, 0) < 20)
    {
        t_flagpole.isReached = true;
        winSound.play();
    }
}

// ----------------------------------
// Enemies render, updates and contact functions
// ----------------------------------

// Function for enemies 
function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.current_x = x;
    this.incr = 1;
    
    this.draw = function()
    {
        noStroke();
        fill(225,0,0);
        ellipse(this.current_x, this.y - 25, 40);
        
        fill(0);
        ellipse(this.current_x - 5, this.y - 25, 5);
        ellipse(this.current_x + 5, this.y - 25, 5);
        
        fill(30,09,98);
        triangle(this.current_x + 20, this.y - 35,
                 this.current_x, this.y - 60, 
                 this.current_x - 20,this.y - 35);
        
        stroke(255);
        line(
            this.current_x - 10,
            this.y - 35,
            this.current_x - 5,
            this.y - 30, 
            );
        stroke(255);
        line(
            this.current_x + 10,
            this.y - 35,
            this.current_x + 5,
            this.y - 30, 
            );
        
        noFill();
        stroke(0)
        beginShape();
        vertex(this.current_x - 10.5, this.y - 9)
        vertex(this.current_x - 7.5 , this.y - 15);
        vertex(this.current_x - 5.5, this.y - 7);
        vertex(this.current_x - 2, this.y - 15);
        vertex(this.current_x + 0.5, this.y - 6.5);
        vertex(this.current_x + 4, this.y - 15);
        vertex(this.current_x + 6, this.y - 6.5);
        vertex(this.current_x + 10, this.y - 15);
        endShape();
        
    };
    
    //movement of enemies 
    this.update = function()
    {
        this.current_x += this.incr;
        if (this.current_x < this.x)
        {
            this.incr = 1;
        }
        else if(this.current_x > this.x + this.range)
        {
            this.incr = -1;
        }
    }
    
    //contact with enemies and character
    this.isContact = function(gc_x, gc_y)
    {
        //return true if contact is made 
        var d = dist(gc_x, gc_y, this.current_x, this.y);
        
        if(d < 25)
        {
            return true;
        }
        return false;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
        
    //1st coin  = 1 point
    fill(249, 166, 2);
    ellipse(t_collectable.pos_x,
            t_collectable.pos_y,
            t_collectable.size * 0.4); //orange bg color
    
    fill(255, 255, 0);
    ellipse(t_collectable.pos_x,
            t_collectable.pos_y,
            t_collectable.size * 0.3); // yellow bg 
    
    fill(255);
    ellipse(t_collectable.pos_x,
            t_collectable.pos_y, 
            t_collectable.size * 0.1); // white bg color
    
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    var d;
    d =  dist(gameChar_world_x, 
              gameChar_y, 
              t_collectable.pos_x, 
              t_collectable.pos_y);

    if (d < t_collectable.size ) // 1st coin
    {
        t_collectable.isFound = true;
        console.log('you found the coin!');
        game_score +=100;
        collectSound.play();
    };
    
};

