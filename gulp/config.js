var publicAssets = "./public/assets";
var sourceFiles  = "./gulp/assets";

module.exports = {
  publicAssets: publicAssets,
  browserSync: {
    proxy: 'localhost:3000',
    files: ['./app/views/**']
  },
  sass: {
    src: sourceFiles + "/stylesheets/**/*.{sass,scss}",
    dest: publicAssets + "/stylesheets",
    settings: {
      indentedSyntax: true, // Enable .sass syntax!
      imagePath: '/assets/images' // Used by the image-url helper
    }
  },
  images: {
    src: sourceFiles + "/images/**",
    dest: publicAssets + "/images",
    options: {
      optimizationLevel: 3, // png optimization level between 0 and 7 (Default: 3)
      progressive: true,    // Lossless conversion to progressive (Default: false)
      interlaced: false,    // Interlace gif for progressive rendering (Default: false)
      multipass: false,     // Optimize svg multiple times until it's fully optimized (Default: false)
      svgoPlugins: [{removeViewBox: false}, {removeEmptyAttrs: false}]
    }
  },
  iconFont: {
    name: 'Gulp Rails Icons',
    src: sourceFiles + "/icons/*.svg",
    dest: publicAssets + '/fonts',
    sassDest: sourceFiles + '/stylesheets/base',
    template: './gulp/tasks/iconFont/template.sass',
    sassOutputName: '_iconFont.sass',
    fontPath: '/assets/fonts',
    className: 'icon',
    options: {
      fontName: 'gulp-rails-icons',
      appendCodepoints: true,
      normalize: false
    }
  },
  browserify: {
    bundleConfigs: [{
      entries: sourceFiles + '/javascripts/global.coffee',
      dest: publicAssets + '/javascripts',
      outputName: 'global.js',
      extensions: ['.js','.coffee']
    }]
  },
  js: {
    watchFiles: sourceFiles + "/javascripts/**/*.{coffee,js}",
    sourcePath: './gulp/assets/javascripts/',
    tempPath: './gulp/assets/tmp/',
    distPath: './public/assets/javascripts/'
  },
  vendor: {
    vendorRoot: './gulp/assets/vendor/',
    stylesVendorRoot: './gulp/assets/stylesheets/vendor/'
  }
};
