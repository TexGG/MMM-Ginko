# MMM-Ginko
Public Transport of Besançon/France Module for MagicMirror<sup>2</sup>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/TexGG/MMM-Ginko/raw/master/LICENSE)
[![Dependencies Status](https://david-dm.org/TexGG/MMM-Ginko/status.svg)](https://david-dm.org/TexGG/MMM-Ginko)
[![Build Status](https://travis-ci.org/TexGG/MMM-Ginko.svg?branch=master)](https://travis-ci.org/TexGG/MMM-Ginko)
[![Known Vulnerabilities](https://snyk.io/test/github/texgg/mmm-ginko/badge.svg)](https://snyk.io/test/github/texgg/mmm-ginko)


## Example

![](.github/example.jpg) ![](.github/example2.jpg)

## Dependencies
  * An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
  * npm
  * [request](https://www.npmjs.com/package/request)

## Installation
 1. Clone this repo into `~/MagicMirror/modules` directory.
 2. Configure your `~/MagicMirror/config/config.js`:

    ```
    {
        module: "MMM-Ginko",
        position: "top_right",
        config: {
            stations: ["Gare Viotte","Pont Chemin Français","Pont Chemin Français","Pont Chemin Français","Pont Chemin Français"],
            lines: ["102","23","24","23","24"],
            directions: ["0","0","0","1","1"]
        }
    }
    ```
 3. Run command `npm install` in `~/MagicMirror/modules/MMM-Ginko` directory.

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `stations` | REQUIRED | Insert here the stations names you want to display data from [How to find a name ?](https://api.ginko.voyage/DR/getArrets.do). |
| `lines` | REQUIRED | Insert here the lines ids you want to display data from [How to find a line ID ?](https://api.ginko.voyage/DR/getLignes.do). |
| `directions` | REQUIRED | Insert here lines direction (back = 0, forth = 1). |
| `max` | `5` | How many departures per route should be displayed. |
| `shortenStation` | `false` | After how many characters the station name should be cut. Default: show full name. |
| `shortenDestination` | `false` | After how many characters the destination name should be cut. Default: show full name. |
| `rotateInterval` | `20` (20 sec) | How fast should be switched between the stations in second. |
| `updateInterval` | `300` (5 mins) | How often should the data be fetched in second. |
| `showColored` | `true` | Should the display show lines colors ? |