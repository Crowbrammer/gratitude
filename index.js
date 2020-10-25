require('dotenv').config({ path: __dirname + '/.env' });
const PQuery = require('prettyquery');
const esc = require('sql-escape');
async function main() {
    const pQuery = new PQuery({ user: process.env.DB_USER, password: process.env.DB_PASSWORD, db: process.env.DATABASE });
    let num;
    switch (process.argv[2]) {
        case 'prev':
            if (/--amt/.test(process.argv[3])) {
                if (/all/.test(process.argv[3])) {
                    num = 'all';
                }
                else {
                    num = /\d+/.exec(process.argv[3])[0];
                    num ? true : num = 10;
                }
            }
            else {
                num = 10;
            }
            let gs;
            if (num === 'all') {
                gs = await pQuery.query(`SELECT * FROM gratitude ORDER BY id DESC;`); // gsus! 
            }
            else {
                gs = await pQuery.query(`SELECT * FROM gratitude ORDER BY id DESC LIMIT ${num};`); // gsus! 
            }
            console.log('\nWas grateful for:\n');
            gs.forEach(g => console.log(`'${g.grateful_for}' on:`, g.datetime_submitted));
            break;
        case 'count':
            const count = (await pQuery.query(`SELECT COUNT(*) amount_of_gratitude FROM gratitude;`))[0].amount_of_gratitude;
            console.log(`\nI have ${count} units of gratitude recorded.\n`);
            break;
        default:
            await pQuery.insert('gratitude', ['grateful_for'], [[process.argv[2]]]);
            console.log(`Was grateful for: ${process.argv[2]}`);
            break;
    }
    pQuery.connection.end();
    process.exit(0);
}
main().catch(err => console.error(err));
function ask(question) {
    return new Promise((res, _) => {
        rl.question(question, function (answer) {
            res(answer);
        });
    });
}
