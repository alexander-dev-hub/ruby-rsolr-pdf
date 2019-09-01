 
	set :filesdir, '/Users/mira/Desktop/pdfsearchAPI/public/files'
	set :homedir, '/files'
	set :solrbase, 'http://localhost:8983/solr/'
	set :solrcore, 'docs'


	set :bind, 'localhost'
	set :port, 3000

	set :show_exceptions, false

	configure do
		mime_type :pdf, 'application/pdf'
	end
	#configure :production, :development do
	#	enable :logging
	#end
 
 