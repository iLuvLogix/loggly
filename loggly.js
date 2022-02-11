/* INFO: Require file-system for fs-ops */
var fs = require('file-system');
/* INFO: Require 'colors' for coloring messages */
var colors = require('colors');
/* INFO: Define location of config-file for log-state of the application (adjust to your needs) */
const locationLogglyConfig = `./config/loggly-config.json`;

// Simple logger using console.log(), console.group() and some funky ASCII, please note that additionally to the severity-level 
// according to RFC5424, another distinction is made here via 'type' This allows better fine-tuning of the logger. 
// Lets assume you encounter a warning (level 4), but you still want to display the console-log with an error-decoration 
// in some special cases in order to draw attention when looking at the log, you can use the type 'err'.

// To additionally write the log to file, set the value for 'writeToFile' in 'loggly-config.json' to true 
// and set the correct path for 'logFileLocation'


//     .------.     _______________ 
//    /  _)  __\   |  E R R O R !  |
//   |      ( )/   |_  ____________|
//    \___     \     |/
//        ``||||      


/* INFO: Logging levels/priorities according to RFC5424: */
// { 
//      emerg: 0,
//      alert: 1,
//      crit: 2,
//      error: 3,
//      warning: 4,
//      notice: 5,
//      info: 6,
//      debug: 7
// }

/* INFO: Logging states of the app in './config/log-level.json' (can be changed at runtime): */
//  verbose (log msgs of all priorities, 0-7)
//  normal  (log msgs of priorities 0-4)
//  silent  (log no msgs)

/* INFO: Logging source-types (adapt/extend as needed): */
//  db      -> database related msgs
//  app     -> main app module related msgs
//  route   -> route related msgs
//  mqtt    -> mqtt related msgs

/* INFO: Define array for mapping levels to text-representation */ 
const mapLevelToString = [ 
  {level:0, text:"EMERGENCY"}, 
  {level:1, text:"ALERT"},
  {level:2, text:"CRITICAL"},
  {level:3, text:"ERROR"},
  {level:4, text:"WARNING"}, 
  {level:5, text:"NOTICE"}, 
  {level:6, text:"INFO"}, 
  {level:7, text:"DEBUG"} 
]


/* INFO: Define various delimiters for easier visibility & distinction (adjust to your needs/source-types) */ 
const delimiterApp =  `**********************************************************`;
const delimiterDB =   `*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*DB*`;
const delimiterRoute= `[][][][][][][][][][][][][][][][][][][][][][][][][][][][]`;
const delimiterMQTT = `((((((  ((((( (((( ((( (( < o > )) ))) )))) )))))  ))))))`;
const delimiterError= `     .-----.     _______________ `+`\n`+`   /  _)  __\\   |  E R R O R !  |`+`\n`+`  |      ( )/   |_  ____________|`+`\n`+`   \\___     \\     |/`+`\n`+`       \`\`||||`;


/* INFO: Periodically read config-file (every 60s) to retrieve log-state of application*/ 
function getLogState(){
  
  this.logState = "verbose";

  
  setInterval(() => {

    fs.readFile(locationLogglyConfig, 'utf8', function read(err, res) {
      if (err) {
        console.log(delimiterError.red);
        console.log(`ERROR while reading from ${locationLogglyConfig}: ${err}\n`);
        /* INFO: USe default log-state (verbose) */ 
        console.log(`USING DEFAULT VALUES FOR 'logState' ('verbose')..\n`);
        return this.logState;
      }
      else {
        this.logState = res.state;
        return this.logState;
      }
    });
  }, 60000);
}


var currentLogState = new getLogState();

/* INFO: Define the source-types of the message to log (adjust to your needs/source-types) */ 

const messageTypes = {
  types: [
    {type:"app",delimiter:delimiterApp},
    {type:"db",delimiter:delimiterDB},
    {type:"route",delimiter:delimiterRoute},
    {type:"mqtt",delimiter:delimiterMQTT.green},
    {type:"err",delimiter:delimiterError},
  ] 
}


/* INFO: Handle messages according to level, type, and log-state of the application defined in loggly-config.json */

var handleMSG = (msg, type, origin, level) => {
  /* INFO: Check type & level */  
  let resLevel = mapLevelToString.filter(obj => obj.level === level);
  let resType = messageTypes.types.filter(obj => obj.type === type);
  if (resType.length > 0 && resLevel.length > 0) {
    
    console.log(resType[0].delimiter);
    console.group()
    console.log(`${resLevel[0].text} of file [${origin}]:` );
    console.group();
    switch (level) {
      case (0): 
        console.log(`${msg}\n`.red);
        break;
      case (1): 
        console.log(`${msg}\n`.red);
        break;
      case (2): 
        console.log(`${msg}\n`.red);
        break;
      case (3): 
        console.log(`${msg}\n`.red);
        break;
      case (4): 
        console.log(`${msg}\n`.yellow);
        break;
      case (5): 
        console.log(`${msg}\n`.green);
        break;
      case (6): 
        console.log(`${msg}\n`.cyan);
        break;
      case (7):   
        console.log(`${msg}\n`.rainbow);
        break;
      default:
        console.log(`${msg}\n`.grey);
        break;
    }
    console.groupEnd();
    console.groupEnd();
  }
  else {
    console.log(delimiterError.red);
    console.group()
    console.log('EMERGENCY in [loggly.js]:');
    console.group()
    console.log(`Wrong value for 'level' and/or 'type'!\n`);
    console.groupEnd();
    console.groupEnd();
  }
}


var filterMSG = (msg, type, origin, level) => {
  /* INFO: Check current log-state of application  */
  switch(currentLogState.logState) {
    case `verbose`: // log all messages (0-7)
      handleMSG(msg, type, origin, level);
    case `normal`: // log messages from level 0-4
      if (level<5) {
        handleMSG(msg, type, origin, level);
      }
      else {
        break; // do nothing
      }
    case `silent`: // don't log any messages
      break; // do nothing
    default: // INFO: Wrong value for 'state'
    console.log(delimiterError.red);
    console.group()
    console.log('EMERGENCY in [loggly.js]:');
    console.group()
    console.log(`Wrong value for 'level' in ${locationLogglyConfig}!\n`);
    console.groupEnd();
    console.groupEnd();
   }
 }

/* INFO: Exported function according to level/severity (0-7) */ 

module.exports = {

  /* INFO: Log messages of type 'emergency' which relates to log-level 0 */ 
  emerg: (msg, type, origin) => {  // INFO: Args Example: log('Tim lost his keys!', 'route', 'downvote.js') 
    let level = 0;
    filterMSG(msg, type, origin, level);
  },

  /* INFO: Log messages of type 'alert' which relates to log-level 1 */
  alert: (msg, type, origin) => {  // INFO: Args Example: loggle.alert('Tim found his keys!', 'app', 'upvote.js') 
    let level = 1;
    filterMSG(msg, type, origin, level);
  },

  /* INFO: Log messages of type 'critical' which relates to log-level 2 */
  crit: (msg, type, origin) => {  // INFO: Args Example: log('Tim lost his keys again..', 'db', 'lostAndFound.js') 
    let level = 2;
    filterMSG(msg, type, origin, level);
  },

  /* INFO: Log messages of type 'error' which relates to log-level 3 */
  error: (msg, type, origin) => {  // INFO: Args Example: log('Tim has no keys!', 'mqtt' 'broadcast.js') 
    let level = 3;
    filterMSG(msg, type, origin, level);
  },

  /* INFO: Log messages of type 'warning' which relates to log-level 4 */
  warning: (msg, type, origin) => {  // INFO: Args Example: log('Tim has only one key!', 'mqtt' 'subscribe.js') 
    let level = 4;
    filterMSG(msg, type, origin, level);
  },

  /* INFO: Log messages of type 'notice' which relates to log-level 5 */
  notice: (msg, type, origin) => {  // INFO: Args Example: log('Tim's keys match row where id=23', 'db' 'dbOPS.js') 
    let level = 5;
    filterMSG(msg, type, origin, level);
  },

  /* INFO: Log messages of type 'info' which relates to log-level 6 */
  info: (msg, type, origin) => {  // INFO: Args Example: log('Tim's keys are keys that belong to Tim.', 'app' 'app.js') 
    let level = 6;
    filterMSG(msg, type, origin, level);
  },

  /* INFO: Log messages of type 'debug' which relates to log-level 7 */
  debug: (msg, type, origin) => {  // INFO: Args Example: log('Tim's keys are keys that belong to Tim and are therfore Tim's keys.', 'app' 'app.js') 
    let level = 7;
    filterMSG(msg, type, origin, level);
  }

}
