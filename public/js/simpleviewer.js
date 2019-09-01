/* Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

function loadpdf_find(pdfurl, word, page){

	  if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer)  {
		    alert('Please build the pdfjs-dist library using\n' +
		          '  `gulp dist-install`');
		  }

		var DEFAULT_URL = pdfurl;
		var PAGE_TO = page;
	  var SEARCH_FOR =word; // try 'Mozilla';

		//alert(DEFAULT_URL);
		//alert(SEARCH_FOR);
	  	// The workerSrc property shall be specified.
		//
		  pdfjsLib.GlobalWorkerOptions.workerSrc =
		    '/js/pdfjs-dist/build/pdf.worker.js';

		  // Some PDFs need external cmaps.
		  //
		  var CMAP_URL = '/js/pdfjs-dist/cmaps/';
		  var CMAP_PACKED = true;


		  var container = document.getElementById('viewerContainer');

		  // (Optionally) enable hyperlinks within PDF files.
		  var pdfLinkService = new pdfjsViewer.PDFLinkService();

		  var pdfViewer = new pdfjsViewer.PDFViewer({
		    container: container,
				linkService: pdfLinkService,
				
		  });
		  pdfLinkService.setViewer(pdfViewer);

		  // (Optionally) enable find controller.
		  var pdfFindController = new pdfjsViewer.PDFFindController({
		    pdfViewer: pdfViewer,
		  });
		  pdfViewer.setFindController(pdfFindController);

		  container.addEventListener('pagesinit', function () {
		    // We can use pdfViewer now, e.g. let's change default scale.
		   pdfViewer.currentScaleValue = 'page-width';
		   //pdfViewer.initialBookmark= 'page='+PAGE_TO
		    if (SEARCH_FOR) { // We can try search for things
		      pdfFindController.executeCommand('find',  {
		    	    caseSensitive: false,
		    	    findPrevious: undefined,
		    	    highlightAll: true,
					phraseSearch: true,

		    	    query: SEARCH_FOR
		    	});
		    }

              pdfViewer.currentPageNumber = PAGE_TO
		  });

		  // Loading document.
		  pdfjsLib.getDocument({
		    url: DEFAULT_URL+'#page='+PAGE_TO,
		    cMapUrl: CMAP_URL,
		    cMapPacked: CMAP_PACKED,
		  }).then(function(pdfDocument) {
		    // Document loaded, specifying document for the viewer and
		    // the (optional) linkService.
		    pdfViewer.setDocument(pdfDocument);

		    pdfLinkService.setDocument(pdfDocument, null);
		  });

}