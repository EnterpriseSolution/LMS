const path = require('path')
var webpack = require("webpack");
var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
    entry: {
        VesselOrder: './src/app.js',
        MasterData: './src/masterdataApp.js',
        TruckLoading: './src/TruckLoadingApp.js',
        TruckUnLoading: './src/TruckUnLoadingApp.js',
        VesselLoading: './src/VesselLoadingApp.js',
        VesselDischarge: './src/VesselDischargeApp.js'
    },
  output: {
      filename: 'src/components/[name].js', 
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: "var",
      library:"[name]"
  },
  externals: {
      jquery: 'jQuery'
  }
  
}




