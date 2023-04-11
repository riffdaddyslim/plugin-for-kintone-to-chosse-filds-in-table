((PLUGIN_ID) => {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  kintone.events.on(['app.record.detail.show', 'app.record.create.show', 'app.record.edit.show'], (event) => {
    const record = event.record;
    const attachmentFields = [];

    // Collect all attachment fields in the record
    const collectAttachmentFields = (field) => {
      if (field.type === 'FILE') {
        attachmentFields.push(field);
      }
      if (field.type === 'SUBTABLE') {
        field.value.forEach((row) => {
          Object.values(row.value).forEach(collectAttachmentFields);
        });
      }
      if (field.type === 'GROUP') {
        field.element.childNodes.forEach((childNode) => {
          const childField = kintone.app.record.getFieldElement(childNode.id);
          collectAttachmentFields(childField);
        });
      }
    };
    Object.values(record).forEach(collectAttachmentFields);

    // Loop through each attachment field and set the allowed file extensions
    attachmentFields.forEach((field) => {
      const fieldName = field.name;
      const allowedExtensions = config.allowedExtensions.split(',');
      const fileInput = kintone.app.record.getFieldElement(fieldName);
      if (fileInput) {
        fileInput.accept = allowedExtensions.map((ext) => '.' + ext).join(',');
      }
    });
    return event;
  });

})(kintone.$PLUGIN_ID);
