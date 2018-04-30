
## features
- responsive containers with responsive canvas
- rotating, scalable viewports
- multiple viewports
- decoupled update (model) and render (view) cycles
- fast functional maths, geometry
- no singletons (animation frame, containers, viewports, worlds, model trees, views and lazers, renderer)
- es modules in nodejs


## todo

- structured TODOs
- readmes
  - picabia readme
  - boilerplate readme
- features
  - [sprites](https://github.com/picabia/picabia/issues/1)
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
- view filtering/sleeping in run-time
- immutable state and replayability

## questions

- use typescript
- not using OO at all


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
