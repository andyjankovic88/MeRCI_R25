# MeRCI R25 :airplane:

## Overview
[MeRCI](http://merci.driveux.com) is a prototype web application that simulates the _searching_ and _booking_ of a commercial flight.

## Authentication
**merci@driveux.com** | _mercidemo_

## Architecture
- This app is developed with Ruby on Rails.
- NPM is used as the asset package manager.
- [Gulp](http://blog.arkency.com/2015/03/gulp-modern-approach-to-asset-pipeline-for-rails-developers/) is used to manage the asset pipeline. [Sprockets is still active](https://github.com/vigetlabs/gulp-rails-pipeline#configapplicationrb) however.
- [SLIM](http://slim-lang.com/), [Sass](http://sass-lang.com/), and [CoffeeScript](http://coffeescript.org/) are used as the HTML, CSS, and Javascript preprocessing languages.

## Style Guide
We aim to upload [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself) principles to coding, especially in how we are writing [Sass mixins](http://alistapart.com/article/dry-ing-out-your-sass-mixins). It is understood that in this app this is still a work-in-progress and that refactoring (_DRYing out_) will continue to take place. As this project is a prototype, code optimization is not a primary focus, however it is important that we simulate the best user experience. Therefore it is important that our code remain performant and clean.
