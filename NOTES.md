
## features
- responsive containers with responsive canvas
- rotating, scalable viewports
- multiple viewports
- decoupled update (model) and render (view) cycles
- fast functional maths, geometry
- no singletons (animation frame, containers, viewports, worlds, model trees, views and lazers, renderer)
- es modules in nodejs


## todo

- core optimisations
  - use for instead of ...
- view manager loose ends
  - view filtering/sleeping
  - cache sorting, re-sort on events
  - order+cache by layer zIndex
  - view destroy
- structured TODOs
- readmes
  - picabia readme
  - boilerplate readme
- features
  - touch input
  - svg
  - html view
- libraries
  - map region (model)
  - collision manager platformer
  - collision manager shapes
  - collision manager with physics
- single responsibility demos
  - container scalable
  - container multitple
  - container resize + viewport scale
  - viewport pos/rotation
  - viewport multiple
  - 2d api
  - sprite
  - tile-maps
  - cameras
- tutorials
  - player movement with camera following
  - splitting stage and hud
  - collisions
- annoying `View.prototype._constructor()` should maybe be called `._mount()`, `._start()` or `_init()`

## challenges
- building for browser <script>
- performance
- garbage collection
- gpu acceleration
- webgl texture uploading
- 3d
- wrapping for mobile
- integrating mobile input
- integrating browser media (mic/camera)
- view filtering/sleeping in run-time
- immutable state and replayability

## questions

- use typescript
- not using OO at all


## performance (verified)

- [loop vs forEach](https://jsperf.com/foreach-vs-loop/77)
- [for ++ vs while --](https://jsperf.com/for-vs-while-array) because [cache](https://gamealchemist.wordpress.com/2013/05/01/lets-get-those-javascript-arrays-to-work-fast/)
- [drawImage vs putImageData](https://jsperf.com/canvas-drawimage-vs-putimagedata/3) because copy to main memory
- [drawImage defaults vs all args set](https://jsperf.com/canvas-draw-defaults-vs-all-params/1)
  - defaults vs no args tested @64x64 and @1024x1024
  - chrome irrelevant: always ~140K
  - firefox args matter: ~35K vs ~90K @64K (better with args) but ~13K vs 9K @1024 (worse with args)
  - safari lol: args irrelevant ~23K @64 / only ~3K vs ~8K @1024
- [calling noop vs checking first](https://jsperf.com/oo-noop-vs-check)
- [cost of array indexOf](https://jsperf.com/cost-of-index-lookup)
  - increases dramatically with actual index of looked up element

## performance (irrelevant)

- [drawImage vs drawImage with scaling](https://jsperf.com/canvas-draw-image-vs-draw-image-scaled/1)

## performance ideas

- arrays - https://gamealchemist.wordpress.com/2013/05/01/lets-get-those-javascript-arrays-to-work-fast/


## develpoment notes

### (sym)linking picabia libraries in demos/games/apps

1) `git clone git@github.com:picabia/picabia.git`
2) create global symlink
- in the dir do `npm link`
- this creates a symlink on /usr/local/lib/node_modules/... a.k.a a global node module
3) in the directory of the game/demo/application
- after `npm install`
- run `npm link @picabia/picabia`
- this creates a local link to the global one

## reading

- [Stop Drawing Dead Fish - Brad Victor](https://vimeo.com/64895205)
- [A* Path Finder](https://www.redblobgames.com/pathfinding/a-star/introduction.html)
- [A* Grids](https://www.redblobgames.com/pathfinding/tower-defense/)
