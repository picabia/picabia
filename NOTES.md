
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
  - view pre-render
  - view destroy
- structured TODOs
- readmes
  - picabia readme
  - boilerplate readme
- features
  - sprites [GH-1](https://github.com/picabia/picabia/issues/1)
  - sprite animation (from character model to animated sprite)
  - off canvas texture renderer (map region model > off screen rendering > layer rendering)
  - collision manager
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


## performance (checked)

- loop vs forEach https://jsperf.com/foreach-vs-loop/77
- for ++ vs while -- https://jsperf.com/for-vs-while-array (because https://gamealchemist.wordpress.com/2013/05/01/lets-get-those-javascript-arrays-to-work-fast/)

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
