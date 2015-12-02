(function () {
  'use strict';

  /**
   * Service used for the Data Explorer part of the admin panel.
   */
  angular.module('frontend.strapi.explorer')
    .factory('explorerService', explorerService);

  explorerService.$inject = ['_', '$filter'];

  function explorerService(_, $filter) {

    var service = {};
    var optionsFields = getOptionsFields();

    // Function used in the data explorer edit view.
    service.generateFormFields = generateFormFields;
    service.generateCreatedUpdatedField = generateCreatedUpdatedField;

    return service;

    // Private functions.

    function generateFormFields(attributes) {
      // Init the list of fields.
      var fields = [];

      // For each attributes of the model.
      angular.forEach(attributes, function (attribute, key) {
        // The attribute must be an object.
        if (!angular.isObject(attribute)) {
          return;
        }

        // Format values.
        attribute = attribute || {};
        attribute.type = optionsFields[attribute.type] ? attribute.type : 'string';

        // Filter attributes having relations (model or collection).
        if (attribute.model || attribute.collection) {
          return;
        }

        // Skip theses keys.
        var ignoredKeys = ['id', 'template', 'id_ref', 'lang', 'createdAt', 'updatedAt'];
        if (ignoredKeys.indexOf(key) > -1) {
          return;
        }

        // Init the field object.
        var field = angular.copy(optionsFields[attribute.type]) || {};

        // Disabled keys.
        var disabledKeys = [];
        if (disabledKeys.indexOf(key) > -1) {
          field = angular.copy(optionsFields.string);
          field.templateOptions.disabled = true;
        }

        // Set the key as a value of the field.
        field.key = key;

        // Format label and placeholder for better display.
        field.templateOptions.label = $filter('humanize')(key);
        field.templateOptions.placeholder = field.templateOptions.placeholder || _.capitalize(key);

        // Specific attributes.
        angular.forEach(field.templateOptions.waterlineOptions, function (waterlineAttr, key) {
          if (attribute[waterlineAttr]) {
            field.templateOptions[key] = attribute[waterlineAttr];
          } else {
            delete field.templateOptions[key];
          }
        });

        // Delete the waterlineOptions object
        delete field.waterlineOptions;

        // Auto focus on first field.
        if (fields.length === 0) {
          field.templateOptions.focus = true;
        }

        // Finally push to the fields list
        fields.push(field);
      });

      return fields;
    }

    /**
     * Function used to generate `createdAt` and `updatedAt` fields.
     *
     * @param item
     * @returns {Array}
     */

    function generateCreatedUpdatedField(item) {
      var fields = [];

      var createdAtField = angular.copy(optionsFields.date) || {};
      createdAtField.key = 'createdAt';
      createdAtField.name = 'createdAt';
      createdAtField.templateOptions.label = 'Created At';
      createdAtField.templateOptions.placeholder = 'Created At';
      fields.push(createdAtField);

      if (item.id) {
        var updatedAtField = angular.copy(optionsFields.date) || {};
        updatedAtField.key = 'updatedAt';
        updatedAtField.name = 'updatedAt';
        updatedAtField.templateOptions.label = 'Updated At';
        updatedAtField.templateOptions.placeholder = 'Updated At';
        fields.push(updatedAtField);
      }

      return fields;
    }

    /**
     * Simple function which returns the list of possible Waterline possible attributes
     * with appropriated options for the `angular-formly` module.
     *
     * @returns {{}}
     */

    function getOptionsFields() {
      return {
        string: {
          type: 'input',
          templateOptions: {
            type: 'text',
            waterlineOptions: {
              // Waterline
              minlength: 'minLength',
              maxlength: 'maxLength',
              required: 'required'
            }
          }
        },
        email: {
          type: 'input',
          templateOptions: {
            type: 'email',
            waterlineOptions: {
              // Waterline
              minlength: 'minLength',
              maxlength: 'maxLength',
              required: 'required'
            }
          }
        },
        text: {
          type: 'textarea',
          templateOptions: {
            type: 'text',
            waterlineOptions: {
              // Waterline
              minlength: 'minLength',
              maxlength: 'maxLength',
              required: 'required'
            }
          }
        },
        integer: {
          type: 'input',
          templateOptions: {
            type: 'number',
            waterlineOptions: {
              // Waterline
              min: 'min',
              max: 'max',
              required: 'required'
            }
          }
        },
        float: {
          type: 'input',
          templateOptions: {
            type: 'number',
            waterlineOptions: {
              // Waterline
              min: 'min',
              max: 'max',
              required: 'required'
            }
          }
        },
        date: {
          type: 'datepicker',
          templateOptions: {
            label: 'Date',
            type: 'text',
            datepickerPopup: 'dd-MMMM-yyyy'
          }
        },
        datetime: {
          type: 'datepicker',
          templateOptions: {
            label: 'Date',
            type: 'text',
            datepickerPopup: 'dd-MMMM-yyyy'
          }
        },
        boolean: {
          type: 'radio',
          templateOptions: {
            options: [
              {
                name: 'True',
                value: true
              },
              {
                name: 'False',
                value: false
              },
              {
                name: 'Unknown',
                value: undefined
              }
            ]
          }
        },
        // Not supported yet
        // binary: {},
        array: {
          type: 'array',
          templateOptions: {
            placeholder: 'Insert values separated with comas.'
          }
        },
        json: {
          type: 'json',
          templateOptions: {
            placeholder: 'Insert a valid JSON.'
          }
        }
      };
    }
  }
})();
