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

const first = process.argv[2];
const last = process.argv[3];
const date = process.argv[4];


const addPerson = function(first, last, date) {
  console.log("Adding ... ");
  knex("famous_people")
  .insert({
    first_name: first,
    last_name: last,
    birthdate: date
  })
  .then(() => {
    console.log("Added:", first, last, date);
    knex.destroy();
  })
  .catch((error) => {
    console.error(error);
  });
};

if (first, last, date) {
  addPerson(first, last, date);
} else {
  console.log("Please enter a first name, last name and birthdate");
}
