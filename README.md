# miyagi for VS Code

Please refer to the [miyagi docs](https://www.miyagi.dev/) for setting up and configuring a project.

## Features

* [Create components](#create-components)
* [Lint components](#lint-components)
* [File links](#file-links)
  * [Schema and mock links](#schema-and-mock-links)
  * [Template links](#template-links)
* [Code completion](#code-completion)
  * [Template completion](#template-completion)
* [Command palette](#command-palette)

## Create components

Create new components by right-clicking on any folder inside your components folder and selecting “New Component”.

<img src="images/command-new-component.webp" alt="VS Code explorer context menu with the “New Component” entry highlighted." width="400">

## Lint components

Lint components by right-clicking any component and selecting “Lint Component”.

<img src="images/command-lint-component.webp" alt="VS Code explorer context menu with the “Lint Component” entry highlighted." width="400">

## File links

### Schema and mock links

Linked [`$ref`](https://docs.miyagi.dev/how-to/writing-mock-data/#referencing-other-mock-files) and [`$tpl`](https://docs.miyagi.dev/how-to/writing-mock-data/#referencing-template-files) file references in mocks and schemas.

<img src="images/document-links-schema.webp" alt="JSON schema file opened in VS Code with a $ref link underlined and with instructions on how to follow the link." width="384">

### Template links

<small>(Twig-only)</small>

Linked template file references in [Twig templates](https://twig.symfony.com/).

<img src="images/document-links-twig.webp" alt="Twig template file opened in VS Code with an include whose path is underlined and with instructions on how to follow the link." width="502">

## Code completion

### Template completion

<small>(Twig-only)</small>

Properties from schemas are provided as autocomplete items for [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense).

The trigger characters `|` (all types) and `.` (only object and array types) can be used to confirm an item and automatically insert the trigger character. The `|` is used to chain [Twig filters](https://twig.symfony.com/doc/3.x/templates.html#filters). The `.` is used to access [Twig object keys or array indexes](https://twig.symfony.com/doc/3.x/templates.html#variables).

<img src="images/completion-template.webp" alt="Twig template file opened in VS Code showing autocomplete items created from an accompanying schema file." width="761">

## Command palette

These global commands are accessible in the command palette:

| Command             | Description                                         |
|---------------------|-----------------------------------------------------|
| New Component       | Create a new component by manually entering a path. |
| Lint All Components | Lint the entire miyagi project.                     |
| Reload              | Manually trigger a miyagi config reload.            |

**Note:** The extension automatically reloads when the miyagi config changes. Only use the “Reload” command if the extension stops working.

<img src="images/command-palette.webp" alt="VS Code window with an open command palette filtered to all available miyagi commands." width="946">

## Sponsors

<a href="https://factorial.io/">
  <img src="https://logo.factorial.io/color.png" width="40" height="56" alt="Factorial">
</a>
