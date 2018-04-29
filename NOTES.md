## challenges
- responsive containers with resposnive canvas (solved)
- rotating, scalable viewports (solved)
- multiple viewports (solved)
- decoupled update (model) and render (view) cycles (solved)
- fast functional maths, geometry (solved)
- es modules in nodejs (solved)

- view filtering in run-time
- mixing 2d 3d sv/sleeping html containers
- no singletons (animation frame, containers, viewports, worlds, model trees, views and lazers, renderer)
- building for browser


## big questions

- to typescript or not to typescript
- to OO or not at all
- immutable state and replayability


## develpoment


### (sym)linking picabia libraries in demos/games/apps

1) `git clone git@github.com:picabia/picabia.git`
2) create global symlink
- in the dir do `npm link`
- this creates a symlink on /usr/local/lib/node_modules/... a.k.a a global node module
3) in the directory of the game/demo/application
- after `npm install`
- run `npm link @picabia/picabia`
- this creates a local link to the global one


## demos

- multiple containers
