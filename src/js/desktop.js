((PLUGIN_ID) => {
  'use strict';

  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  const allowedExtensions = config.allowedExtensions || [];

  // Check if a file has an allowed extension
  const hasAllowedExtension = (fileName) => {
    const fileExtension = fileName.split('.').pop();
    return allowedExtensions.includes(fileExtension);
  };

  // Add validation message for file type
  const addValidationMessage = (fieldElement) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'error-message';
    messageElement.innerText = `Only files with extensions: ${allowedExtensions.join(', ')} are allowed.`;
    fieldElement.parentNode.insertBefore(messageElement, fieldElement.nextSibling);
  };

  // Remove validation message for file type
  const removeValidationMessage = (fieldElement) => {
    const messageElement = fieldElement.parentNode.querySelector('.error-message');
    if (messageElement) {
      messageElement.remove();
    }
  };

  // Add file validation to a file input element
  const addFileValidation = (fieldElement) => {
    fieldElement.addEventListener('change', () => {
      const file = fieldElement.files[0];
      if (file && !hasAllowedExtension(file.name)) {
        addValidationMessage(fieldElement);
        fieldElement.value = '';
      } else {
        removeValidationMessage(fieldElement);
      }
    });
  };

  // Add file validation to all file input elements
  const addValidationToAllFields = () => {
    const attachmentFields = kintone.app.record.getSpaceElements('attachment');
    attachmentFields.forEach((field) => {
      const fileInputs = field.querySelectorAll('input[type="file"]');
      fileInputs.forEach((fileInput) => {
        addFileValidation(fileInput);
      });
    });

    const tableFields = kintone.app.record.getRelatedRecordsTargetFields('attachment');
    tableFields.forEach((tableField) => {
      const fileInputs = tableField.querySelectorAll('input[type="file"]');
      fileInputs.forEach((fileInput) => {
        addFileValidation(fileInput);
      });
    });
  };

  addValidationToAllFields();

})(kintone.$PLUGIN_ID);
