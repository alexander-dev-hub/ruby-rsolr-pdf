require 'sinatra'
require 'json'
require 'sinatra/reloader' if development?
require 'rsolr'
#require 'rsolr/json'

require_relative 'utils'
require_relative 'config'
require_relative 'useapi'

#rsolr
solr = RSolr.connect :url => settings.solrbase+settings.solrcore, update_format: :json

# /api/search api
# desc:
#   search using rsolr
# method: get
# param:
#   q:search text
#   start: start offset, default 0
#
#   pretty: json format? default: false
# result json:
#   status: ok
#   num: searched count
#   docs: searched docs json
# fail raise:
#   status: solr error
get '/api/search' do

  q = params[:q]

  start = params[:start] ? params[:start] : '0'

  prety = params[:prety] ? params[:prety] : false

  response = solr.get 'select', :params => {:q => q}

  num=response["response"]["numFound"]

  response = solr.get 'select', :params => {:q => q, :wt => :json, :start => start, :rows => num, :sort => 'score desc, sorting desc'}

  docs = response["response"]["docs"]

  if (prety)
    docs= JSON.pretty_generate docs
  end

  ret={:status=>"0",  :msg=>"search count #{num}", :num=>num,  :docs=>docs}

  return ret.to_json

end

# /api/upload api
# method: post
# desc:
#   upload single file
# param
#   file: file
# result json:
#   status: ok
#   docs: filename
## fail raise
#   status: file not pdf
post '/api/upload' do

  if params[:file]
    filename = params[:file][:filename]
    # check pdf file
    if  filename =~ /.*\.pdf/
      ispdf  = true
    else
      ispdf = false
    end


    if !ispdf
     raise  ( "file not pdf: #{filename}")
    end

    tempfile = params[:file][:tempfile]
    target = File.join(ettings.homedir, filename)
    localpath = File.join(settings.filesdir, filename)

    File.open(localpath, 'wb') {|f| f.write tempfile.read}

    {:status  =>"0", :msg=>"update_success", :num=>'1',  :docs =>[{:fileurl=> target}]}.to_json
  end

end
# /api/uploads api
# method: post
# desc:
#   upload multiple file
# param
#   files:  array of files
# result json:
#   status: ok
#   docs: filename
## fail raise
#   status: file not pdf
post '/api/uploads' do
  #puts params
  if params[:files]==nil 
    raise( "files empty")
  end
  fns = params[:files].map {|f| f[:filename]}.join(";")
  param = fns.chomp.split(";")
  #find pdf files
  param.select! {|f| f =~ /.*\.pdf/}

  array_length = param.length # or $param.size

  puts "length of $param is : #{array_length}"

  if(array_length==0)
    raise( "files not pdf: #{fns}")
  end
  i = 0
  resp = []
  while i < array_length do
    puts i
    filename = params[:files][i][:filename]
    tmpfile = params[:files][i][:tempfile]
    target = File.join(settings.homedir,filename)
    localpath = File.join(settings.filesdir, filename)

    puts localpath
    File.open(localpath, 'wb') do |f|
      f.write tmpfile.read
    end

    resp << {:fileurl => target}
    i = i + 1
  end
  num=i
  ret=  {:status  =>"0", :msg=> "update_success", :num=>num,  :docs=>resp}
  return ret.to_json
end


# /api/delete get api
# desc:
#   delete file  and solr index
# param:
#   resource_name: file name
# result json:
#   status:0, msg: ok, docs:files array
## fail raise
#   status: file not exist or solr error
get '/api/delete' do

  resource_name = params["resource_name"]
   response = solr.delete_by_query "resource_name:\"#{resource_name}\""

  solr.commit :commit_attributes => {}
  solr.optimize :optimize_attributes => {}

  localpath = File.join(settings.filesdir, resource_name)
  if File.exist?(localpath)
    File.delete(localpath)
  else
    raise("Index deleted but File not exist: #{localpath}")
  end
  return {:status =>"0",:msg=> "delete_success", :num=>1, :docs =>[{:fileurl=> localpath}]}.to_json

end

# /api/deleteAll get api
# desc:
#   delete all solr index
# param:
#   none
# result json:
#   status: ok
## fail raise
#   status: solr error
get '/api/deleteAll' do

  response = solr.delete_by_query "*:*"
  delcount=0
  solr.commit :commit_attributes => {}
  solr.optimize :optimize_attributes => {}
  return {:status =>"0", :msg=> "delete_all_success!",:num=>delcount, :docs=>[]}.to_json

end

# /api/checksolr api
# desc:
#   check alive of solr server
# method: get
# param:
#   none
# result json:
#   status: ok
#
# fail raise
#   status: solr error

get '/api/checksolr' do

  response = solr.get 'admin/ping', :params => {}

  msg = response["status"].to_s #"OK"

  if msg=="OK"

  return   {:status =>"0",:msg=> "Solr is alive! #{settings.solrbase+settings.solrcore}", :num=>0,:docs=>[]}.to_json

  else
    return   {:status => "2", :msg=>msg,:num=>0,  :docs=>[] }.to_json
  end

end