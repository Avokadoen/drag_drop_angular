# SamoPrototype

Prototype for the SAMO internal app

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## TODO

### discussion:
API: (All of the following need some auth)
  * get statistics about any query (i.e get all from org: 100)
    * should return total objects
    * more?
  * get all deliveries from any given user and/or organisation
  * get a collection of objects based on a page number and a page size (later this should return some extra objects that can be cached for optimization) 
  * generate a new delivery with delivery object count, organisation number, some id range(s), ...?
  * update a given object with new values 
