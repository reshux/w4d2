const settings = require("./settings");
const knex = require("knex")({
  client: "pg",
  connection: {
    user: settings.user,
    password: settings.password,
    database: settings.database,
    host: settings.hostname,
    port: settings.port,
    ssl: settings.ssl
  }
});

const searchPar = process.argv[2];
const instanceDump = [];

// Formats the date back to what example shows

function formatDate(date) {
  let formattedDate = new Date(date),
    month = formattedDate.getMonth() + 1,
    day = formattedDate.getDate(),
    year = formattedDate.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// Compares the command line input the database rows

function searchCompare(data) {
  for (const row of data) {
    if (row.first_name === searchPar) {
      instanceDump.push(row);
    }
  }
}

// Outputs the number of matches and lists the matches

function resultPresenter(instanceDump) {
  console.log(
    "Found " +
      instanceDump.length +
      " person(s)" +
      " by the name " +
      "'" +
      searchPar +
      "':"
  );
  for (const instance of instanceDump) {
    console.log(
      instanceDump.indexOf(instance) +
        1 +
        "- " +
        instance.first_name +
        " " +
        instance.last_name +
        ", " +
        "born " +
        formatDate(instance.birthdate)
    );
  }
}

knex
  .select()
  .from("famous_people")
  .asCallback(function(err, rows) {
    if (err) return console.error(err);
    searchCompare(rows);
    resultPresenter(instanceDump);
    knex.destroy();
  });
