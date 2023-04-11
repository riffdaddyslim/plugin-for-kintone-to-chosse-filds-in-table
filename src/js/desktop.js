((PLUGIN_ID) => {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  const restrictFileType = (fileType) => {
    const allowedExtensions = config.allowedExtensions;
    const allowedExtensionsArr = allowedExtensions.split(',').map(el => el.trim());
    const fieldSelection = config.fieldSelection;


    console.log(fieldSelection);
    console.log(fileType, '=======fileType=====');
    console.log(allowedExtensions, '=======allowedExtensions=====');
    console.log(allowedExtensionsArr, '=======allowedExtensionsArr=====');
    console.log(fieldSelection, '=======fieldSelection=====');

    for (let i of fileType) {
      const fieldName = Object.keys(i).join();
      const allowedInsetedType = Object.values(i).join();
      console.log(fieldName, '=========i============');


      // if (fieldName === fieldSelection) {
        console.log(allowedInsetedType, '================!!!!!!!!!!!allowedInsetedType!!!!!!!!!!!!===========');
        if (allowedExtensionsArr.includes(allowedInsetedType)) {
          console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        } else {
          return alert(`Olnly allowed ${allowedExtensions} types of files`);
        }
      }
    }
  // };


  // app.record.detail.show - event for individual item
  kintone.events.on('app.record.detail.show', (event) => {
    const record = event.record;
    const tableFiles = record.Table.value[0].value;
    let attachmentFields = [];

    for (let key in tableFiles) {
      if (tableFiles[key].type === 'FILE') {
        let obj = {};

        let values = tableFiles[key].value;
        let temp;

        if (values.length > 0) {
          for (let value of values) {
            temp = value.contentType;
            console.log(temp, '================temp =============');
          }
        }
        obj[key] = temp;

        attachmentFields.push(obj);
      }
    }

    console.log(attachmentFields, '==================attachmentFields==============');

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


    console.log(record, '=================redord================');
    console.log(tableFiles, '=================tableFiles =================');

    restrictFileType(attachmentFields);
    return event;
  });


  kintone.events.on('app.record.create.show', (event) => {
    const record = event.record;
    const tableFiles = record.Table.value[0].value;
    let attachmentFields = [];

    for (let key in tableFiles) {
      if (tableFiles[key].type === 'FILE') {
        let obj = {};
        obj[key] = tableFiles[key].value[0]?.contentType;
        attachmentFields.push(obj);
      }
    }

    restrictFileType(attachmentFields);
    return event;
  });


  kintone.events.on('app.record.edit.show', (event) => {
    const record = event.record;
    const tableFiles = record.Table.value[0].value;
    let attachmentFields = [];

    for (let key in tableFiles) {
      if (tableFiles[key].type === 'FILE') {
        let obj = {};
        obj[key] = tableFiles[key].value[0]?.contentType;
        attachmentFields.push(obj);
      }
    }

    restrictFileType(attachmentFields);
    return event;
  });


})(kintone.$PLUGIN_ID);
