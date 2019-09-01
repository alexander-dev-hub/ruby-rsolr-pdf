require 'sinatra'
require 'open-uri'
require "sinatra/reloader"
require 'uri'

$api_base = "http://#{settings.bind}:#{settings.port}/api"

get '/search' do

    @subtitle = "Search api result"

    @search_query = ""

    @num=0
    @docs=[]

    erb :search

end

post '/search' do

    @subtitle = "Search api result"

    @search_query = params[:query]

    response = open($api_base+'/search?q=' +@search_query)
	  obj = JSON.load(response.read)
    
    @num=obj["num"]
    @status=obj["msg"]
    @docs = obj["docs"]

    @docs.collect { |doc|  doc['url'].gsub!("#{settings.filesdir}", "#{settings.homedir}")}

    erb :search

end

get '/pdfview' do
    @page = params[:page]
    @url=  params[:url]
    @q=params[:q]

    erb :pdfview
end
