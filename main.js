var PlayerOne = {
    name : 'Nihat',
    is_bot : false,
    number : 1,
    status : 0,
    div : document.querySelector('.game .playerone .body'),
    status : '' ,
    cards :  [  ] ,
}
var PlayerTwo = {
    name : 'BOT',
    is_bot : true ,
    number : 2,
    status: 1,
    div : document.querySelector('.game .playertwo .body'),
    cards :  [  ] ,
}
var Table = {
    div : document.querySelector('.game .table'),
    aSlot : 0 ,
    bSlot : 0 ,
    slots : [ {status : 0} , {status:0} , {status:0} , {status:0} , {status:0} , {status:0} ,
              {status:0} , {status:0}, {status:0} , {status:0} , {status:0} , {status:0}  ]
}

var Game = {
    player_count : 2,
    players : [PlayerOne,PlayerTwo],
    deck_count : 24,
    reamining_deck_count : 24,
    card_count_per_player  : 6,
    duration : 15 ,
    attacker : 1,
    defender : 2,
    draggedCard : [] ,
    trump : '' ,
    table : Table ,
    is_started : false ,
};



const discardedDeckDiv = document.querySelector('.discarded-deck');
const remainingDeckDiv = document.querySelector('.remaining-deck');

var clubs = ['9-c','10-c','j-c','q-c','k-c','a-c'];
var diamonds = ['9-d','10-d','j-d','q-d','k-d','a-d'];
var hearts = ['9-h','10-h','j-h','q-h','k-h','a-h'];
var spades = ['9-s','10-s','j-s','q-s','k-s','a-s'];

var deck =[];
deck = deck.concat(clubs,diamonds,hearts,spades);
allDeck =deck;

const  shuffle_deck  = () => {
    for (let i=0;i<deck.length;i++){
        let j = Math.floor(Math.random()*deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
       
    }
}
const find_trump = () =>{
    let j = Math.floor(Math.random()*deck.length);
    Game.trump = deck[j].slice(deck[j].indexOf('-')+1);
    console.log('Game trump is ' + Game.trump);
}

shuffle_deck();
find_trump();

function drawCard () {
    Game.players.forEach((player)=>{
        if ( player.cards.length   < 6  ){
            let i =  player.cards.length;
            for (i; i<6;i++ ){
                if (deck.length >0){
                    let x = Math.floor(Math.random()*deck.length);
                    let y = deck.splice(x,1)[0];

                    let img_ = document.createElement('img');
                    img_.src  = "images/" + y + ".png";
                    img_.id = "_" + Math.random().toString(16).slice(2,8);
                    img_.dataset.rank=y;
                    img_.draggable = true;
                    img_.setAttribute("ondragstart","dragStart(event,"+player.number +")");
                    player.div.append(img_);
                    Game.reamining_deck_count--;
                    player.cards[i] = {
                        card_id : img_.id,
                        card_rank : y,
                        card_number : y.slice(0,y.indexOf('-')),
                        card_type : y.slice(y.indexOf('-')+1),
                    }
                }
            }
        }
    })
remainingDeckDiv.querySelector('span').innerHTML = Game.reamining_deck_count;
}

drawCard();


function dragStart(event,a){
    Game.players[a-1].cards.forEach((e)=>{
  
        if (e.card_id==event.target.id){
            Game.draggedCard = e;
            
        }
    })
    Game.draggedCard.player_number = a;
    console.log(Game.draggedCard) ;
}


function drop(event,a) {
    event.preventDefault();
   // WHAT does he do ? defending or attacking ? now i am finding it 
    let result ;
    if ( Game.draggedCard.player_number  == Game.defender ){
        if  (a%2==1) {a++;}
          result = defend(a-1);
    }else{
        if (a%2==0) { a-- }
         result = attack();
    }
    console.log(result);
    let slotSpan =document.getElementById('slot_'+a);
    if (result === true & slotSpan.childElementCount == 0  ){
            Game.table.slots[a-1] = '';
            Game.table.slots[a-1] =  Game.draggedCard ;
            Game.table.slots[a-1].status = 1;
            Game.players[Game.draggedCard.player_number-1].cards  =  Game.players[Game.draggedCard.player_number-1].cards.filter( item=> item.card_id != Game.draggedCard.card_id);
            slotSpan.append(document.getElementById(Game.draggedCard.card_id));
            a%2 ==1 ? Game.table.aSlot++ : Game.table.bSlot++ ;
            update_game();


    }        
}   


const attack =()=>{
    if ( Game.table.aSlot  == 0){
        return true;
    }else {
        let numbers = [];
        Game.table.slots.map( (item)=>  item.status ==1 ? numbers.push(item.card_number) : ''    );
         return  ( numbers.indexOf(Game.draggedCard.card_number) != -1  ); 
    }
}


const defend = (slot_number) =>{
    const rankedOrder=['6','7','8','9','10','j','q','k','a'];
    if ( Game.draggedCard.card_type == Game.table.slots[slot_number-1].card_type  ){
        return rankedOrder.indexOf(Game.draggedCard.card_number) > rankedOrder.indexOf(Game.table.slots[slot_number-1].card_number)
    }
    else{
        return ( Game.draggedCard.card_type == Game.trump ) ;   
    }
}




const update_game = () => {
    let x ;
    timer = 15; 
    if ( Game.table.aSlot == Game.table.bSlot ) {
         x = document.createElement('button');
        x.innerHTML =   Game.players[Game.attacker-1].name + ' pass ';
        x.setAttribute('onclick',"pass() ");  
    }else {
         x = document.createElement('button');
        x.innerHTML =   Game.players[Game.defender-1].name + ' take it';
        x.setAttribute("onclick",  "take_cards(0)" );
        
    }
    if (PlayerTwo.cards.length == 0){
        alert('Bot you won this game');
    }else if (PlayerOne.cards.length ==0) {
        alert('Nihat Wow  you are lik creator of  this game');
    }
    document.querySelector(".buttons").innerHTML ='' ;
    document.querySelector(".buttons").appendChild(x);
}





function take_cards (e) {
    let x;
    timer = 15;
    if ( e == 0  ){
        x = document.createElement('button');
        x.innerHTML =   Game.players[Game.attacker-1].name + ' pass ';
        x.setAttribute("onclick",  "take_cards(1)" );
        document.querySelector(".buttons").innerHTML ='' ;
        document.querySelector(".buttons").appendChild(x);
        
    }
    else if (e == 1){
        document.querySelector('.buttons').innerHTML = '';
        Game.table.slots.map( (item) => {  if (item.status ==1)   { item.player_number = Game.defender;    Game.players[Game.defender-1].cards.push(item);  Game.players[Game.defender-1].div.append(document.getElementById(item.card_id))  }  } )  
        clearTable();
        drawCard();
    }
    
    
}

   
   
const pass = () =>{

    Game.table.slots.map( (item) => { if (item.status ==1)   { document.querySelector('.discarded-deck').append(document.getElementById(item.card_id))  }  } );
    [Game.defender,Game.attacker]  = [Game.attacker,Game.defender];
    document.querySelector('.buttons').innerHTML = '';
    clearTable();
    drawCard();
    timer = 15;
    

}

const clearTable = () =>{
    Game.table.aSlot = 0 ; Game.table.bSlot = 0;
    Game.table.div.querySelectorAll('img').forEach((e)=>{
        e.remove();
    })
    Game.table.slots =  [ {status : 0} , {status:0} , {status:0} , {status:0} , {status:0} , {status:0} ,
        {status:0} , {status:0}, {status:0} , {status:0} , {status:0} , {status:0}  ];
}
const discardCards = () =>{
    Game.table.div.querySelectorAll('img').forEach((e)=>{
        discardedDeckDiv.append(e);
    })
    clearTable();
}

var timer = 15;


var  startTimer = setInterval( ()=>{
    if (timer >0){
        timer--;
        document.querySelector('.timer').innerHTML = timer + " seconds ";
    }else {
        if ( Game.table.aSlot ==0 ){
            // alert( Game.players[Game.attacker-1].name +" lost this game" );
            clearInterval(startTimer);
            // attacker lose game
        }else if ( Game.table.aSlot > Game.table.bSlot )  {
            take_cards(1);
        }else if (Game.table.aSlot == Game.table.bSlot ){
            pass ()
        }
    }
    
},1000) ;





// function  refreshButtons  (a) {

//     // a == 0 firsAttack , adding Take it button to opponet
//     // a == 1
//     if (Game.defender ==1 ){
//         p_d = PlayerOne ;
//         p_a = PlayerTwo;
//     }else if (Game.defender ==2){
//         p_d = PlayerTwo;
//         p_a = PlayerOne;
//     }
//     console.log(p_d)
//     let  = p_d.div.querySelector('.actions button');
//     let p_a_b = p_a.div.querySelector('.actions button');
    
//     if (a==0){
//       p_d_b.innerHTML = 'Take it';
//       p_a_b.innerHTML = "";
//     }else if (a==1){
//         p_d_b.innerHTML = '';
//         p_a_b.innerHTML = 'Finish';
//     }else if (a==2){
//         p_d_b.innerHTML ='i am taking it';
//         p_a_b.innerHTML = 'Finish';
//     }
// }



   // else if ( Game.draggedCard.playerNumber == 1 & Game.defender==1 & attackerCardPlace.childElementCount !=0 &  defenderCardPlace.childElementCount == 0 ) {
    //     defenderCardPlace.append(document.getElementById(Game.draggedCard.card_id));
    // }
    // else if ( Game.draggedCard.playerNumber == 2 & Game.attacker==2 & attackerCardPlace.childElementCount == 0 ) {
    //     attackerCardPlace.append(document.getElementById(Game.draggedCard.card_id));
    // }
    // else if ( Game.draggedCard.playerNumber == 2 & Game.defender==2 & attackerCardPlace.childElementCount !=0 & defenderCardPlace.childElementCount == 0 ) {
    //     defenderCardPlace.append(document.getElementById(Game.draggedCard.card_id));
    // }
// Game.players.forEach((player)=>{
//     for (let i=1;i<=6;i++){
//         let j = Math.floor(Math.random()*deck.length) ;
//         let k = deck.splice(j,1)[0];

//         let img_ = document.createElement('img');
//         img_.src  = "images/" + k  + ".png";
//         img_.id = "_" + Math.random().toString(16).slice(2,8);
//         img_.dataset.rank=k;
//         img_.draggable = true;
//         img_.setAttribute("ondragstart","dragStart(event)");
//         player.div.append(img_);
//         Game.reamining_deck_count--;
//     }
// })
// if (ev.target.tagName.toLowerCase() == "div"  ){
//     mainDiv = ev.target;
// }else if (ev.target.tagName.toLowerCase() == "span"  ) {
//     mainDiv = ev.target.parentElement;
// }else {
//     mainDiv = ev.target.parentElement.parentElement;
// }