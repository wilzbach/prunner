#!/usr/bin/env node

// executes some commands in parallel

var spawn = require("child_process").spawn;

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

console.log(programs);

var out = function(data) {
  process.stdout.write(data);
};

var outWrapper = function(name) {
  return function(line){
      out("[" + name+ "]: " +  line);
  };
};

programs.forEach(function(program) {
  var p = spawn(program[0], program.slice(1));
  p.stdout.on("data", outWrapper(program.join("-")));
});
