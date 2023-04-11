((PLUGIN_ID) => {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  const allowedExtensions = config.allowedExtensions;
  const fieldSelection = config.fieldSelection;

  const restrictFileType = (fileType) => {
    const allowedExtensionsArr = allowedExtensions.split(',').map(el => el.trim());
    return allowedExtensionsArr.includes(fileType);
  };


  kintone.events.on(['app.record.detail.show', 'app.record.create.show', 'app.record.edit.show'], (event) => {
    const record = event.record;
    const tableFiles = record.Table.value[0].value;

    for (let key in tableFiles) {
      if (tableFiles[key].type === 'FILE') {
        let obj = {};
        let values = tableFiles[key].value;
        let attachmentField;


        if (values.length > 0) {
          for (let value of values) {
            attachmentField = value.contentType;

            if (!restrictFileType(attachmentField)) {
              alert(`Please chose only ${allowedExtensions}`);
              return;
            }
          }
        }
      }
    }


    //
    // var body = {'app': 2};
    // kintone.api(kintone.api.url('/k/v1/app/form/layout', true), 'GET', body, function(resp) {
    //   const table = resp.layout.find(el => el.code === 'Table');
    //   const field = table.fields.filter(el => el.type === 'FILE');
    //
    //
    //   console.log(resp, '==================resp==============');
    //   console.log(table, '==================table==============');
    //   console.log(field, '==================field==============');
    //
    // }, function(error) {
    //   console.log(error, '==================err==============');
    // });


    return event;
  });


})(kintone.$PLUGIN_ID);
