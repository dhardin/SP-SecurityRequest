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
      url: 'URL of SharePoint Site',
      guid: 'GUID of SharePoint List',
      formVarialbes: {
          name: { type: 'text', required: true, display: 'Name', sp_name: 'Title' },
          affiliation: { type: 'text', required: true, display: 'Affiliation', sp_name: 'Affiliation' },
          sponsor: { type: 'text', required: true, display: 'Sponsor', sp_name: 'Sponsor' },
          company: { type: 'text', required: true, display: 'Company', sp_name: 'Company' },
          ipt: { type: 'text', required: true, display: 'IPT', sp_name: 'IPT' },
          ia_training_date: { type: 'textarea', required: true, display: 'IA Training Date', sp_name: 'IA_x0020_Training_x0020_Date' },
          description: { type: 'text', required: true, display: 'Description', sp_name: 'Body' }
      }	
  });
</script>
```
##Variables
- **spsecurity**
  - Description: Module namespace.  You must use this variable to configure and initialize the security module.

##Methods
- **initModule**
  - Description: Initializes the SP Security Request module.
  - Parameters
    - $target : Target DOM element that you wish to call initModule on.
    - options : Object containing the various options you wish to pass to initModule.

##Options
- **url**:
  - *Type*: String
  - *Description*: URL of the SharePoint site.
- **guid**: 
  - *Type*: String
  - *Description*: GUID of the SharePoint list you wish to create the list item at.
- **formVarialbes**:
  - *Type*: Array
  - *Description*: Array that contains objects with the following varibles:
    - value: Value of query string to parse.
    - text: Display value of query string on form
    - type: (Optional) Type of value allowed.
    - length: (Optional) Length of value allowed.
    - sp_name: Static name of the SharePoint column

