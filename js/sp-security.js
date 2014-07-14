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

var spsecurity = (function () {
    //----------------- BEGIN MODULE SCOPE VARIABLES ---------------
    var
        configMap = {
            main_html: '<div class="sp-security-container">'
                        + '<form id="security-form">'
                            + '<div class="input-group"></div>'
                            + '<input type="button" id="submitBtn" value="Submit" />'
                        + '</form>'
                        + '<div class="notification"></div>'
                    + '</div>',
            settings_map: {
                guid: true,
                formVariables: true
            },
            security_item_html_map: {
                listItem: "<li></li>"
            },
            notification_map: {
                wait: 'Please Wait...',
                save: 'Saving...',
                error: 'Error!',
                success: 'Success!',
                complete: 'Complete!'
            }
        },
        settings_map = {
            guid: "",
            formVariables: []
        },
        stateMap = {
            $container: null
        },
        jqueryMap = {},

        initModule, setJqueryMap, saveListItem, printError, processResult, addInputItem, buildPayload, populateForm, getFormValues, getZRows, updateNotification, onSubmitClick;

    //----------------- END MODULE SCOPE VARIABLES ---------------
    //----------------- BEGIN UTILITY METHODS --------------------
    // Find the rows in an XMLHttpRequest.  This includes a workaround for Safari and Chrome's
    // aversion to the z:row namespace.
    getZRows = function (rXML) {
        var rows;
        var itemCount = $(rXML).find("rs\\:data").attr("ItemCount");
        if (rXML.getElementsByTagName("z:row").length == 0 && itemCount == undefined) {
            rows = rXML.getElementsByTagNameNS("*", "row");
        } else {
            rows = rXML.getElementsByTagName("z:row");
        }
        return rows;
    };

    // Begin Utility Method /getWebs/
    saveListItem = function (url, guid, payload, callback) {
        var results = [],
            
        // Create the SOAP request
         soapEnv =
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'
                + '<soap:Body>'
                    + '<UpdateListItems xmlns="http://schemas.microsoft.com/sharepoint/soap/">'
                    + '<listName>' + guid + '</listName>'
                    + '<updates>'
                        + '<Batch OnError="Continue" PreCalc="True">'
                            + payload
                        + '</Batch>'
                    + '</updates>'
                    + '</UpdateListItems>'
                + '</soap:Body>'
            + '</soap:Envelope>';

        $.ajax({
            url: url + "/_vti_bin/lists.asmx",
            beforeSend: function(xhr){
                xhr.setRequestHeader('SOAPAction', 'http://schemas.microsoft.com/sharepoint/soap/UpdateListItems');
            },
            type: "POST",
            dataType: "xml",
            data: soapEnv,
            error: printError,
            complete:  function(xData, status){
                $(xData.responseText).find("rows").each(function () {
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
        updateNotification(configMap.notification_map.error, "There was an error: " + errorThrown + " " + textStatus + "\n" + XMLHttpRequest.responseText);
        console.log("There was an error: " + errorThrown + " " + textStatus);
        console.log(XMLHttpRequest.responseText);
    };
    // End Utility Method /printError/

    // Begin Utility Method /processResult/
    processResult = function (results) {
        updateNotification(configMap.notification_map.success, results);
        console.log(results);
    };
    // End Utility Method /processResult/

    // Begin Utility Method /buildPayload/
    buildPayload = function (arr, index, obj_map, method, payload, callback) {
        var i,
            method_map = {
                'new': true,
                'update': true,
                'delete': true
            },
            fileName, fieldValue, key, fieldPayload = "";

        payload = payload || "";

        if (!(arr instanceof Array) 
            || !(obj_map instanceof Object)
            || !(method_map.hasOwnProperty(method.toLowerCase()))
            ){
            return false;
        }

        if(index < arr.length){
            for (key in arr[index]) {
                fieldName = key;
                fieldValue = arr[index][key];
                fieldPayload += '<Field Name="' + fieldName + '">' + fieldValue + '</Field>';
            }

            
            payload += '<Method ID="' + (index + 1) + '" Cmd="' + method + '">' + (method.toLowerCase() == 'new' ? '<Field Name="ID">New</Field>' : '') + fieldPayload + '</Method>';
            index++;

            setTimeout(function () {
                buildPayload(arr, index, obj_map, method, payload, callback);
            }, 10);

        } else if (callback) {
            callback(payload);
            return payload;
        } else {
            return payload;
        }

   
    };
    // End Utility Method /buildPayload/

    // Begin Utility Method /updateNotification/
    updateNotification = function (header, msg) {
        jqueryMap.$notification.html(header + "\n" + (msg || ""));
    };
    // End Utility Method /updateNotification/

    //----------------- END UTILITY METHODS ----------------------
    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var
        $container = stateMap.$container;
        
        jqueryMap = {
            $container: $container,
            $form: $('#security-form'),
            $submitBtn: $('#submitBtn'),
            $inputGroup: $container.find('.input-group'),
            $notification: $container.find('.notification')
        };
    };
    // End DOM method /setJqueryMap/

    // Begin DOM method /addInputItem/
    addInputItem = function ($target, arr, max, index, callback) {
        var queryArr,
            queryObj,
            name,
            value,
            $inputItem;

        if (!(arr instanceof Array) || index > max) {
            return false;
        }

        queryArr = arr[index].split('=');
        name = queryArr[0];
        value = queryArr[1];

        console.log("Name: " + name + "\nValue: " + value);

        queryObj = settings_map.formVariables[name.toLowerCase()] || false;
        if (queryObj) {
            switch (queryObj.type) {
                case 'textarea':
                    $inputItem = $('<span class="lable">' + (queryObj.display || name) + '</span>'
                      + '<textarea rows="4" cols="50" class="input" required=' + queryObj.required + '></textarea><br />');
                    break;
                default:
                    $inputItem = $('<span class="lable">' + (queryObj.display || name) + '</span>'
                      + '<input class="input" type="'+queryObj.type+'" required=' + queryObj.required + ' value="' + value + '"/><br />');
                    break;
            };

            $inputItem.val(value)
                      .data('info', queryObj)
                      .appendTo($target);
        }

        index++;
        if (index < max) {
            setTimeout(function () {
                addInputItem($target, arr, max, index, callback);
            }, 10);
        } else if (callback) {
            callback();
        }
    };
    // End DOM method /addInputItem/

    // Begin DOM Method /getQueryString/
    populateForm = function () {
        var $inputGroup = jqueryMap.$inputGroup,
           href = window.location.href.indexOf('file:') == -1 // test to see if this is an offline file
                ? window.location.href //set href to url since this is an online file
                : "www.example.com?firstName=Dustin&lastName=Hardin&email=someemail@email.com&description=Here is some text!", //else set some test varialbes
           queryStringStart = href.indexOf('?'),
           queryString = href.substring(queryStringStart + 1),
           queryStringArr = queryString.split('&'),
           queryArr = [];

        addInputItem($inputGroup, queryStringArr, queryStringArr.length, 0, function () { console.log('Done!'); });
    };
    // End DOM Method /getQueryString/

    // Begin DOM Method /getFormValues/
    getFormValues = function () {
        var arr = [], obj = {};
        //example output
        /*
        {
            <sharepoint_static_name>: <value>,
            <sharepoint_static_name>: <value>
        }
        */
        //iterate through each form input and bundle the info
        //in a object
        jqueryMap.$inputGroup.find('.input').each(function () {
            var $this = $(this),
                sharepoint_static_name = $this.data('info').sp_name || false,
                value = $this.val();

            // check if item does not have static sharepoint name
            if (!sharepoint_static_name) {
                return;
            }

            obj[sharepoint_static_name] = value;
        });

        //push object containing form data into arrary and return it
        arr.push(obj);

        return arr;

    };
    // End DOM Method /getFormValues/


    //--------------------- END DOM METHODS --------------------
    //--------------------- BEGIN EVENT HANDLERS ---------------
    // Begin Event Handler /onSubmitClick/
    onSubmitClick = function (e) {
        //get all data from existing fields
        var arr = getFormValues();
        updateNotification(configMap.notification_map.wait);
        //save data
        setTimeout(function () {
            buildPayload(arr, 0, {}, 'New', '', function (results) {
                updateNotification(configMap.notification_map.save);
                saveListItem(settings_map.url, settings_map.guid, results, processResult);
            });
        }, 10);
    };
    // End Event Handler /onSubmitClick/
    //--------------------- END EVENT HANDLERS -----------------
    //--------------------- BEGIN PUBLIC METHODS ---------------
    initModule = function ($container, options) {
        var $form = $(configMap.main_html);

        settings_map.guid = options.guid || "";
        settings_map.url = options.url || "";
        settings_map.formVariables = options.formVariables || [];

        if (settings_map.guid.length == 0 || settings_map.url.length == 0) {
            return;
        }

        $form.appendTo($container);
        stateMap.$container = $container;

        setJqueryMap();

        populateForm();

        jqueryMap.$submitBtn.on('click', onSubmitClick);
    };
    return { initModule: initModule };
}());