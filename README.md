[TRANSLATE]: https://weblate.macarena.ceo/engage/werewolf

# Werewolf

[![Test status](https://github.com/PssbleTrngle/Werewolf/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/PssbleTrngle/Werewolf/actions/workflows/test.yml)
[![Translation status](https://weblate.macarena.ceo/widget/werewolf/common/svg-badge.svg)][TRANSLATE]
[![Coverage](https://sonar.somethingcatchy.net/api/project_badges/measure?project=werewolf&metric=coverage&token=sqb_385be0ef3dd33d42a86ed5a323201f315e1ce70d)](https://sonar.somethingcatchy.net/dashboard?id=werewolf)

---

This is a monorepo containing packages for the models & logic of the werewolf game, as well as the translations and resuable components for a web frontend.
Currently the only application using these is a simple react web frontend which runs the games logic locally in the browser. There are plans to reuse this logic for...

- an online variant which runs the game on a server which multiple players can join
- a discord bot running games in the chat
- a react-native app similar to the current standalone frontend

Multiple packages, like the `logic` or `models` package are also planned to be published on an npm registry for them to be usable by anyone.

## Setup

To develop locally, run `pnpm install` once in the project-root directory, which will install all the required dependencies for all sub-projects.
There are multiple top-level npm scripts, but for now running the `pnpm run dev` command in a specific app directory works too.
Setup for the specific apps may also be defined in their respective README.

## Contribution

Since this project is in it's early phases, a lot of conceptual work is yet to be done and contributing to the source code may not be reasonable yet in most cases.

## Translating

There is a [Weblate Project][TRANSLATE] which handles translations for the files found under `packages/locale/` and contributing here is much appreciated.
