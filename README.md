# NiFidelity

> Validate and document your Apache NiFi data flows

## Table of Contents

* [Caveats](#caveats)
* [Background](#background)
* [Overview](#overview)
* [Usage](#usage)
* [Contributing](#contributing)
* [Credits](#credits)
* [License](#license)

## Caveats

I'm both a NiFi and an ETL n00b. This tool is early alpha, though I'll be soon pressing it into production usage while I refine my understanding of the problem domain.

Also, take care when googling "nifidelity," especially from work computers, as autocorrect tends to transform it to "infidelity." Depending on where you work or what you click, either hilarious hijinks or embarrassing HR meetings could ensue. You have been warned.

## Background

We're working on introducing NiFi into a data platform, and anticipate the following problems:

* People constructing the data flows will focus more on making their flows work, and less on documenting why or how something works.
* People operating, supporting, or developing the data flows will struggle to understand the system as a whole.
* Documentation tends to neglect and disarray, leading to inaccuracy and abandonment.

To address these problems, we built NiFidelity: a tool to ensure NiFi flows stay true to specific rules and documentation stays faithful to the actual flows.

## Overview

NiFidelity does two things:

1. Validates NiFi buckets and flows using rules you specify.
1. Generates markdown documentation for the buckets, flows, and validation errors it encounters.

We designed NiFidelity for the following scenario:

* You use [Apache NiFi](https://nifi.apache.org/) [Ridiculous Disclaimers](https://worldwideinterweb.com/funniest-disclaimers-ever/).
* You use [NiFi Registry](https://nifi.apache.org/registry.html).
* You use [Git to back your NiFi Registry](https://community.cloudera.com/t5/Community-Articles/Storing-Apache-NiFi-Versioned-Flows-in-a-Git-Repository/ta-p/248713).
* You use [CICD](https://medium.com/@nirespire/what-is-cicd-concepts-in-continuous-integration-and-deployment-4fe3f6625007).
* You use a [static site generator](https://jamstack.org/generators/) that supports [Markdown](https://daringfireball.net/projects/markdown/) to publish documentation.
* Your static site generator supports [mermaid](https://mermaid-js.github.io/mermaid/#/) in its native text.

## Usage

Running `nifidelity --help` displays help text:

```console
$ nifidelity --help
Usage: nifidelity [options]

Options:
  -V, --version                  output the version number
  -i, --input <directory>        input directory (default: ".")
  -o, --output <directory>       output directory (default: ".")
  -m, --mermaid <template_file>  file containing mermaid template for flow
                                 diagrams (use CONTENTS in template for content
                                 placement)
  -r, --rules <rules_file>       rules file in validatorjs format
  -O, --overwrite                overwrite files in the output directory
                                 (default: false)
  -h, --help                     display help for command


Example rules file:
{
  "bucket": {
    "bucketId": "required|alpha_dash",
    "path": "required|string"
  },
  "flow": {
    "name": "required|string|min:4",
    "description": "required|string|min:6",
    "comments": "required|string|min:6",
    "content.flowSnapshot.flowContents.comments":
      "required|string|min:6",
  },
}

Example mermaid template file:
import Mermaid from '@theme/Mermaid';

<Mermaid chart={`CONTENTS`}/>
```

You would typically run NiFidelity as part of the CICD for your static site generator or for your NiFi Registry repository.

### Input Directory

The input directory option (`-i, --input`) should be the directory of your Git repository that houses your NiFi registry. It's the directory you've set up in your NiFi Registry's `conf/providers.xml` file. For example, if my `conf/providers.xml` file contained this:

```xml
<flowPersistenceProvider>
    <class>org.apache.nifi.registry.provider.flow.git.GitFlowPersistenceProvider</class>
    <property name="Flow Storage Directory">/var/opt/nifi-registry-0.8.0/my-nifi-registry</property>
    <property name="Remote To Push">origin</property>
    <property name="Remote Access User">hoop33</property>
    <property name="Remote Access Password">abc123</property>
    <property name="Remote Clone Repository"></property>
</flowPersistenceProvider>
```

I would pass `/var/opt/nifi-registry-0.8.0/my-nifi-registry` as the input directory.

It defaults to the current working directory.

### Output Directory

NiFidelity checks that the output directory you specify is empty before proceeding, saving you from accidentally overwriting any files. You can override this behavior using the `-O, --overwrite` parameter.

This is the directory in which NiFidelity will place all its output. Specifically, after a successful run, you'll see the following files:

* `registry.md` &mdash; a link to the Errors page, a list of the buckets, and the flows in each bucket.
* `errors.md` &mdash; a list of all the validation errors NiFidelity encounters.
* `<flow id>.md` &mdash; documentation for the flow with that ID.

### Validation Rules

NiFidelity uses [validatorjs](https://github.com/mikeerickson/validatorjs) to validate your buckets and flows. If you peek inside a bucket directory inside your NiFi Registry repository directory, you'll see files like this:

* `bucket.yml`
* `My_Flow_1.snapshot`
* `My_Flow_2.snapshot`
* `My_Flow_3.snapshot`

The `bucket.yml` file is in [YAML format](https://yaml.org/) and contains some information about each flow. The various `.snapshot` files are in [JSON format](https://www.json.org/json-en.html) and contain the bulk of the information about each flow.

NiFidelity reads the `bucket.yml` file and turns it to JSON, so that the layout becomes something like this:

```json
{
  "path": "<the full path to this bucket directory>",
  "name": "<the name of this pucket (the last directory in path)",
  "...": "<the rest of bucket.yml>"
}
```

For the flow information, NiFidelity combines some information from `bucket.yml` with the contents from the corresponding `.snapshot` file. It looks like this:

```json
{
  "id": "<the key of the flow from bucket.yml>",
  "name": "<flowName from bucket.yml>",
  "description": "<flowDesc from bucket.yml>",
  "comments": "<comments from bucket.yml>",
  "version": "<ver from bucket.yml>",
  "content": "<the content of the snapshot file specified in the file field of bucket.yml>"
}
```

To validate your NiFi flows, create a JSON file that follows the validatorjs documentation for validation. Separate your bucket validation rules and flow validation rules thus:

```json
{
  "bucket": {
    ...
  },
  "flow": {
    ...
  }
}
```

Pass the path to this file using the `-r, --rules` parameter.

NiFidelity will write all encountered errors to the `errors.md` file. It will also write specific errors for a bucket or flow to the respective page.

NiFidelity will exit with a non-zero code if it encounters any validation errors. Otherwise, it will exit with a zero code.

### Mermaid

NiFidelity will create a diagram of a flow on its corresponding page if you specify a template using the `-m, --mermaid` parameter. If you omit that parameter, no diagram will be generated. NiFidelity will insert the mermaid code into your template where you have the word `CONTENTS` The template you pass will depend on your static site generator's capabilities. Here's an example file:

```
import Mermaid from '@theme/Mermaid';

<Mermaid chart={`CONTENTS`}/>
```

Create this file and pass its path as the `-m, --mermaid` parameter to NiFidelity.

## Contributing

Please note that this project is released with a [Contributor Code of Conduct](http://contributor-covenant.org/). By participating in this project you agree to abide by its terms. See [code_of_conduct](code_of_conduct.md).

Contributions are welcome! Please open pull requests with code that passes all the checks. See *Building* for more information.

### Building

NiFidelity uses [Yarn](https://yarnpkg.com/) for package management. To build NiFidelity:

* Clone the repository.
* Run `yarn install`.
* Run `yarn test` to make sure all tests pass.

## Credits

NiFidelity uses the following open source libraries &mdash; thank you!

* [Commander.js](https://tj.github.io/commander.js/)
* [JS-YAML](https://github.com/nodeca/js-yaml)
* [Nano ID](https://zelark.github.io/nano-id-cc/)
* [validatorjs](https://github.com/mikeerickson/validatorjs)
* [Jest](https://jestjs.io/)
* [mock-fs](https://github.com/tschaub/mock-fs)

Apologies if I've inadvertently omitted any library.

## License

Copyright &copy; 2021 Rob Warner

Licensed under the [MIT License](https://hoop33.mit-license.org/)
