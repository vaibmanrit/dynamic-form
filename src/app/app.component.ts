import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  jsonInput: string = ''; // Stores the JSON input
  formFields: any[] = []; // Holds parsed form fields
  formStructure: { [category: string]: { [subCategory: string]: any[] } } = {};
  dynamicForm: FormGroup; // Angular FormGroup
  Object = Object;

  constructor(private fb: FormBuilder) {
    this.dynamicForm = this.fb.group({});
  }

  generateForm(): void {
    try {
      // Parse JSON input
      this.formFields = JSON.parse(this.jsonInput);

      // Build form structure
      this.formStructure = {};
      this.formFields.forEach((field) => {
        const category = field.category;
        const subCategory =
          field.sub_category && !field.sub_category.startsWith('blank')
            ? field.sub_category
            : 'General'; // Use "General" if sub_category is invalid

        // Initialize category and subcategory if not already present
        if (!this.formStructure[category]) {
          this.formStructure[category] = {};
        }
        if (!this.formStructure[category][subCategory]) {
          this.formStructure[category][subCategory] = [];
        }

        // Add field to the appropriate subcategory
        this.formStructure[category][subCategory].push(field);

        // Add form control with validations
        const controlValidators = [];
        if (field.required) {
          controlValidators.push(Validators.required);
        }
        this.dynamicForm.addControl(
          field.field_name,
          this.fb.control(
            field.default_value.length > 0 ? field.default_value : '',
            controlValidators
          )
        );
      });
    } catch (error) {
      alert('Invalid JSON! Please provide valid JSON input.');
    }
  }

  onFileChange(event: any, fieldName: string) {}

  onSubmit(): void {
    if (!this.dynamicForm.valid) {
      console.log('Form Values:', this.dynamicForm.value);
      alert('Form Submitted Successfully! Check the console for values.');
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
