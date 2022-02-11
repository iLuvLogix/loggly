# loggly

Simple logger using console.log(), console.group(), some funky ASCII, coloring and custom delimiters - supports log-levels acc. to RFC5424.

Simple logger using console.log(), console.group() and some funky ASCII, please note that additionally to the severity-level 
according to RFC5424, another distinction is made here via 'type' This allows better fine-tuning of the logger. 
Lets assume you encounter a warning (level 4), but you still want to display the console-log with an error-decoration 
in some special cases in order to draw attention when looking at the log, you can use the type 'err'.

To additionally write the log to file, set the value for 'writeToFile' in 'loggly-config.json' to true 
and set the correct path for 'logFileLocation'

```
//      .------.     _______________ 
//     /  _)  __\   |  E R R O R !  |
//    |      ( )/   |_  ____________|
//     \___     \     |/
//         ``||||      
```

## INFO: 

### Logging levels/priorities according to RFC5424: */
      
 - emerg: 0,
 - alert: 1,
 - crit: 2,
 - error: 3,
 - warning: 4,
 - notice: 5,
 - info: 6,
 - debug: 7


### Logging states of the app in './config/log-level.json' (can be changed at runtime): */
 - verbose (log msgs of all priorities, 0-7)
 - normal  (log msgs of priorities 0-4)
 - silent  (no logs at all)

### Logging source-types (adapt/extend as needed): */
 - db      -> database related msgs
 - app     -> main app module related msgs
 - route   -> route related msgs
 - mqtt    -> mqtt related msgs
