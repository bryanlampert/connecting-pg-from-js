const settings = require("./settings"); // settings.json

const knex = require('knex')({
  client: 'pg',
  connection: {
    host      : settings.hostname,
    user      : settings.user,
    password  : settings.password,
    database  : settings.database,
  }
});

const myArgs = process.argv[2];

const resultsLog = function(result) {
  console.log(
    "Found " + result.length + " person(s) by the name '" + myArgs + "'"
    );

  const personBirthDate = function(result) {
    let bd = result.birthdate;
    let yr = bd.getFullYear();
    let month = bd.getMonth() + 1;
    let day = bd.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    return ("'" + yr + "-" + month + "-" + day + "'");
  };


  if (result[0]) {
    result.forEach( (person, index) => {

      console.log(
        "- " + person.id + ": " + person.first_name + " " + person.last_name +
        " born " + personBirthDate(person)
        );
    });
  }
};

const findByLastName = function(myArgs) {
  console.log("Searching ... ");
  knex
  .select()
  .table("famous_people")
  .where("last_name", myArgs)
  .then((result) => {
    resultsLog(result);
    knex.destroy();
  })
  .catch((error) => {
    console.error(error);
  });
};

if (myArgs) {
  findByLastName(myArgs);
} else {
  console.log("Please enter a last name");
}
