var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));


function user(){
	var score;
	var nick;
	var state;
}

var users=[];
var session=[];

function init(){
	for(var i=0;i<10;i++){
		users.push(new user());
		users[i].score=10;
	}
}


function getindex(nick)
{
	if(nick==="이정헌"){
		return 1;
	}else if(nick==="박지원")return 2;
	else if(nick==="전도해")return 3;
	else if(nick==="전은진")return 4;
	else if(nick==="정혜원")return 5;
	else if(nick==="장영석")return 6;
	else if(nick==="이근환")return 7;
	else if(nick==="지헌")return 8;
	else return 0;
}


app.get('/',function(req,res) {
  res.send('hi');
});

app.get('/main',function(req,res){
  res.sendFile(__dirname + '/main.html');
});


io.on('connection',(socket)=>{
  socket.on('nick',(nick)=>{
  	var i=getindex(nick);
  	if(i>0){
  		console.log(nick + ' is login');
  		users[i].nick=nick;
  		users[i].score=10;
  		users[i].state="login";
  		session[socket.id]=i; 
  		socket.emit('go-page','main2');
  	}else
  		socket.emit('nick-is-wrong');
  });

  socket.on('disconnect',()=>{
  	var i=session[socket.id];
  	if(i===undefined)return;
  	users[i].state="logout";
  	console.log(users[i].nick + ' is logout');
  });


  socket.on('get-users',()=>{
  	socket.emit('get-users-response',users);
  });

  socket.on('set-score',(score)=>{
  	for(var i=1;i<=8;i++)
  	{
  		users[i].score=score[i];
  	}
  	console.log(users);
  	io.emit('get-users-response',users);
  });
  
  socket.on('lastshow',()=>{
  	io.emit('lastshow');
  });
});





http.listen(3000,function(){
  init();
  console.log('socket listen on *:3000');
});
