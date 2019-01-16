require 'byebug'
require 'dotenv/load'
require 'down'
require 'fileutils'
require 'json'
require 'parallel'
require 'ruby-progressbar'

@target_directory = ENV['FURNITURE_DATASET_DOWNLOAD_DIRECTORY']

def download_dataset(name)
  json = JSON.parse(File.read("#{@target_directory}/#{name}.json"))

  annotations = json['annotations']

  # Create on folder for each label
  json['annotations'].map{|a| a['label_id'].to_s }.uniq.each do |label|
    FileUtils.mkdir_p("#{@target_directory}/#{name}/#{label}")
  end

  id_label = {}
  json['annotations'].each do |a|
    id_label[a['image_id']] = a['label_id']
  end

  Parallel.each(json['images'], in_threads: 100, progress: "Downloading #{name} furniture images") do |ih|
    Down.download(ih['url'][0], destination: "#{@target_directory}/#{name}/#{id_label[ih['image_id']]}/#{ih['image_id']}.jpg")
  rescue StandardError
  end

end

download_dataset('validation')
download_dataset('test')
download_dataset('train')
