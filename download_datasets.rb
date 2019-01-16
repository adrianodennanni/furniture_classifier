require 'byebug'
require 'json'
require 'down'
require 'parallel'
require 'ruby-progressbar'
require 'dotenv/load'

target_directory = ENV['FURNITURE_DATASET_DOWNLOAD_DIRECTORY']

# TODO: Downloads the images
