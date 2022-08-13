# miyagi for VS Code

Please refer to the [miyagi docs](https://www.miyagi.dev/) for setting up and configuring a project.

## Features

* [Create components](#create-components)
* [Lint components](#lint-components)
* [File links](#file-links)
* [Command palette](#command-palette)

## Create components

Create new components by right-clicking on any folder inside your components folder and selecting “New Component”.

<img src="images/create.webp" alt="VS Code explorer context menu with the “New Component” entry highlighted." width="400">

## Lint components

Lint components by right-clicking any component and selecting “Lint Component”.

<img src="images/lint.webp" alt="VS Code explorer context menu with the “Lint Component” entry highlighted." width="400">

## File links

### Schema and mock files

Linked [`$ref`](https://docs.miyagi.dev/how-to/writing-mock-data/#referencing-other-mock-files) and [`$tpl`](https://docs.miyagi.dev/how-to/writing-mock-data/#referencing-template-files) file references in mocks and schemas.

<img src="images/schema.webp" alt="JSON schema file opened in VS Code with a $ref link underlined and with instructions on how to follow the link." width="384">

### Template files

Linked template file references in [Twig templates](https://twig.symfony.com/).

<img src="images/twig.webp" alt="Twig template file opened in VS Code with an include whose path is underlined and with instructions on how to follow the link." width="502">

## Command palette

These global commands are accessible in the command palette:

| Command             | Description                                         |
|---------------------|-----------------------------------------------------|
| New Component       | Create a new component by manually entering a path. |
| Lint All Components | Lint the entire miyagi project.                     |
| Reload              | Manually trigger a miyagi config reload.            |

**Note:** The extension automatically reloads when the miyagi config changes. Only use the “Reload” command if the extension stops working.

<img src="images/commands.webp" alt="VS Code window with an open command palette filtered to all available miyagi commands." width="946">

## Sponsors

<a href="https://factorial.io/">
  <img src="https://logo.factorial.io/color.png" width="40" height="56" alt="Factorial">
</a>
