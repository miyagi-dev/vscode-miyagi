## [0.6.2](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.6.1...v0.6.2) (2022-09-01)


### Bug Fixes

* **document-links:** Link `$tpl` in mocks to template file ([#34](https://github.com/miyagi-dev/vscode-miyagi/issues/34)) ([58d4ed2](https://github.com/miyagi-dev/vscode-miyagi/commit/58d4ed2e5db87d1096ec60f1e2bcbe4186ee0dbe))



## [0.6.1](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.6.0...v0.6.1) (2022-08-28)


### Bug Fixes

* Scope schemas to project (Close [#31](https://github.com/miyagi-dev/vscode-miyagi/issues/31)) ([5f01dbe](https://github.com/miyagi-dev/vscode-miyagi/commit/5f01dbe35b250f79bfc0e899e7b7123108d03d03))



# [0.6.0](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.5.1...v0.6.0) (2022-08-26)


### Bug Fixes

* **document-links:** Resolve schema links on click ([4b5fa78](https://github.com/miyagi-dev/vscode-miyagi/commit/4b5fa7854cf4fdc037b999a47a2fec519f5ef1b9))
* Improve Twig link regex ([55a2668](https://github.com/miyagi-dev/vscode-miyagi/commit/55a2668457b91d5e95a3d56a024983e35c6ea39a))
* Reference schemas by ID instead of filename ([af056d8](https://github.com/miyagi-dev/vscode-miyagi/commit/af056d878d15dea03c971a77726f9ac4310436c4))


### Features

* Add schema properties completion to templates ([e44ab39](https://github.com/miyagi-dev/vscode-miyagi/commit/e44ab39b218ce890c559850b452398dd3eaf5aa6))



## [0.5.1](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.5.0...v0.5.1) (2022-08-13)


### Bug Fixes

* Don't restrict Twig links to `.twig` files ([217943f](https://github.com/miyagi-dev/vscode-miyagi/commit/217943f4296e82c8a94f166b9d3b0779e2bfea5a))



# [0.5.0](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.4.3...v0.5.0) (2022-08-13)


### Features

* Extend feature documentation ([239c3ca](https://github.com/miyagi-dev/vscode-miyagi/commit/239c3ca7deee35e5e981a7d9a1f98069a54a651e))
* Linked template files in Twig templates ([23b49e5](https://github.com/miyagi-dev/vscode-miyagi/commit/23b49e58d9f4db1c18e556b93c06aaeed4986b47))



## [0.4.3](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.4.2...v0.4.3) (2022-08-08)



## [0.4.2](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.4.1...v0.4.2) (2022-08-08)


### Bug Fixes

* **lint:** Valid component path detection ([f372e52](https://github.com/miyagi-dev/vscode-miyagi/commit/f372e526e12d8f50de024f69bdfb840eda06267f))



## [0.4.1](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.4.0...v0.4.1) (2022-08-02)


### Bug Fixes

* Enable document links for all file schemes (Close [#15](https://github.com/miyagi-dev/vscode-miyagi/issues/15)) ([906915a](https://github.com/miyagi-dev/vscode-miyagi/commit/906915a560208327dff45d079abebaccd6ef3c6f))
* Warn when trying to create/lint component outside of components folder (Close [#4](https://github.com/miyagi-dev/vscode-miyagi/issues/4)) ([ecf1127](https://github.com/miyagi-dev/vscode-miyagi/commit/ecf1127b3ec8b05297892fedfbdc3beeb8cf7290))



# [0.4.0](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.3.0...v0.4.0) (2022-08-02)


### Bug Fixes

* Add more verbose error logging (Close [#10](https://github.com/miyagi-dev/vscode-miyagi/issues/10)) ([3c8222e](https://github.com/miyagi-dev/vscode-miyagi/commit/3c8222e2a90b3ef975ee3c8523050ff562adfa88))
* Cache clearing on miyagi config change ([669856e](https://github.com/miyagi-dev/vscode-miyagi/commit/669856efb8b5018c5266931410e8c0f8b079e35d))


### Features

* Add reload command ([68b4e97](https://github.com/miyagi-dev/vscode-miyagi/commit/68b4e976a4cfb7d258f99098a657d4606381c054))



# [0.3.0](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.2.1...v0.3.0) (2022-07-21)


### Bug Fixes

* Better command naming and context menu placement ([a17566f](https://github.com/miyagi-dev/vscode-miyagi/commit/a17566f63e0675a2d4db1833e14be6b099042c52))


### Features

* Linked $ref and $tpl in schemas/mocks (Close [#5](https://github.com/miyagi-dev/vscode-miyagi/issues/5)) ([a66daa0](https://github.com/miyagi-dev/vscode-miyagi/commit/a66daa0d5e48e8ff178dad1aab8ab55ef16f785d))



## [0.2.1](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.2.0...v0.2.1) (2022-07-18)


### Bug Fixes

* **new-component:** Remove `<componentPath>` placeholder from name input box ([1e0e974](https://github.com/miyagi-dev/vscode-miyagi/commit/1e0e974edadef59f1bfebb6fb1bd1b86420d008e))



# [0.2.0](https://github.com/miyagi-dev/vscode-miyagi/compare/v0.1.1...v0.2.0) (2022-07-17)


### Features

* Handle multiple miyagi projects (Close [#1](https://github.com/miyagi-dev/vscode-miyagi/issues/1)) ([6b52353](https://github.com/miyagi-dev/vscode-miyagi/commit/6b523537a7d25f4b2fab52e79084502d2cf6e0c8))



## [0.1.1](https://github.com/miyagi-dev/vscode-miyagi/compare/7198ee631bbf4c99bfcbb2306b9361bd6c0ee357...v0.1.1) (2022-07-14)


### Features

* Setup ([7198ee6](https://github.com/miyagi-dev/vscode-miyagi/commit/7198ee631bbf4c99bfcbb2306b9361bd6c0ee357))



