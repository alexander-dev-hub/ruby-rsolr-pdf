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
function loadpdf_page(pdfurl, q, page) {

    var DEFAULT_URL = pdfurl;
    var PAGE_TO_VIEW = page;


    if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
        alert('Please build the pdfjs-dist library using\n' +
            '  `gulp dist-install`');
    }

    // The workerSrc property shall be specified.
    //
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        '/js/pdfjs-dist/build/pdf.worker.js';

    // Some PDFs need external cmaps.
    //
    var CMAP_URL = '/js/pdfjs-dist/cmaps/';
    var CMAP_PACKED = true;


    var SCALE = 1.0;

    var container = document.getElementById('viewerContainer');

    // Loading document.
    pdfjsLib.getDocument({
        url: DEFAULT_URL,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
    }).then(function (pdfDocument) {
        // Document loaded, retrieving the page.
        return pdfDocument.getPage(PAGE_TO_VIEW).then(function (pdfPage) {
            // Creating the page view with default parameters.
            var pdfPageView = new pdfjsViewer.PDFPageView({
                container: container,
                id: PAGE_TO_VIEW,
                scale: SCALE,
                defaultViewport: pdfPage.getViewport(SCALE),
                // We can enable text/annotations layers, if needed
                textLayerFactory: new pdfjsViewer.DefaultTextLayerFactory(),
                annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
            });
            // Associates the actual page with the view, and drawing it
            pdfPageView.setPdfPage(pdfPage);
            return pdfPageView.draw();
        });
    });
}
