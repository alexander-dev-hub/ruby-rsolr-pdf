'use strict';

var frmSingleUpload = document.querySelector('#frmSingleUpload');
var inputSingleFile = document.querySelector('#inputSingleFile');
var fileUploadError = document.querySelector('#fileUploadError');
var fileUploadSuccess = document.querySelector('#fileUploadSuccess');

var frmMultiUpload = document.querySelector('#frmMultiUpload');
var inputMultiFile = document.querySelector('#inputMultiFile');


var inputquery = document.querySelector('#query');
var searchbtn = document.querySelector('#searchbtn');
var searchresult = document.querySelector('#searchresult');

var inp_rscname = document.querySelector('#inp_rscname');
var delbtn = document.querySelector('#delbtn');
var delresult = document.querySelector('#delresult');
var delallbtn = document.querySelector('#delallbtn');
var delallresult = document.querySelector('#delallresult');
var checksolrbtn = document.querySelector('#checksolrbtn');
var checksolrresult = document.querySelector('#checksolrresult');
var clearbtn = document.querySelector('#clearbtn');

var searchResults = document.getElementById("searchresults_app");
var query_app = document.getElementById("query_app");
var searchbtn_app = document.getElementById("searchbtn_app");


function uploadSingleFile(file) {
    var formData = new FormData();
    formData.append("file", file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.onload = function() {
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);

        if(xhr.status == 200) {
            fileUploadError.style.display = "none";
            var content = "";
            var docs=response.docs;
            for(var i = 0; i < docs.length; i++) {
                content += "<p>DownloadUrl : <a href='" + docs[i].fileurl + "' target='_blank'>" + docs[i].fileurl + "</a></p>";
            }
            fileUploadSuccess.innerHTML = content;
            //fileUploadSuccess.style.display = "block";
        } else {
            //fileUploadSuccess.style.display = "none";

            var errormsg= "Some Error Occurred";
            if(response && response.msg) errormsg=response.msg;
            fileUploadError.innerHTML = "<p style='color:darkred'>" + errormsg + "</p>";
            //fileUploadError.style.display = "block";
        }
    }

    xhr.send(formData);
}

function uploadMultipleFiles(files) {
    var formData = new FormData();

    for(var index = 0; index < files.length; index++) {
        formData.append("files[]", files[index]);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploads");

    xhr.onload = function() {
        console.log(xhr.responseText);
        var response = JSON.parse(xhr.responseText);
        if(xhr.status == 200) {
            fileUploadError.style.display = "none";
            var content = "";
            var docs=response.docs;
            for(var i = 0; i < docs.length; i++) {
                content += "<p>DownloadUrl : <a href='" + docs[i].fileurl + "' target='_blank'>" + docs[i].fileurl + "</a></p>";
            }
            fileUploadSuccess.innerHTML = content;
            //fileUploadSuccess.style.display = "block";
        } else {
            var errormsg= "Some Error Occurred";
            if(response && response.msg) errormsg=response.msg;
            //fileUploadSuccess.style.display = "none";
            fileUploadError.innerHTML = "<p style='color:darkred'>" + errormsg + "</p>";

        }
    }

    xhr.send(formData);
}

frmSingleUpload.addEventListener('submit', function(event){
    var files = inputSingleFile.files;
    if(files.length === 0) {
        fileUploadError.innerHTML = "Please select a file";
        fileUploadError.style.display = "block";
    }
    uploadSingleFile(files[0]);
    event.preventDefault();
}, true);


frmMultiUpload.addEventListener('submit', function(event){
    var files = inputMultiFile.files;

    if(files.length === 0) {
        fileUploadError.innerHTML = "Please select at least one file";
        fileUploadError.style.display = "block";
    }
    uploadMultipleFiles(files);
    event.preventDefault();
}, true);


searchbtn.addEventListener('click', function(event){

    var q = inputquery.value;
    if(q.trim()=='') {
        alert('input query')
        return;
    }
    var params = 'q='+q+'&prety=true';
    var url=  "/api/search?"+ params;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onload = function() {

        var response =  JSON.parse(xhr.responseText) ;
        if(xhr.status == 200) {

            searchresult.innerText ="count:" +response.msg+"\n"+ response.docs;
            searchresult.style.display = "block";
        } else {
            var errormsg= "Some Error Occurred";
            if(response && response.msg) errormsg=response.msg;
            searchresult.innerHTML = "<p style='color:darkred'>" + errormsg + "</p>";
            searchresult.style.display = "block";
        }
    }

    xhr.send(null);
    event.preventDefault();
}, true);



delbtn.addEventListener('click', function(event){

    var fnname = inp_rscname.value;
    if(fnname.trim()=='') {
        alert('input resource_name')
        return;
    }
    var params = 'resource_name='+fnname;
    var url=  "/api/delete?"+ params;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);

    xhr.onload = function() {

        var response =  JSON.parse(xhr.responseText) ;
        //console.log(response);
        if(xhr.status == 200) {
            var content="";
            var docs=response.docs;

            for(var i = 0; i < docs.length; i++) {
                content += "<p>File Deleted Successfully: " + docs[i].fileurl +"</p>";
            }
            delresult.innerHTML = content;
            
        } else {
            var errormsg= "Some Error Occurred";
            if(response && response.msg) errormsg=response.msg;
            delresult.innerHTML =  "<p style='color:darkred'>" + errormsg + "</p>";
            
        }
    }

    xhr.send(null);
    event.preventDefault();
}, true);

delallbtn.addEventListener('click', function(event){
  
    var url=  "/api/deleteAll";

    var xhr = new XMLHttpRequest();
    var content="";
    var errormsg= "Some Error Occurred";
    xhr.open("GET", url);

    xhr.onload = function() {
        var response =  JSON.parse(xhr.responseText) ;
        if(response && response.msg) errormsg=response.msg;
        if(xhr.status == 200) {

            content = errormsg;
        }
        else{

            content =  "<p style='color:darkred'>" + errormsg + "</p>";
        }
        delallresult.innerHTML = content;
    }

    xhr.send(null);
    event.preventDefault();
}, true);

clearbtn.addEventListener('click', function(event) {
    checksolrresult.innerHTML="";
}, true);

checksolrbtn.addEventListener('click', function(event){
  
    var url=  "/api/checksolr";
    var today=new Date().toJSON();
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    var content=checksolrresult.innerHTML;
    var msg="";
    xhr.onload = function() {
        if(xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if(response && response.msg) msg=response.msg+" "+ today+"<br/>";
            content+=msg;
        }
        else
        {
            var  msg= "Some Error Occurred";
            if(response && response.msg) msg=response.msg+Date().toJSON();
            content="<p style='color:darkred'>" + msg+ "</p>";
        }

        checksolrresult.innerHTML =  content ;

    }

    xhr.send(null);
    event.preventDefault();
}, true);


