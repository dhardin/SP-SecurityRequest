/*
 * sp-security.js
 * Root namespace module
*/

/*jslint          browser : true,     continue : true,
  devel   : true,  indent : 2,        maxerr   : 50,
  newcapp : true,   nomen : true,     plusplus : true,
  regexp  : true,  sloppy : true,         vars : false,
  white   : true
*/
/*global $, spdsecurity */

var spdsecurity = (function () {
    //----------------- BEGIN MODULE SCOPE VARIABLES ---------------
    var
        configMap = {
            main_html: '<div class="sp-security-container"></div>',
            settings_map : {
                guid: true,
                formVarialbes: true
            },
            security_item_html_map : {
                listItem : "<li></li>"
            }
        },
        settings_map = {
            guid: "",
            formVarialbes: []
        },
        stateMap = {
            $container: null
        },
        jqueryMap = {},
        
        initModule, setJqueryMap, saveListItem, printError, processResults;

    //----------------- END MODULE SCOPE VARIABLES ---------------
    //----------------- BEGIN UTILITY METHODS --------------------
    // Begin Utility Method /getWebs/
    saveListItem = function (url, guid, callback) {
        var results = [],
            
        // Create the SOAP request
         soapEnv =
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                <soap:Body>\
                  <GetWebCollection xmlns="http://schemas.microsoft.com/sharepoint/soap/" />\
                </soap:Body>\
            </soap:Envelope>';

       
        $.ajax({
            url: url + "/_vti_bin/lists.asmx",
            type: "POST",
            dataType: "xml",
            data: soapEnv,
            error: printError,
            complete:  function(xData, status){
                $(xData.responseText).find("web").each(function () {
                    var $this = $(this)[0],
                    title, url;

                    title = $this.title;
                    url = $this.getAttribute('url');
                    results.push({ title: title, url: url, type: 'web' });
                });

                if (callback) {
                    callback(results);
                }
            },
            contentType: "text/xml; charset=\"utf-8\""
        });
    };
    // End Utility Method /getWebs/


    // Begin Utility Method /printError/
    printError = function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("There was an error: " + errorThrown + " " + textStatus);
        console.log(XMLHttpRequest.responseText);
    };
    // End Utility Method /printError/

    // Begin Utility Method /processResult/
    processResult = function (data) {
        var i;

     
    };
    // End Utility Method /processResult/

    //----------------- END UTILITY METHODS ----------------------
    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var
        $container = stateMap.$container;
        
        jqueryMap = {
            $container: $container
        };
    };
    // End DOM method /setJqueryMap/

    //--------------------- END DOM METHODS --------------------

    initModule = function ($container, options) {
        var $form = $(configMap.main_html);

        settings_map.guid = options.guid || "";
        settings_map.formVarialbes = options.formVarialbes || [];

        if (settings_map.guid.length == 0) {
            return;
        }

        $form.appendTo($container);
        stateMap.$container = $container;

        setJqueryMap();
      
    };
    return { initModule: initModule };
}());