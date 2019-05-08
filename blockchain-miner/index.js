const axios = require('axios');
const commander = require('commander');
const config = require('./config');
const crypto = require('crypto');
const colors = require('colors');


commander.option('--protocol [value]');
commander.option('--host [value]');
commander.option('--port [value]');
commander.option('--address [value]');
commander.parse(process.argv);


config.protocol = commander.protocol || config.protocol;
config.host = commander.host || config.host;
config.port = commander.port || config.port;
config.address = commander.address || config.address;


let nodeUrl = `${config.protocol}://${config.host}` + (config.port? `:${config.port}` : '');
let sha256 = (data) => {
    let hash = crypto.createHash('sha256');
    return hash.update(data).digest('hex');
};
let getMiningJob = async() => {
    let url = `${nodeUrl}/mining/get-mining-job/${config.address}`;
    return (await axios.get(url)).data;
};
let submitResult = async(result) => {
    return (await axios.post(`${nodeUrl}/mining/submit-mined-block`, result)).data;
};
let mine = async () => {
    try {
        // GET MINING JOB
        console.log('\n\n==========================================================================');
        console.log(colors.cyan('GETTING MINING JOB'));
        let job = await getMiningJob();


        // DISPLAY MINING JOB
        console.log('\nNEW JOB FOUND:');
        for(let key in job) console.log(`${colors.cyan(key + ':')} ${colors.white(job[key])}`);
        console.log('\n');


        // INIT MINING
        let result = {
            blockDataHash: job.blockDataHash,
            dateCreated: new Date().toISOString(),
            nonce: 0,
            blockHash: sha256(`${this.blockDataHash}|${this.dateCreated}|${this.nonce}`)
        };


        // START MINING
        if(job.difficulty > 0) {
            let pattern = new RegExp(`^0{${job.difficulty}}`);
            while (!pattern.test(result.blockHash)) {
                result.dateCreated = new Date().toISOString();
                result.nonce++;
                result.blockHash = sha256(`${result.blockDataHash}|${result.dateCreated}|${result.nonce}`);
                process.stdout.write(colors.cyan('MINING: ') + colors.white(`${result.dateCreated}|${result.nonce} = ${result.blockHash}\r`));
            }
        }


        // SUBMIT RESULT
        console.log('\n\n');
        process.stdout.write(colors.cyan('SUBMITTING PoW: '));
        let data = await submitResult(result);
        process.stdout.write(colors.white(data.message || data));
    }
    catch (error) {
        let response = error.response || {};
        let data = response.data || {};
        console.log('\n');
        console.log(colors.red('=================================='));
        console.log(colors.red(`ERROR: ${data.errorMsg || error.message || 'Unknown Error'}`));
        console.log(colors.red('=================================='));
    }
    mine();
};

console.clear();
console.log(`Node Url: ${nodeUrl}`);
mine();