angular.module('dsgaApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/about.html',
    "<p>This is the about view.</p>"
  );


  $templateCache.put('views/device_list.html',
    "<div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\"><b>Senders List</b> <span class=\"badge badge-important\">{{device_list.length}}</span></div> <button type=\"button\" class=\"btn btn-info add-button\" ng-click=\"new_device()\"><b>Add Sender +</b></button> </div> <div> <div ng-repeat=\"(app_name, devices) in filtered_devices\" ng-if=\"devices.length>0\"> <div style=\"font-size:30px; margin-bottom: 20px\"><b>{{app_name}}</b> <span class=\"badge badge-important\">{{devices.length}}</span> </div> <li class=\"no-list-style tall-list\" ng-repeat=\"device in devices\"> <span class=\"label label-danger type-tag\">{{device.var_list}}</span> <div class=\"left-container-for-list\"> <div class=\"device-title\"><b> <a href=\"#/update_device/{{device.id}}\">{{device.device_tag}}</a></b></div> <h3> <span class=\"label label-info\">{{device.data.settings['Points X Req']}}</span> <span class=\"label label-primary\">{{device.update_rate}}</span> </h3> </div> <div class=\"center-left-container-for-list\"> <span class=\"badge\">Sender Address : {{device.device_address}}</span> <span class=\"badge\">Network ID : {{device.network_id}}</span> <span class=\"badge\">Var List : {{device.var_list}}</span> <span class=\"badge\">Target : {{device.data.override_global_settings ? device.data.settings.endpoint : 'Global Endpoint'}}</span> </div> <toggle class=\"toggle\" ng-model=\"device.active\" ng-change=\"changed(device)\" on=\"On\" off=\"Off\" onstyle=\"btn-info\"></toggle> </li> </div> </div>"
  );


  $templateCache.put('views/main.html',
    "<div class=\"main-page\"> <p> <img style=\"margin-left: 250px\" src=\"images/hornet.png\" width=\"200\"> </p> <div class=\"circle\"> <div class=\"logo-text\">dsga</div> </div> <p class=\"lead\"> </p> <div class=\"home-title\"> DSGA Manager</div> <!--\n" +
    "  <div class=\"center-div\">\n" +
    "\t\t<toggle class=\"toggle center-content\" ng-model=\"settings.active\" ng-change=\"toggleSwitch()\" on=\"On\" off=\"Off\" onstyle=\"btn-success\"></toggle>\n" +
    "  </div>\n" +
    "--> <!--   <b><span class=\"nice-blue-text\">{{settings.data.endpoint}}</span></b> --> <div id=\"list-button-centered\"> <br> <p><a class=\"btn btn-lg btn-info\" ng-href=\"#/Senders\">Go To Senders List <span class=\"glyphicon glyphicon-th-list\"></span></a></p> </div> </div>"
  );


  $templateCache.put('views/new_device.html',
    "<div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\"><b>New Data Sender <span class=\"nice-blue-text\">{{dataModel.device_tag}}</span></b> </div> <button type=\"button\" class=\"btn btn-success add-button\" ng-click=\"createDeviceInInternalServer()\"><b>Save +</b></button> </div> <div class=\"form-group\"> <label for=\"app_name\">App Name:</label> <select name=\"singleSelect2\" id=\"singleSelect2\" ng-model=\"dataModel.data.app_name\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.apps\" value=\"{{option}}\">{{option}}</option> </select> </div> <div class=\"form-group\"> <label for=\"device_tag\">Sender Tag:</label> <input type=\"text\" class=\"form-control\" id=\"device_tag\" ng-model=\"dataModel.device_tag\"> </div> <div class=\"form-group\"> <label for=\"device_address\">Sender Address:</label> <input type=\"text\" class=\"form-control\" id=\"device_address\" ng-model=\"dataModel.device_address\"> </div> <!--\n" +
    "<div class=\"form-group\">\n" +
    "  <label for=\"gateway_tag\">Gateway Tag:</label>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"gateway_tag\" ng-model=\"dataModel.gateway_tag\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <label for=\"gateway_address\">Gateway Address:</label>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"gateway_address\" ng-model=\"dataModel.gateway_address\">\n" +
    "</div>\n" +
    "--> <div class=\"form-group\"> <label for=\"network_id\">Network ID:</label> <input type=\"text\" class=\"form-control\" id=\"network_id\" ng-model=\"dataModel.network_id\"> </div> <div class=\"form-group\"> <label for=\"update_rate\">Update Rate:</label> <select name=\"singleSelect2\" id=\"singleSelect2\" ng-model=\"dataModel.update_rate\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.update_rate_options\" value=\"{{option}}\">{{option}} Seconds</option> </select> </div> <!--\n" +
    "\t<div class=\"device-select\">\n" +
    "\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"update_rate\">Sender Type :</label>\n" +
    "\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.device_type_name\" ng-click=\"reset_device_type()\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t    <option ng-repeat=\"option in lists.device_types\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.device_type\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t    <option ng-repeat=\"option in lists.device_sub_types[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "--> <span> <div class=\"var_list_container\"> <h2> <b>Var</b> </h2> <b>PV</b> <checkbox largest ng-model=\"dataModel.polling_info.PV.active\" name=\"custom-name\" ng-change=\"onChange('PV')\" class=\"btn-default\"></checkbox> <b>AP</b> <checkbox largest ng-model=\"dataModel.polling_info.AP.active\" name=\"custom-name\" ng-change=\"onChange('AP')\" class=\"btn-default\"></checkbox> <b>IR</b> <checkbox largest ng-model=\"dataModel.polling_info.IR.active\" name=\"custom-name\" ng-change=\"onChange('IR')\" class=\"btn-default\"></checkbox> <b>SD</b> <checkbox largest ng-model=\"dataModel.polling_info.SD.active\" name=\"custom-name\" ng-change=\"onChange('SD')\" class=\"btn-default\"></checkbox> <b>ED</b> <checkbox largest ng-model=\"dataModel.polling_info.ED.active\" name=\"custom-name\" ng-change=\"onChange('ED')\" class=\"btn-default\"></checkbox> </div> <div class=\"single_var_element\" id=\"PV-section\" ng-if=\"dataModel.polling_info.PV.active\"> <h2><b>PV</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.PV\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"AP-section\" ng-if=\"dataModel.polling_info.AP.active\"> <h2><b>PV</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Image Size:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.AP\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"IR-section\" ng-if=\"dataModel.polling_info.IR.active\"> <h2><b>IR</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Infra Red Video Size:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.IR\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"SD-section\" ng-if=\"dataModel.polling_info.SD.active\"> <h2><b>SD</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.SD\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"ED-section\" ng-if=\"dataModel.polling_info.ED.active\"> <h2><b>ED</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.ED\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <!--\n" +
    "\t<div class=\"single_var_element\" id=\"PV-section\" ng-if=\"dataModel.polling_info.PV.active\">\n" +
    "\t\t<h2><b>PV</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_status\" ng-init=\"dataModel.polling_info.PV.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"AP-section\" ng-if=\"dataModel.polling_info.AP.active\">\n" +
    "\t\t<h2><b>AP</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"IR-section\" ng-if=\"dataModel.polling_info.IR.active\">\n" +
    "\t\t<h2><b>IR</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"SD-section\" ng-if=\"dataModel.polling_info.SD.active\">\n" +
    "\t\t<h2><b>SD</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"DV-section\" ng-if=\"dataModel.polling_info.ED.active\">\n" +
    "\t\t<h2><b>ED</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "--> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"var_list_container\"> <h2> <b>Override Global Settings?</b> </h2> <b>Yes please :)</b> <checkbox largest ng-model=\"dataModel.data.override_global_settings\" name=\"custom-name\" ng-change=\"onChange()\" class=\"btn-default\"></checkbox> </div> <div ng-if=\"dataModel.data.override_global_settings\"> <div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\" ng-click=\"restoreSettings();\"><b>Settings</b></div> </div> <span ng-repeat=\"(key,value) in lists.settings\"> <div class=\"small-input float-left margin-bottom\"> <label for=\"{{key}}\">{{key}}:</label> <input type=\"number\" class=\"form-control\" id=\"\" ng-model=\"dataModel.data.settings[key]\" value=\"{{value}}\"> </div> </span> </div> </span> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"alert-box\"> <div class=\"alert alert-success alert-dismissable\" ng-if=\"alert.type=='success'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-warning alert-dismissable\" ng-if=\"alert.type=='warning'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-danger alert-dismissable\" ng-if=\"alert.type=='failed'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> </div> <div class=\"device-list-header\"> <button type=\"button\" class=\"btn btn-success add-button\" ng-click=\"createDeviceInInternalServer()\"><b>Save +</b></button> </div>"
  );


  $templateCache.put('views/settings.html',
    "<span ng-init=\"init()\"> <div class=\"form-group\"> <h2> <b>Master Switch</b> </h2> <toggle class=\"toggle float-left\" ng-model=\"settings.active\" ng-change=\"toggleSwitch()\" on=\"On\" off=\"Off\" onstyle=\"btn-info\"></toggle> </div> <!--<div style=\"clear:both; margin-bottom:30px;\"></div>\n" +
    "\t<div class=\"device-list-header\">\n" +
    "\t\t<div class=\"float-left\" style=\"font-size:30px;\"><b>Settings</b></div>\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"OV1_SS\">OV1_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"OV1_SS\" ng-model=\"settings.data.settings.OV1_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"PKV1_SS\">PKV1_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"PKV1_SS\" ng-model=\"settings.data.settings.PKV1_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"OV2_SS\">OV2_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"OV2_SS\" ng-model=\"settings.data.settings.OV2_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"PKV2_SS\">PKV2_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"PKV2_SS\" ng-model=\"settings.data.settings.PKV2_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"DISCH_P_SS\">DISCH_P_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"DISCH_P_SS\" ng-model=\"settings.data.settings.DISCH_P_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"FLOW_SS\">FLOW_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"FLOW_SS\" ng-model=\"settings.data.settings.FLOW_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SUCT_P_SS\">SUCT_P_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SUCT_P_SS\" ng-model=\"settings.data.settings.SUCT_P_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"STR_DP_SS\">STR_DP_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"STR_DP_SS\" ng-model=\"settings.data.settings.STR_DP_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SEAL_L_SS\">SEAL_L_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SEAL_L_SS\" ng-model=\"settings.data.settings.SEAL_L_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SEAL_P_SS\">SEAL_P_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SEAL_P_SS\" ng-model=\"settings.data.settings.SEAL_P_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"BEAR1_T_SS\">BEAR1_T_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"BEAR1_T_SS\" ng-model=\"settings.data.settings.BEAR1_T_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"BEAR2_T_SS\">BEAR2_T_SS:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"BEAR2_T_SS\" ng-model=\"settings.data.settings.BEAR2_T_SS\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SPEED_SP\">SPEED_SP:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SPEED_SP\" ng-model=\"settings.data.settings.SPEED_SP\">\n" +
    "\t</div>\n" +
    "\t<div class=\"small-input float-left margin-bottom\">\n" +
    "\t  <label for=\"SPEED_MAX\">SPEED_MAX:</label>\n" +
    "\t  <input type=\"number\" class=\"form-control\" id=\"SPEED_MAX\" ng-model=\"settings.data.settings.SPEED_MAX\">\n" +
    "\t</div>--> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\" ng-click=\"restoreSettings();\"><b>Settings</b></div> </div> <span ng-repeat=\"(key,value) in lists.settings\"> <div class=\"small-input float-left margin-bottom\" ng-if=\"key!='endpoint'\"> <label for=\"{{key}}\">{{key}}:</label> <input type=\"number\" class=\"form-control\" id=\"OV1_SS\" ng-model=\"settings.data.settings[key]\" value=\"{{settings.data.settings[$index]}}\"> </div> </span> </span> <div style=\"clear:both\"></div> <!--\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"update_rate\">Global Update Rate:</label>\n" +
    "\t\t<select name=\"singleSelect2\" id=\"singleSelect2\" ng-model=\"settings.data.update_rate\">\n" +
    "\t\t\t<option ng-repeat=\"option in update_rate_options\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t</div>\n" +
    "--> <div class=\"form-group\"> <label for=\"device_tag\">Global Target API Endpoint:</label> <input type=\"text\" class=\"form-control\" id=\"device_tag\" ng-model=\"settings.data.endpoint\"> <button type=\"button\" class=\"btn btn-info margin-bottom margin-right margin-top\" ng-click=\"getServerStatus()\"><b>Check Target Server Status</b></button> <b>{{server_status}}</b> </div> <div class=\"alert-box\"> <div class=\"alert alert-success alert-dismissable\" ng-if=\"alert.type=='success'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-warning alert-dismissable\" ng-if=\"alert.type=='warning'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-danger alert-dismissable\" ng-if=\"alert.type=='failed'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> </div> <div> <button type=\"button\" class=\"btn btn-success add-button margin-bottom\" ng-click=\"update()\"><b>Update</b></button> <button type=\"button\" class=\"btn btn-warning add-button margin-bottom margin-right\" ng-click=\"reset()\"><b>Reset</b></button> </div> "
  );


  $templateCache.put('views/update_device.html',
    "<div class=\"form-group\"> <h2> <b>Status</b> </h2> <toggle class=\"toggle float-left\" ng-model=\"dataModel.active\" ng-change=\"changed()\" on=\"On\" off=\"Off\" onstyle=\"btn-info\"></toggle> </div> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"device-list-header\"> <div class=\"float-left\" style=\"font-size:30px\"><b>Update Device <span class=\"nice-blue-text\">{{dataModel.device_tag}}</span></b></div> <button type=\"button\" class=\"btn btn-info add-button\" ng-click=\"update_device()\"><b>Update</b></button> </div> <div class=\"alert-box\" ng-show=\"alert.type\"> <div class=\"alert alert-success alert-dismissable\" ng-if=\"alert.type=='success'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-warning alert-dismissable\" ng-if=\"alert.type=='warning'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-danger alert-dismissable\" ng-if=\"alert.type=='failed'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> </div> <div class=\"form-group\"> <label for=\"app_name\">App Name:</label> <select name=\"app_name\" id=\"app_name\" ng-model=\"dataModel.data.app_name\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.apps\" value=\"{{option}}\">{{option}}</option> </select> </div> <div class=\"form-group\"> <label for=\"device_tag\">Sender Tag:</label> <input type=\"text\" class=\"form-control\" id=\"device_tag\" ng-model=\"dataModel.device_tag\"> </div> <div class=\"form-group\"> <label for=\"device_address\">Sender Address:</label> <input type=\"text\" class=\"form-control\" id=\"device_address\" ng-model=\"dataModel.device_address\"> </div> <!--\n" +
    "<div class=\"form-group\">\n" +
    "  <label for=\"gateway_tag\">Gateway Tag:</label>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"gateway_tag\" ng-model=\"dataModel.gateway_tag\">\n" +
    "</div>\n" +
    "<div class=\"form-group\">\n" +
    "  <label for=\"gateway_address\">Gateway Address:</label>\n" +
    "  <input type=\"text\" class=\"form-control\" id=\"gateway_address\" ng-model=\"dataModel.gateway_address\">\n" +
    "</div>\n" +
    "--> <div class=\"form-group\"> <label for=\"network_id\">Network ID:</label> <input type=\"text\" class=\"form-control\" id=\"network_id\" ng-model=\"dataModel.network_id\"> </div> <div class=\"form-group\"> <label for=\"update_rate\">Update Rate:</label> <select name=\"singleSelect2\" id=\"singleSelect2\" ng-model=\"dataModel.update_rate\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.update_rate_options\" value=\"{{option}}\">{{option}} Seconds</option> </select> </div> <!--\n" +
    "<div class=\"device-select\">\n" +
    "\t<div class=\"form-group\">\n" +
    "\t\t<label for=\"update_rate\">Sender Type :</label>\n" +
    "\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.device_type_name\" ng-click=\"reset_device_type()\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t    <option ng-repeat=\"option in lists.device_types\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t\t<select name=\"singleSelect3\" id=\"singleSelect3\" ng-model=\"dataModel.device_type\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t    <option ng-repeat=\"option in lists.device_sub_types[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t</select>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "--> <span> <div class=\"var_list_container\"> <h2> <b>Var</b> </h2> <b>PV</b> <checkbox largest ng-model=\"dataModel.polling_info.PV.active\" name=\"custom-name\" ng-change=\"onChange('PV')\" class=\"btn-default\"></checkbox> <b>AP</b> <checkbox largest ng-model=\"dataModel.polling_info.AP.active\" name=\"custom-name\" ng-change=\"onChange('AP')\" class=\"btn-default\"></checkbox> <b>IR</b> <checkbox largest ng-model=\"dataModel.polling_info.IR.active\" name=\"custom-name\" ng-change=\"onChange('IR')\" class=\"btn-default\"></checkbox> <b>SD</b> <checkbox largest ng-model=\"dataModel.polling_info.SD.active\" name=\"custom-name\" ng-change=\"onChange('SD')\" class=\"btn-default\"></checkbox> <b>ED</b> <checkbox largest ng-model=\"dataModel.polling_info.ED.active\" name=\"custom-name\" ng-change=\"onChange('ED')\" class=\"btn-default\"></checkbox> </div> <div class=\"single_var_element\" id=\"PV-section\" ng-if=\"dataModel.polling_info.PV.active\"> <h2><b>PV</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.PV\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"AP-section\" ng-if=\"dataModel.polling_info.AP.active\"> <h2><b>PV</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Image Size:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.AP\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"IR-section\" ng-if=\"dataModel.polling_info.IR.active\"> <h2><b>IR</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Infra Red Video Size:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.IR\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"SD-section\" ng-if=\"dataModel.polling_info.SD.active\"> <h2><b>SD</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.SD\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <div class=\"single_var_element\" id=\"ED-section\" ng-if=\"dataModel.polling_info.ED.active\"> <h2><b>ED</b></h2> <div class=\"small-input float-left\"> <label for=\"dv_unit\">Data Type:</label> <select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_unit\"> <option value=\"\">---Please select---</option> <option ng-repeat=\"option in lists.type.ED\" value=\"{{option}}\">{{option}}</option> </select> </div> </div> <!--\n" +
    "\t<div class=\"single_var_element\" id=\"PV-section\" ng-if=\"dataModel.polling_info.PV.active\">\n" +
    "\t\t<h2><b>PV</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.PV.dv_status\" ng-init=\"dataModel.polling_info.PV.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"SV-section\" ng-if=\"dataModel.polling_info.AP.active\">\n" +
    "\t\t<h2><b>AP</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.AP.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"TV-section\" ng-if=\"dataModel.polling_info.IR.active\">\n" +
    "\t\t<h2><b>IR</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.IR.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"QV-section\" ng-if=\"dataModel.polling_info.SD.active\">\n" +
    "\t\t<h2><b>SD</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.SD.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t\n" +
    "\t<div class=\"single_var_element\" id=\"DV-section\" ng-if=\"dataModel.polling_info.ED.active\">\n" +
    "\t\t<h2><b>ED</b></h2>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_unit\">dv_unit:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_unit\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.units[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_value\">dv_value:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_value\" ng-click=\"onChange()\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_value_list[dataModel.polling_info.device_type_name]\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t\n" +
    "\t\t<div class=\"small-input float-left\">\n" +
    "\t\t\t<label for=\"dv_status\">dv_status:</label>\n" +
    "\t\t\t<select name=\"singleSelect\" id=\"singleSelect\" ng-model=\"dataModel.polling_info.ED.dv_status\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t\t\t\t<option ng-repeat=\"option in lists.variable_status_list\" value=\"{{option}}\">{{option}}</option>\n" +
    "\t\t\t</select>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "--> <span> <div style=\"clear:both; margin-bottom:30px\"></div> <div class=\"var_list_container\"> <h2> <b>Override Global Settings?</b> </h2> <b>Yes please :)</b> <checkbox largest ng-model=\"dataModel.data.override_global_settings\" name=\"custom-name\" ng-change=\"onChange()\" class=\"btn-default\"></checkbox> </div> <div class=\"device-list-header\" ng-if=\"dataModel.data.override_global_settings\"> <div class=\"float-left\" style=\"font-size:30px\" ng-click=\"restoreSettings();\"><b>Settings</b></div> </div> <span ng-repeat=\"(key,value) in lists.settings\" ng-if=\"dataModel.data.override_global_settings\"> <div class=\"small-input float-left margin-bottom\"> <label for=\"{{key}}\">{{key}}:</label> <input type=\"text\" class=\"form-control\" id=\"\" ng-model=\"dataModel.data.settings[key]\" value=\"{{dataModel.data.settings[$index]}}\"> </div> </span> </span> </span> <div style=\"clear:both\"></div> <div class=\"alert-box\"> <div class=\"alert alert-success alert-dismissable\" ng-if=\"alert.type=='success'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-warning alert-dismissable\" ng-if=\"alert.type=='warning'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> <div class=\"alert alert-danger alert-dismissable\" ng-if=\"alert.type=='failed'\"> <a ng-href=\"\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a> <strong>{{alert.message.strong}}</strong> {{alert.message.text}} </div> </div> <div class=\"device-list-header\"> <button type=\"button\" class=\"btn btn-info add-button\" ng-click=\"update_device()\"><b>Update</b></button> <button type=\"button\" class=\"btn btn-danger add-button margin-right\" ng-click=\"deleteDeviceInInternalServer()\"><b>Delete</b></button> </div> <!--\n" +
    "<div>\n" +
    "\t<h2 ng-click=\"getPollingDataLog();\"> <b>Polling Data Log</b> </h2>\n" +
    "\t<div class=\"overflow-box\">\n" +
    "\t<div style=\"border: 1px solid black; padding:5px;\" ng-repeat=\"log in polling_data_log\">\n" +
    "\t\t<div ng-repeat=\"s_log in log\">\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<a href=\"\" data-toggle=\"tooltip\" title=\"{{s_log.algorithm}}\">{{s_log.value}}</a>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "-->"
  );

}]);
