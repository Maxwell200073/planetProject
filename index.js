const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

function isHabitable(planet) {
    return (
        planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.36 &&
        planet["koi_insol"] < 1.11 && // Could also use dot notation on all
        planet["koi_prad"] < 1.6
    );
}

fs.createReadStream("kepler_data.csv")
    .pipe(
        parse({
            comment: "#",
            columns: true, // Makes each row its own object of key:value pairs instead of an array of values
        })
    )
    .on("data", (data) => {
        if (isHabitable(data)) {
            habitablePlanets.push(data);
        }
    })
    .on("error", (err) => {
        console.log(err);
    })
    .on("end", () => {
        console.log(habitablePlanets.map((planet) => planet.kepler_name));
        console.log(`${habitablePlanets.length} habital planets found!`);
    });
