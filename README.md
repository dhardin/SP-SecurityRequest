#SP-SecurityRequest
==================

SharePoint security request module allows for passing in security requests into your SharePoint environment using query strings.

==================
##Usage
==================
###Installation
All files must be placed on the same domain as your SharePoint site to avoid errors associated with cross-domain scripting.

###Markup & Initialization
```HTML
<div id="sp-security"></div>

<script type="text/javascript">
  spsecurity.initModule($('#sp-security'), 
  {
      guid: 'GUID of SharePoint List', 
      formVarialbes: [
          {value:"FirstName", text:"First Name", type:"string"},
          {value:"LastName", text:"Last Name", type:"string"},
          {value:"Phone", text:"Phone Number", type:"uint", length: 10}
      ]
  });
</script>
```
##Variables
-spsecurity
  - Description: Module namespace.  You must use this variable to configure and initialize the security module.

##Methods
- initModule
  - Parameters
    - $target : Target DOM element that you wish to call initModule on.
    - options : Object containing the various options you wish to pass to initModule.

##Options
- guid: 
  - Type: String
  - Description: GUID of the SharePoint list you wish to create the list item at.
- formVarialbes:
  - Type: Array
  - Description: Array that contains objects with the following varibles:
    - value: Value of query string to parse.
    - text: Display value of query string on form
    - type: (Optional) Type of value allowed.
    - length: (Optional) Length of value allowed.

