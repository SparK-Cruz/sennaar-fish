## Running

### Cloning

If you didn't clone this repository yet you may do so adding the `--recurse-submodules` flag for your convenience:
```bash
git clone --recurse-submodules <url>
```

If you already cloned it **without** the above mentioned flag then run:
```bash
git submodule init
```

### Updating dependencies

```bash
git submodule update --recursive --remote
npm install
```

### Starting server

```bash
npm start
```

**Congratulations!**

You're all set.

Now browse to [localhost:8081](http://localhost:8081/)!
