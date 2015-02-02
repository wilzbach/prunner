#!/usr/bin/env node

// executes some commands in parallel

//var spawn = require("child_process").spawn;
//var spawn = require("win-spawn");
var spawn = require("./lib/win_spawn");

if (process.argv.length < 3) {
  console.log("Please enter at least one process");
  process.exit(1);
}

var args = process.argv.slice(2);
console.log("starting: ", args.map(function(e) {
  return "'" + e + "'";
}).join(","));

var programs = args.map(function(e){
  return e.split(/\s+/);
});

var out = function(data) {
  process.stdout.write(data);
};

var outWrapper = function(name) {
  return function(text){
      text.split("\n").forEach(function(line){
        if(line.trim().length > 0){
          out("[" + name+ "]: " +  line.trim() + "\n");
        }
      });
  };
};

programs.forEach(function(program) {
  var p = spawn(program[0], program.slice(1));
  p.stdout.setEncoding('utf8');
  p.stdout.on("data", outWrapper(program.join("-")));
  p.stdout.on("err", outWrapper(program.join("-")));
  p.stderr.setEncoding('utf8');
  p.stderr.on("data", outWrapper(program.join("-")));
  p.stderr.on("err", outWrapper(program.join("-")));
});
