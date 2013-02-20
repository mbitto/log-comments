# log-comments
Convert JavaScript comments in logs, warnings or errors

## Getting Started
Install the module with: `npm install log-comments`

## Documentation
This tool should help in some rare situations, where you want your app to log for debugging purpose, but only
in testing or in production environment, so you don't want be distracted by a bloat of logs when you are developing.
Just put one of these three

- <-{l}
- <-{w}
- <-{e}

strings at the end of your comment and the comment will be wrapped
respectively with console.log(), console.warn(), console.error();

## Options
 --in-place, -i:   overwrite existing file with the new one  
 --directory, -d:  specify a directory, all .js files inside directory will be parsed and elaborated  
 --help, -h:       print help

## Examples
###code
// This will be a log <-{l}  
// This will be a warn <-{w}  
// This will be an error <-{e}

### cli
log-comments [OPTIONS] [FILE]


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).


## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Manuel Bitto  
Licensed under the MIT license.
