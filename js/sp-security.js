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
            main_html: '<div class="sp-security-container"><form id="security-form"><input type="submit" id="submitBtn" value="Submit" /></form></div>',
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
        
        initModule, setJqueryMap, saveListItem, printError, processResults, addInputItem;

    //----------------- END MODULE SCOPE VARIABLES ---------------
    //----------------- BEGIN UTILITY METHODS --------------------
    // Begin Utility Method /getWebs/
    saveListItem = function (url, guid, payload, callback) {
        var results = [],
            
        // Create the SOAP request
         soapEnv =
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                <soap:Body>\
                  <Batch OnError="Continue" PreCalc="TRUE" ListVersion="0"\
                  ViewName="{'+guid+'}">\
                   <Method ID="1" Cmd="New">'+payload+'</Method>\
                </soap:Body>\
            </soap:Envelope>';

       
        $.ajax({
            url: url + "/_vti_bin/lists.asmx",
            type: "POST",
            dataType: "xml",
            data: soapEnv,
            error: printError,
            complete:  function(xData, status){
                $(xData.responseText).find("result").each(function () {
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
    processResult = function (results) {
        if(!(results instanceof Array)){
            addInputItem(jqueryMap.$form, results, results.max, 0, function () { console.log('done!'); });
        }
    };
    // End Utility Method /processResult/

    //----------------- END UTILITY METHODS ----------------------
    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var
        $container = stateMap.$container;
        
        jqueryMap = {
            $container: $container,
            $form: $('#security-form'),
            $submitBtn: $('#submitBtn')
        };
    };
    // End DOM method /setJqueryMap/

    // Begin DOM method /addInputItem/
    addInputItem = function ($target, arr, max, index, callback) {
        var queryArr,
            queryObj,
            name,
            value;

        if (!(arr instanceof Array) || index > max) {
            return false;
        }

        queryArr = arr[index].split('=');
        name = queryArr[0];
        value = queryArr[1];

        console.log("Name: " + name + "\nValue: " + value);

        queryObj = query_map[name] || false;
        if (queryObj) {
            switch (queryObj.type) {
                case 'textarea':
                    $('<span class="lable">' + (queryObj.display || name) + '</span>'
                      + '<textarea rows="4" cols="50" class="input' + (queryObj.type || 'text') + '" required=' + queryObj.required + '></textarea><br />')
                          .val(value)
                          .appendTo($target);
                    break;
                default:
                    $('<span class="lable">' + (queryObj.display || name) + '</span>'
                      + '<input class="input' + (queryObj.type || 'text') + '" type="' + (queryObj.type || 'text') + '" required=' + queryObj.required + ' value="' + value + '"/><br />')
                        .appendTo($target);
                    break;
            }
        }

        index++;
        if (index < max) {
            setTimeout(function () {
                addInput($target, arr, max, index, callback);
            }, 1000);
        } else if (callback) {
            callback();
        }
    };
    // End DOM method /addInputItem/

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