require 'sinatra'

#
# Error Status and Message
# 0 => Operation Success
# 1=> File R/W Fail
# 2=> Solr Sever Fail
# 9=> Other Error
#
#
# root
# demo html
get '/'  do

	redirect to '/index.html'

end


# Pdf view
# send pdf file

get '/*.pdf' do
	content_type :pdf

	file_path = File.join(settings.filedir, request.path.downcase)
	File.exist?(file_path) ? send_file(file_path) : halt

end
# Error Handle
# return
# status:error code, msg: error msg
error do
  #general error
	status, errormsg= "9", env['sinatra.error'].message
  #solr server error
	 status, errormsg = "2",  "Solr Error. Can't Access <a href='#{settings.solrbase+settings.solrcore}''>#{settings.solrbase+settings.solrcore}</a>" \
    if errormsg =~ /No connection could be made/i
	#fie read/wirte error
	status, errormsg= "1",  errormsg if errormsg =~ /No such file or directory/i
	return {:status =>status, :msg=> errormsg}.to_json
end
