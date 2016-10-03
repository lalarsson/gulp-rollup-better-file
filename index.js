var stream = through.obj((file, enc, cb) => {
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME,
                'Streams are not supported!'));
            return cb();
        } else if (file.isBuffer()) {
            rollup.rollup({
                    entry: file.path,
                    plugins: rollupPlugins()
                })
                .then((bundle) => {
                    const bundled = bundle.generate({
                        format: 'iife'
                    });
                    file.contents = new Buffer(bundled.code)
                    this.push(file);
                    cb();
                });
        } else {
            this.push(file);
            cb();
        }
    });

    return stream;
