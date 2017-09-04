# About

# Installation

## Requirements

Since this module is written in ES6, this module requires node 4.0.0 or higher.

## Commands

```
# Make sure both are installed globally
npm i -g yo generator-tsheets
```

# Commands

All commands can be invoked with yeoman by using `yo tsheets:command-name`.

## tsheets or tsheets:app

### Description

Creates a feature level directory in your source tree of the given application name.

If the app does not use redux, a directory with the given structure would be created:

```
application_name
├── components
├── containers
│   └── root_application_name
│       ├── index.js
│       └── root_application_name.js
├── index.js
└── services
```

If the app does use redux, a directory with the given structure would be created:

```
application_name
├── components
├── containers
│   └── root_application_name
│       ├── index.js
│       └── root_application_name.js
├── index.js
├── redux
│   ├── configure_store.dev.js
│   ├── configure_store.js
│   ├── configure_store.prod.js
│   ├── modules
│   └── root_reducer.js
└── services
```

### Usage
```
# The default invocation
yo tsheets
# equivalently
yo tsheets:app
```

## tsheets:component

### Description

Creates a stateful or stateless "dumb component" inside of the components directory of the given name. This is the first
command that you will run for a feature level directory. Consider this the "seeding" command.

```
application_name
├── components
│   └── example_stateless_component_name
│       ├── example_stateless_component_name.js
│       ├── example_stateless_component_name.test.js
│       └── index.js
├── containers
│   └── root_application_name
│       ├── index.js
│       └── root_application_name.js
├── index.js
└── services
```

### Usage

```
yo tsheets:component
```

## tsheets:container

### Description

Creates a container component (aka smart component) of the given name. Smart components are responsible for tying 
together multiple "dumb components".

This creates a directory structure like the following:

```
application_name
├── components
├── containers
│   ├── example_container_name
│   │   ├── example_container_name.js
│   │   ├── example_container_name.test.js
│   │   └── index.js
│   └── root_application_name
│       ├── index.js
│       └── root_application_name.js
├── index.js
└── services
```

### Usage

```
yo tsheets:container
```

## tsheets:duck

### Description

Creates a redux "[duck](https://github.com/erikras/ducks-modular-redux)" module of the given name. The directory
structure after creating a duck would look like the following:

```
application_name
├── components
├── containers
│   └── root_application_name
│       ├── index.js
│       └── root_application_name.js
├── index.js
├── redux
│   └── modules
│       └── example_duck_name
│           ├── example_duck_name.js
│           └── index.js
└── services

```

### Usage

```
yo tsheets:duck
```
