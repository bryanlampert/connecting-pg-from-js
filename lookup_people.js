const pg = require("pg");
const settings = require("./settings"); // settings.json
const myArgs = process.argv[2];


const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

function findByLastName(client, lastName, callback) {
  client.query(
    "SELECT * FROM famous_people WHERE last_name = $1::text;",
    [lastName],
    (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, result.rows[0]);
    }
  );
}

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }

  findByLastName(client, myArgs, (err, result) => {
    console.log("Searching ... ");
    const bd = result.birthdate;
    const yr = bd.getFullYear();
    let month = bd.getMonth() + 1;
    let day = bd.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    console.log(
      "Found " + result.length + " person(s) by the name '" +
      myArgs + "': \n- " +  result.id + ": " + result.first_name + " " +
      result.last_name + " born '" + yr + "-" + month + "-" + day + "'"
      );

    client.end();
  });

});

// // Non modularized code:
// client.connect((err) => {
//   if (err) {
//     return console.error("Connection Error", err);
//   }
//   console.log("Searching... ");
//   client.query("SELECT * from famous_people WHERE last_name = $1::text;", [myArgs])
//   .then((result) => {
//     const length = result.rows.length;
//     const idNum = result.rows[0].id;
//     const fn = result.rows[0].first_name;
//     const ln = result.rows[0].last_name;
//     const bd = result.rows[0].birthdate;
//     const yr = bd.getFullYear();
//     const month = bd.getMonth() + 1;
//     const day = bd.getDate();

//     console.log(
//       "Found " + length + " person(s) by the name '" +
//       myArgs + "': \n- " +  idNum + ": " + fn + " " +
//       ln + " born '" + yr + "-" + month + "-" + day + "'"
//       );
//   })
//   .then(() => client.end())
//   .catch((err) => console.log(`Something went wrong: ${err}`));

// });
