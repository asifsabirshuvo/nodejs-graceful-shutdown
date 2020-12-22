const express = require('express');

const app = express();

app.get('/', (req, res) => {
    setTimeout(() => {
        res.json({ ping: true });
    }, 5000);
});

const server = app.listen(3000, () => console.log('Running…'));

setInterval(() => server.getConnections(
    (err, connections) => console.log(`${connections} connections currently open`)
), 1000);

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


function shutDown() {
    console.log('Received kill signal, stopping incoming requests...');
    /*after this log all your running requests which are loading in browser
    should be servered. but if you hit new request of the localhost:3000/
    you should see that "Unable to connect" meaning that in the mean time
    server is not accepting. NGINX LB will play them.

    rare cases: sometimes this thing accepts new request but stops accepting new
    ones within 5-7 seconds. IDK why
    */
    server.close(() => {
        console.log('All pending connections are served! EXITING...');
        process.exit(0);
    });

    //     setTimeout(() => {
    //         console.log('we have initiated the graceful shutdown. we wont pay the cloud more than 10s for this old shit server');        
    //         process.exit(1);
    //     }, 10000);

}