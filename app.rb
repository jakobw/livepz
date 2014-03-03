require 'sinatra'
require 'nokogiri'
require 'open-uri'
require 'json'

get '/' do
  'hi.'
end

get '/livepz/:id' do |id|
  data = get_history id

  if data[:history].empty? || data[:name].nil?
    'not found :('
  else
    erb :livepz, locals: {
      name: data[:name].content,
      history: data[:history],
      start: data[:start]
    }
  end
end

def get_history(id)
  doc = Nokogiri::HTML(open("http://bettv.tischtennislive.de/default.aspx?L1=Public&L2=Kontakt&L2P=60261&MID=#{id}&Page1=Bilanz&SA=96&Page=EntwicklungTTR"))
  history = []
  start = nil

  1.upto(100) do |i| # 100 is the maximum number of matches displayed
    match = doc.css("#Match#{i}, #Match#{i}_0")
    break if match.empty?

    match_data = match.children.map(&:content)
    history << [match_data[-2].to_i, match_data[-4]]
    start = match_data
  end

  return {
    history: history.reverse,
    name: doc.css('.ui-widget-header.PageHeadline nobr').first,
    start: start && start[-3].to_i
  }
end
